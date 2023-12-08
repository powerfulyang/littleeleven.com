import { Lazyload } from 'vant'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.use(Lazyload)
})
