<script lang="ts" setup>
import { useLayoutStore } from '~/composables/layout'
import { appName } from '~/constants'

const store = useLayoutStore()
const collapsed = computed(() => store.collapsed)

const websiteConfig = {
  title: appName,
  logo: '/apple-touch-icon.png',
}
</script>

<template>
  <div class="logo">
    <img :src="websiteConfig.logo" alt="" :class="{ 'mr-2': !collapsed }">
    <h2 v-show="!collapsed" class="title">
      {{ websiteConfig.title }}
    </h2>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  line-height: 64px;
  overflow: hidden;
  white-space: nowrap;

  img {
    width: auto;
    height: 32px;
  }

  .title {
    margin: 0;
  }
}
</style>
