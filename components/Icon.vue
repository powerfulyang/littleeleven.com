<script setup lang="ts">
import { isRemoteImage } from '~/utils/isRemoteImage'

const props = defineProps(['name', 'class', 'previewDisabled'])

const isImg = computed(() => {
  return isRemoteImage(props.name)
})
</script>

<template>
  <n-image
    v-if="isImg"
    object-fit="contain"
    :img-props="{
      class: 'w-full h-full',
    }"
    :preview-disabled="previewDisabled"
    class="icon"
    :class="[props.class]"
    :alt="name"
    :src="name"
  />
  <svg v-else class="icon" :class="[props.class]" aria-hidden="true" preserveAspectRatio="none">
    <use :href="`#${name}`" />
  </svg>
</template>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
