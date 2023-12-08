<script setup lang="ts">
import { appName, iconfontUrl } from '~/constants'

useHead({
  title: appName,
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <Script type="application/javascript" :src="iconfontUrl" :async="true" />
  </ClientOnly>
</template>

<style>
html, body , #__nuxt {
  height: 100%;
  margin: 0;
}

body {
  padding: env(safe-area-inset-top) 0 0;
}

html.dark {
  background: #222;
  color: white;
}
</style>
