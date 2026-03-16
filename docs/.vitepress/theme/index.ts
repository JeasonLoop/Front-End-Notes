// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import './custom.css'
import HomeLayout from './components/HomeLayout.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 可插入自定义插槽
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件等
  }
}
