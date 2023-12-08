import { setup } from '@css-render/vue3-ssr'
import { defineNuxtPlugin } from '#app'

// refer to https://github.com/tusen-ai/naive-ui/issues/5220#issuecomment-1719222848

export default defineNuxtPlugin({
  name: 'naive-ui',
  enforce: 'pre',
  setup(nuxtApp) {
    // eslint-disable-next-line node/prefer-global/process
    if (process.server) {
      const { collect } = setup(nuxtApp.vueApp)
      nuxtApp.ssrContext?.head.hooks.hook('tags:resolve', (ctx) => {
        //  insert Style after meta
        const lastMetaIndex = ctx.tags.map(x => x.tag).lastIndexOf('meta')
        const styleTags = collect().split('</style>').filter(Boolean).map((x) => {
          const id = x.match(/cssr-id="(.+?)"/)?.[1]
          const style = (x.match(/>(.*)/s)?.[1] || '').trim()
          return {
            tag: 'style',
            props: { 'cssr-id': id },
            innerHTML: style,
          }
        })
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        ctx.tags.splice(lastMetaIndex + 1, 0, ...styleTags)
      })
    }
  },
})
