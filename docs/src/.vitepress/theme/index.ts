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
  }
}
export default Theme