import { acceptHMRUpdate, defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
  const collapsed = ref(false)

  return {
    collapsed,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLayoutStore, import.meta.hot))
