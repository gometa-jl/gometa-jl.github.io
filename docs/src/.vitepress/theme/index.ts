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
          '🚧 First, ',
          h('strong', 'heavily Claude assisted'),
          ' draft — brand-new for JuliaCon 2026.',
          h('br'),
          'Will be updated gradually. For now, check out the ',
          h('strong', [
            'JuliaCon slides ',
            // target=_self is LOAD-BEARING: /talk/ is a public/ asset, not a
            // VitePress page; without it the SPA router eats the click (404).
            h('a', { href: '/talk/', target: '_self' }, 'here'),
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
      const prev = router.onAfterRouteChanged
      router.onAfterRouteChanged = (to: string) => {
        if (prev) prev(to)
        requestAnimationFrame(applyInitialState)
      }
      requestAnimationFrame(applyInitialState)
      setTimeout(applyInitialState, 150)
      // widening past the breakpoint with everything closed would leave the
      // desktop column empty — re-apply the desktop default on that crossing
      mobileMq.addEventListener('change', (e) => { if (!e.matches) applyInitialState() })
    }
  }
}
export default Theme