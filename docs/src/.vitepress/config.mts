import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import mathjax3 from "markdown-it-mathjax3";
import footnote from "markdown-it-footnote";
import path from 'path'

function getBaseRepository(base: string): string {
  if (!base || base === '/') return '/';
  const parts = base.split('/').filter(Boolean);
  return parts.length > 0 ? `/${parts[0]}/` : '/';
}

const baseTemp = {
  base: 'REPLACE_ME_DOCUMENTER_VITEPRESS',// TODO: replace this in makedocs!
}

const navTemp = {
  nav: 'REPLACE_ME_DOCUMENTER_VITEPRESS',
}

const nav = [
  ...navTemp.nav,
  {
    component: 'VersionPicker'
  }
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: 'REPLACE_ME_DOCUMENTER_VITEPRESS',// TODO: replace this in makedocs!
  title: 'REPLACE_ME_DOCUMENTER_VITEPRESS',
  description: 'REPLACE_ME_DOCUMENTER_VITEPRESS',
  lastUpdated: true,
  cleanUrls: true,
  outDir: 'REPLACE_ME_DOCUMENTER_VITEPRESS', // This is required for MarkdownVitepress to work correctly...
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:title', content: 'GoMeta — interpretable metadata for source files' }],
    ['meta', { property: 'og:description', content: 'One #~ comment line makes a file retrievable, interlinkable, re-renderable, and shareable on your terms — read by tools, never run by them.' }],
    ['meta', { property: 'og:image', content: 'https://gometa.dev/og-card.jpg' }],
    ['meta', { property: 'og:url', content: 'https://gometa.dev/' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['script', {src: `${getBaseRepository(baseTemp.base)}versions.js`}],
    // ['script', {src: '/versions.js'], for custom domains, I guess if deploy_url is available.
    ['script', {src: `${baseTemp.base}siteinfo.js`}]
  ],
  
  vite: {
    define: {
      __DEPLOY_ABSPATH__: JSON.stringify('REPLACE_ME_DOCUMENTER_VITEPRESS_DEPLOY_ABSPATH'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../components')
      }
    },
    optimizeDeps: {
      exclude: [ 
        '@nolebase/vitepress-plugin-enhanced-readabilities/client',
        'vitepress',
        '@nolebase/ui',
      ], 
    }, 
    ssr: { 
      noExternal: [ 
        // If there are other packages that need to be processed by Vite, you can add them here.
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/ui',
      ], 
    },
  },
  markdown: {
    math: true,
    config(md) {
      md.use(tabsMarkdownPlugin),
      md.use(mathjax3),
      md.use(footnote)
      // ```gometa fences: deck-faithful flavor coloring (sigil/meta/text/code/comment)
      // via theme CSS tokens — shiki has no GoMeta grammar, and the flavor colors are
      // brand surface, so they must follow the light/dark token set, not a shiki theme.
      const gmEsc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      const gmSpan = (cls: string, s: string) => s.length ? `<span class="${cls}">${gmEsc(s)}</span>` : ''
      const gmMeta = (rest: string): string => {
        const m = rest.match(/(^|\s)##(\s|$)/)
        if (m && m.index !== undefined) {
          const cut = m.index + m[1].length
          return gmSpan('gm-mt', rest.slice(0, cut)) + gmSpan('gm-cm', rest.slice(cut))
        }
        return gmSpan('gm-mt', rest)
      }
      const gmInline = (base: string, cls: string): string => {
        const m = base.match(/\s(#~[0-9~]*!?|#\])(?=\s|$)/)
        if (m && m.index !== undefined) {
          const cut = m.index + 1
          const head = base.slice(0, cut), tok = m[1], rest = base.slice(cut + tok.length)
          return gmSpan(cls, head) + gmSpan('gm-sg', tok) + gmMeta(rest)
        }
        return gmSpan(cls, base)
      }
      const gmLine = (line: string, inStr: boolean): [string, boolean] => {
        if (line.trim() === '') return ['', inStr]
        if (inStr) return [gmInline(line, 'gm-tx'), !/"""/.test(line)]
        if (/^\s*md"""/.test(line)) return [gmInline(line, 'gm-tx'), true]
        let m = line.match(/^(\s*)(#~[0-9~]*!?|#\])(?=[\s[]|$)/)
        if (m) {
          const head = m[1] + m[2]
          return [gmSpan('gm-sg', head) + gmMeta(line.slice(head.length)), false]
        }
        if (/^\s*##(\s|$)/.test(line)) return [gmSpan('gm-cm', line), false]
        if (/^\s*#(\s|$)/.test(line)) return [gmInline(line, 'gm-tx'), false]
        const t = line.match(/\s(#~[0-9~]*!?|#\]|##|#)(?=\s|$)/)
        if (t && t.index !== undefined) {
          const cut = t.index + 1, tok = t[1], rest = line.slice(cut + tok.length)
          const head = gmSpan('gm-cd', line.slice(0, cut))
          if (tok.startsWith('#~') || tok === '#]') return [head + gmSpan('gm-sg', tok) + gmMeta(rest), false]
          if (tok === '##') return [head + gmSpan('gm-cm', tok + rest), false]
          return [head + gmSpan('gm-tx', tok + rest), false]
        }
        return [gmSpan('gm-cd', line), false]
      }
      const gmDefaultFence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const tok = tokens[idx]
        if (tok.info.trim() !== 'gometa') return gmDefaultFence(tokens, idx, options, env, self)
        let inStr = false
        const out: string[] = []
        for (const raw of tok.content.replace(/\n$/, '').split('\n')) {
          const [html, next] = gmLine(raw, inStr)
          inStr = next
          out.push(html)
        }
        return `<div class="language-gometa vp-adaptive-theme gm-syn"><span class="lang">gometa</span><pre class="shiki" tabindex="0"><code>${out.join('\n')}</code></pre></div>\n`
      }
    },
    theme: {
      light: "github-light",
      dark: "github-dark-dimmed"},
    codeTransformers: [
      { pre(node) { node.properties.tabindex = 0 } }  // keyboard-focusable scrollable code (WCAG 2.1.1)
    ]
  },
  themeConfig: {
    outline: { level: [2, 3], label: 'On this page' },
    siteTitle: 'GoMeta',
    lightModeSwitchTitle: 'Switch to light theme',
    darkModeSwitchTitle: 'Switch to dark theme',
    logo: { light: '/favicon_light.svg', dark: '/favicon_dark.svg' },
    search: {
      provider: 'local',
      options: {
        detailedView: true
      }
    },
    nav,
    sidebar: 'REPLACE_ME_DOCUMENTER_VITEPRESS',
    editLink: 'REPLACE_ME_DOCUMENTER_VITEPRESS',
    socialLinks: [
      { icon: 'github', link: 'REPLACE_ME_DOCUMENTER_VITEPRESS' }
    ],
    footer: {
      message: 'GoMeta — evaluated, never executed. · <a href="mailto:hello@gometa.dev">hello@gometa.dev</a><br>Made with <a href="https://luxdl.github.io/DocumenterVitepress.jl/dev/" target="_blank"><strong>DocumenterVitepress.jl</strong></a>',
      copyright: `© Copyright ${new Date().getUTCFullYear()}.`
    }
  }
})
