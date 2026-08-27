// .vitepress/theme/index.ts
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme as ThemeConfig } from 'vitepress'

import { 
  NolebaseEnhancedReadabilitiesMenu, 
  NolebaseEnhancedReadabilitiesScreenMenu, 
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'

import VersionPicker from "@/VersionPicker.vue"
import AuthorBadge from '@/AuthorBadge.vue'
import Authors from '@/Authors.vue'

import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'
import './style.css' // You could setup your own, or else a default will be copied.
import './docstrings.css' // You could setup your own, or else a default will be copied.
import './overrides.css' // GoMeta brand theme — loaded last so its tokens win.

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // first-draft banner (launch window; remove after polish)
      'layout-top': () => h('div', { class: 'gm-draft-banner' }, [
        h('span', { class: 'gm-draft-pill' }, [
          '🚧 ',
          // the banner is Vue-rendered, so the wordmark span is built here rather
          // than by the markdown text rule (owner 2026-08-27)
          h('strong', [
            'ATTENTION: ',
            h('span', { class: 'gm-name' }, 'GoMeta'),
            "\u2019s current docs & Co. are largely written by Claude due to limited resources and to get them done in time for JuliaCon2026.",
          ]),
          h('br'),
          'They are quite comprehensive and ',
          h('strong', 'mostly'),
          ' correct. However, even I get confused by them and the emphasis is often not where I would put it.',
          h('br'),
          'They will be updated gradually. For now, ',
          h('strong', [
            'check out the JuliaCon slides ',
            // target=_self is LOAD-BEARING: /talk/ is a public/ asset, not a
            // VitePress page; without it the SPA router eats the click (404).
            h('a', { href: '/talk/', target: '_self' }, 'here 🔗'),
          ]),
          '.',
        ]),
      ]),
      'nav-bar-content-after': () => [
        h(NolebaseEnhancedReadabilitiesMenu), // Enhanced Readabilities menu
      ],
      // A enhanced readabilities menu for narrower screens (usually smaller than iPad Mini)
      'nav-screen-content-after': () => h(NolebaseEnhancedReadabilitiesScreenMenu),
    })
  },
  enhanceApp({ app, router, siteData }) {
    enhanceAppWithTabs(app);
    app.component('VersionPicker', VersionPicker);
    app.component('AuthorBadge', AuthorBadge)
    app.component('Authors', Authors)

    // gm-tabs accordion behavior (owner 2026-08-25). Radios alone cannot
    // self-uncheck, hence this small enhancement:
    // - PHONES: section starts ALL-CLOSED (every clickable box visible at once)
    //   and tapping an OPEN label closes it again (toggle)
    // - DESKTOP: master-detail always shows one panel — Core Concept opens by
    //   default and clicking the open label keeps it open (no empty column;
    //   owner follow-up 2026-08-25)
    // Bound once via delegation so SPA re-renders cannot orphan it.
    if (!import.meta.env.SSR) {
      const mobileMq = window.matchMedia('(max-width: 860px)')
      document.addEventListener('click', (e) => {
        if (!mobileMq.matches) return // toggle-close is a mobile-only affordance
        const label = (e.target as Element | null)?.closest?.('label.gm-tabbox') as HTMLLabelElement | null
        if (!label) return
        const radio = document.getElementById(label.htmlFor) as HTMLInputElement | null
        if (radio && radio.checked) { e.preventDefault(); radio.checked = false }
      })
      // The markup ships with NO radio pre-checked (a hydration race once
      // re-asserted an SSR `checked` after we uncleared it — mixed state).
      // Instead the initial state is applied here, post-hydration, per viewport:
      // desktop opens Core Concept; phones start all-closed.
      const applyInitialState = () => {
        const radios = Array.from(
          document.querySelectorAll<HTMLInputElement>('.gm-tabs > input[type="radio"]'))
        if (!radios.length) return
        const wide = !window.matchMedia('(max-width: 860px)').matches
        if (wide && !radios.some(r => r.checked)) {
          const core = radios.find(r => r.id === 'gmt-core')
          if (core) core.checked = true
        }
      }
      // VitePress chrome — sidebar, prev/next, nav menu, outline — renders its labels
      // from PLAIN STRINGS in the config, so neither the markdown text rule nor a
      // literal span can reach them ("What is GoMeta?" is the only such label today).
      // Wrap them after hydration instead, and again on every route change, because
      // Vue re-renders those lists and would drop the spans. Idempotent by design: a
      // word already wrapped has a .gm-name ancestor and is skipped.
      // NOT covered: the search modal, which mounts its results on demand.
      const CHROME = '.VPSidebarItem .text, .VPDocFooter .title, .VPNavBarMenuLink,'
        + ' .VPNavScreenMenuLink, .VPDocAsideOutline .outline-link'
      const nameChrome = () => {
        for (const root of document.querySelectorAll<HTMLElement>(CHROME)) {
          if (!root.textContent || !root.textContent.includes('GoMeta')) continue
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
          const targets: Text[] = []
          let node: Node | null
          while ((node = walker.nextNode())) {
            const t = node as Text
            if (!t.data.includes('GoMeta')) continue
            if (t.parentElement && t.parentElement.closest('.gm-name')) continue
            targets.push(t)
          }
          for (const t of targets) {
            const frag = document.createDocumentFragment()
            const re = /\bGoMeta(?:\.jl)?\b/g   // package name takes it whole
            let last = 0, m: RegExpExecArray | null
            while ((m = re.exec(t.data)) !== null) {
              frag.append(t.data.slice(last, m.index))
              const span = document.createElement('span')
              span.className = 'gm-name'
              span.textContent = m[0]
              frag.append(span)
              last = m.index + m[0].length
            }
            frag.append(t.data.slice(last))
            t.replaceWith(frag)
          }
        }
      }
      const applyPasses = () => { applyInitialState(); nameChrome() }

      const prev = router.onAfterRouteChanged
      router.onAfterRouteChanged = (to: string) => {
        if (prev) prev(to)
        requestAnimationFrame(applyPasses)
      }
      requestAnimationFrame(applyPasses)
      setTimeout(applyPasses, 150)
      // widening past the breakpoint with everything closed would leave the
      // desktop column empty — re-apply the desktop default on that crossing
      mobileMq.addEventListener('change', (e) => { if (!e.matches) applyInitialState() })

      // draft-banner sizing (owner 2026-08-25): the fixed strip's height used
      // to be hardcoded and the grown text overflowed it (clipped on mobile).
      // Measure the pill instead, and COLLAPSE the banner once the reader
      // scrolls (frees the small screens; the info returns at scroll-top).
      const bannerSync = () => {
        const pill = document.querySelector<HTMLElement>('.gm-draft-banner .gm-draft-pill')
        if (!pill) return
        const collapsed = window.scrollY > 60
        const h = collapsed ? 0 : pill.offsetHeight + 16
        document.documentElement.style.setProperty('--vp-layout-top-height', h + 'px')
      }
      window.addEventListener('scroll', bannerSync, { passive: true })
      window.addEventListener('resize', bannerSync)
      requestAnimationFrame(bannerSync)
      setTimeout(bannerSync, 150)
    }
  }
}
export default Theme