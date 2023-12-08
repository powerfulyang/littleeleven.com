export const useFontLoad = defineStore('font', () => {
  const loaded = ref(false)

  // eslint-disable-next-line node/prefer-global/process
  if (process.client) {
    import('webfontloader').then(({ load }) => {
      load({
        google: {
          families: ['Gaegu'],
        },
        active: () => {
          loaded.value = true
        },
      })
    })
  }

  return {
    loaded,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useFontLoad, import.meta.hot))
