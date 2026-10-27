import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import footnote from "markdown-it-footnote";
import path from 'path'

const baseTemp = {
  base: 'REPLACE_ME_DOCUMENTER_VITEPRESS',// TODO: replace this in makedocs!
}

const navTemp = {
  nav: 'REPLACE_ME_DOCUMENTER_VITEPRESS',
}

// No VersionPicker: since 2026-09-03 the site has one published version (the root); the CI-built
// dev/ tree and versions.js are retired (GoMetaPublic publish gate, decision D13).
const nav = [
  ...navTemp.nav,
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: 'REPLACE_ME_DOCUMENTER_VITEPRESS',// TODO: replace this in makedocs!
  title: 'REPLACE_ME_DOCUMENTER_VITEPRESS',
  // literal (not the REPLACE_ME slot): the builder's default is "Documentation for <sitename>".
  // The site-wide one-liner (owner ruling 2026-09-11, 74 chars, within WhatsApp's "80 characters
  // will suffice"): the <meta name=description> of every page that carries no `description:`
  // of its own and the og:description of every inner-page card (see transformHead below).
  // The front page carries its own `description:` (the owner's full slide-8 sentence).
  description: 'GoMeta — between, behind, within your data: any language, any file format.',
  // lastUpdated: off (2026-09-13) — it rendered nothing: the gate builds from a copied tree without git dates.
  cleanUrls: true,
  outDir: 'REPLACE_ME_DOCUMENTER_VITEPRESS', // This is required for MarkdownVitepress to work correctly...
  // Per-page link-preview tags for every page EXCEPT the front page (which keeps the
  // hand-written card in `head` below) and the 404 page: a shared inner link previews as
  // itself — its "<page title> | GoMeta" title, its own description (frontmatter
  // `description:` if a page carries one, else the site description above) and its own
  // clean URL, instead of the front page's card with og:url = the root (the state before
  // 2026-09-11). Dedupe rule (VitePress 1.6.4 mergeHead/hasTag): a site-level meta is dropped
  // when a returned entry carries the same value for the SITE entry's FIRST attribute — so
  // `property`/`name` must stay the first key of the site-level og entries below, and each
  // returned entry must carry that attribute. Verified in the built HTML: one og:title /
  // og:description / og:url per page (previews/<id>/heads.txt).
  // /talk/ is a verbatim public/ asset that no hook reaches: its tags live in
  // docs/src/public/talk/index.html.
  transformHead({ pageData, title, description }) {
    const rel = pageData.relativePath
    if (rel === 'index.md' || rel === '404.md') return []
    const p = rel.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    return [
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: `https://gometa.dev/${p}` }],
    ]
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    // Declares light+dark support to the UA. LOAD-BEARING for Android Chrome's
    // "Darken websites" auto-dark: without it Chrome inverts the light theme into
    // near-black instead of letting the site serve its own brown dark theme.
    ['meta', { name: 'color-scheme', content: 'light dark' }],
    // Link-preview card of the FRONT PAGE (WhatsApp, Signal, iMessage, …): owner ruling
    // 2026-09-12, card F4 (title 42 / description 65 chars; supersedes card A of 2026-09-11) —
    // the owner's own words, the same voice as the site-wide line above; no product names.
    // WhatsApp shows the title in at most 2 lines and "80 characters will suffice" for the
    // description (Meta's link-preview doc; a sent card showed 55 in full on 2026-09-12);
    // Signal reads og:title → <title>, og:description, og:image → favicon. Inner pages get
    // their own og:title/og:description/og:url from transformHead (same-property entries
    // replace these; og:image and the rest stay site-wide).
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'GoMeta' }],
    ['meta', { property: 'og:title', content: 'GoMeta — between, behind, within your data' }],
    ['meta', { property: 'og:description', content: 'Designed to work in any programming language and any file format.' }],
    ['meta', { property: 'og:image', content: 'https://gometa.dev/og-card.jpg' }],
    ['meta', { property: 'og:image:width', content: '2048' }],
    ['meta', { property: 'og:image:height', content: '1339' }],
    ['meta', { property: 'og:url', content: 'https://gometa.dev/' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // versions.js is no longer served (single published version; see the nav comment above)
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
    // math: off (2026-09-13) — no page needs it; with it on, the mirrored canonical-output page showed two MathJax error boxes.
    config(md) {
      md.use(tabsMarkdownPlugin),
      md.use(footnote)
      // The WORD "GoMeta" carries the brand wordmark face in running text (owner
      // 2026-08-27); .gm-name in overrides.css holds the type. Hooking the renderer's
      // TEXT rule is what makes this safe: code spans (code_inline), fences (fence)
      // and image alt / link titles (renderInlineAsText) never route through it, so
      // no code sample and no attribute value can be rewritten. index.md is one big
      // @raw html block and carries its spans literally instead.
      // "GoMeta.jl" is the PACKAGE NAME and takes the treatment whole - unlike
      // "GoMeta's", where the possessive is grammar and stays in the body face
      // (owner 2026-08-27). Package-name URLs and Pkg.add strings are unaffected:
      // they live in link destinations and code spans, neither of which is text.
      const gmDefaultText = md.renderer.rules.text!
      md.renderer.rules.text = (tokens, idx, options, env, self) =>
        gmDefaultText(tokens, idx, options, env, self)
          .replace(/\bGoMeta(?:\.jl)?\b/g, m => `<span class="gm-name">${m}</span>`)
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
      // Every OTHER fence (untagged, julia, …): the default renderer's HTML is post-processed so that a
      // GoMeta marker token at a word boundary (#~, #~n, #~!, #], //~, %~ — the inline rule's token set)
      // is wrapped in <span class="gm-sg">, the fences' sigil pink (owner 2026-10-19: the markers'
      // presentation on every page, not only in the gometa fences and the prose code spans). Markup
      // only — the text, and what the copy button copies, is unchanged; the escaped text holds no '<'
      // and no '&' inside a marker, and a marker never stands inside a tag's attributes.
      // A marker counts after whitespace, a tag end, an opening quote, bracket or parenthesis or an
      // equals sign (the printouts quote a Component's text — &quot;#~ hide …&quot; — and the tree
      // view brackets it), and before whitespace, a tag, a closing quote or bracket, or the end.
      // The printouts write a newline inside a quoted Component text as the symbol ⏎ (U+23CE): a
      // marker after it stands at a line start and counts too.
      const gmFenceMark = /(^|[\s>"'\[(=⏎]|&quot;|&#39;)((?:#|\/\/|%)~[0-9~]*!?|#\])(?=[\s<"'\])\[⏎]|&quot;|&#39;|$)/g
      const gmMarkFence = (html: string): string => {
        const open = html.indexOf('<code'), close = html.lastIndexOf('</code>')
        if (open < 0 || close < open) return html
        const start = html.indexOf('>', open) + 1
        const inner = html.slice(start, close).replace(gmFenceMark, (_m, pre, t) => `${pre}<span class="gm-sg">${t}</span>`)
        return html.slice(0, start) + inner + html.slice(close)
      }
      // Which fences take it (owner 2026-10-19 09:35): the SAMPLES — what a user would type into an
      // editor: the julia-tagged fences (and the gometa fences, by their own rule below). The
      // PRINTOUTS — the development tools' views and every other printout, which are the untagged
      // fences — keep their own style: no marker pink inside them.
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const tok = tokens[idx]
        const lang = tok.info.trim()
        if (lang !== 'gometa') {
          const html = gmDefaultFence(tokens, idx, options, env, self)
          return lang === 'julia' ? gmMarkFence(html) : html
        }
        let inStr = false
        const out: string[] = []
        for (const raw of tok.content.replace(/\n$/, '').split('\n')) {
          const [html, next] = gmLine(raw, inStr)
          inStr = next
          out.push(html)
        }
        return `<div class="language-gometa vp-adaptive-theme gm-syn"><button title="Copy Code" class="copy"></button><span class="lang">gometa</span><pre class="shiki" tabindex="0"><code>${out.join('\n')}</code></pre></div>\n`
      }
      // Inline code spans (owner 2026-10-17, STYLE-1 — chosen from the style trials of that day):
      // a GoMeta marker inside a code span — the fence rule's sigil tokens (#~, #~n, #~!, #])
      // widened to the C family's //~ and LaTeX's %~ — is wrapped in <span class="gm-sg"> (the
      // fence's class; overrides.css colours it in the fences' sigil pink, bold), and a span that
      // STARTS with a marker (a whole statement) carries class gm-ml on its <code> (markup kept
      // for a later style; no rule colours it today — the ruling is THE MARKER ONLY). A marker
      // counts at the span's start or after whitespace, and before whitespace or the end. Markup
      // only: the colours are the theme's. The default renderer's output is post-processed
      // between its first '>' and the closing tag — the text there is already escaped, and a
      // marker holds no '<' and no '&'.
      // Since the owner's note of 2026-10-19 a marker also counts after an opening parenthesis,
      // bracket or quote inside the span, and before a closing one (e.g. `(#~ …)`), not only at
      // the span's start or after whitespace.
      // (the span's text is already escaped when it is post-processed: a quote is &quot;)
      const gmMarkAny = /(^|[\s(\["']|&quot;)((?:#|\/\/|%)~[0-9~]*!?|#\])(?=[\s)\]"']|&quot;|$)/
      const gmMarkAll = /(^|[\s(\["']|&quot;)((?:#|\/\/|%)~[0-9~]*!?|#\])(?=[\s)\]"']|&quot;|$)/g
      const gmMarkHead = /^((?:#|\/\/|%)~[0-9~]*!?|#\])(?=\s|$)/
      const gmDefaultCodeInline = md.renderer.rules.code_inline!
      // No break inside a short token of a prose code span (GoMeta's creator, 2026-10-26): a label name
      // such as label🌲 was cut between the word and the pictograph at a line's end, a signed form such as
      // :-label1 after its sign, a call such as Vector{UInt8}(codeunits(s)) between } and ( — the
      // stylesheet's word-break: keep-all binds none of these. Markup only, the text unchanged: a TOKEN,
      // a whitespace-free run of the span's text, is wrapped in <span class="gm-nb"> (overrides.css:
      // white-space: nowrap) when it measures 2 to GM_NB_MAX cells, so that it is never wider than the
      // narrowest prose column — 28 cells are 247.2 px at the body size (8.4 px a cell + the chip's 12 px)
      // against 252 px at a 320 px viewport, 217.8 px in the 14 px contexts against 238 px. A pictograph
      // glyph is about 2.1 cells wide in the site's code font and counts 3 (safe for any emoji font); a
      // presentation selector (U+FE0E, U+FE0F), a joiner, a skin-tone modifier and a tag character
      // (U+E0020–E007F) add no width and count 0; the keycap mark U+20E3 counts 0 too, so a keycap sequence
      // (# or a digit with it, one wide glyph) is under-counted at 1 — none stands in the site's text; every
      // other code point 1. A longer token is left to the browser: it wraps at /, - and the commas and,
      // when wider than the column, by the emergency break (the theme's overflow-wrap: break-word on p
      // and li); nowrap would clip it. The pass runs after the marker pass, so a token may hold the
      // <span class="gm-sg">…</span> a marker got: the run pattern steps over a tag as one unit (the
      // space inside a tag never splits a token) and the spans nest gm-nb > gm-sg. The text is escaped
      // when it is post-processed (markdown-it escapes & < > " and nothing else), so a raw '<' is always
      // a tag and an entity is one character of the count.
      const GM_NB_MAX = 28
      const gmNbPicto = /[\p{Extended_Pictographic}\p{Regional_Indicator}\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/u
      const gmNbMod = /[\u{FE0E}\u{FE0F}\u{200D}\u{20E3}\u{1F3FB}-\u{1F3FF}\u{E0020}-\u{E007F}]/u
      const gmNbRun = /(?:<[^>]*>|[^\s<])+/gu
      const gmNbCells = (run: string): number => {
        let n = 0
        for (const ch of run.replace(/<[^>]*>/g, '').replace(/&(?:amp|lt|gt|quot);/g, 'x')) n += gmNbMod.test(ch) ? 0 : gmNbPicto.test(ch) ? 3 : 1
        return n
      }
      const gmNoBreak = (inner: string): string =>
        inner.replace(gmNbRun, (run) => { const n = gmNbCells(run); return n >= 2 && n <= GM_NB_MAX ? `<span class="gm-nb">${run}</span>` : run })
      // A table cell gets no no-break spans (GoMeta's creator, 2026-10-27): Chrome sizes a cell's column from its
      // longest token, and a span boundary inside the chip changes that measure by the chip's padding (the Syntax
      // page's condition table at 320–360 px: one column 6 px narrower, one cell a line taller), while no token
      // inside a table cell was ever cut at any width. The cell's open and close tokens set a flag on the page's
      // render environment; the tags themselves are written as before (an earlier rule, if any, still runs).
      for (const [cellOpen, cellClose] of [['td_open', 'td_close'], ['th_open', 'th_close']] as const) {
        const prevOpen = md.renderer.rules[cellOpen], prevClose = md.renderer.rules[cellClose]
        md.renderer.rules[cellOpen] = (tokens, idx, options, env, self) => {
          env.gmInCell = true
          return prevOpen ? prevOpen(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options)
        }
        md.renderer.rules[cellClose] = (tokens, idx, options, env, self) => {
          env.gmInCell = false
          return prevClose ? prevClose(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options)
        }
      }
      md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
        const tok = tokens[idx]
        const marked = gmMarkAny.test(tok.content)
        if (marked && gmMarkHead.test(tok.content)) tok.attrJoin('class', 'gm-ml')
        const html = gmDefaultCodeInline(tokens, idx, options, env, self)
        const open = html.indexOf('>') + 1, close = html.lastIndexOf('</code>')
        if (open <= 0 || close < open) return html
        let inner = html.slice(open, close)
        if (marked) inner = inner.replace(gmMarkAll, (_m, pre, t) => `${pre}<span class="gm-sg">${t}</span>`)
        return html.slice(0, open) + (env && env.gmInCell ? inner : gmNoBreak(inner)) + html.slice(close)
      }
    },
    theme: {
      // high-contrast light: github-light's keyword/comment tokens sink under
      // 4.5:1 on the warm code bg #ece0c8 (measured 3.50 / 3.68)
      light: "github-light-high-contrast",
      dark: "github-dark-dimmed"},
    codeTransformers: [
      { pre(node) { node.properties.tabindex = 0 } },  // keyboard-focusable scrollable code (WCAG 2.1.1)
      { span(node) {
          // gh-light-high-contrast comments (#66707B) still land at 3.85:1 on the
          // warm code bg #ece0c8; darken to #4B535D (5.96:1). Light-only token.
          const s = node.properties?.style
          if (typeof s === 'string' && s.includes('--shiki-light:#66707B')) {
            node.properties.style = s.replace('--shiki-light:#66707B', '--shiki-light:#4B535D')
          }
        } }
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
      // deliberate literal: the nav GitHub icon targets the PRODUCT repo, not the
      // site-source repo the builder would inject (editLink stays builder-injected)
      { icon: 'github', link: 'https://github.com/gometa-jl/GoMeta.jl' }
    ],
    footer: {
      message: '<span class="gm-name">GoMeta</span> evaluates — Extensions act · <a href="mailto:hello@gometa.dev">hello@gometa.dev</a><br>Made with <a href="https://luxdl.github.io/DocumenterVitepress.jl/dev/" target="_blank"><strong>DocumenterVitepress.jl</strong></a>',
      copyright: `© Copyright ${new Date().getUTCFullYear()}.`
    }
  }
})
