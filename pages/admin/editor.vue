<script setup>
import Editor from '@tinymce/tinymce-vue'

definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <main class="h-full w-full">
    <Editor
      api-key="no-api-key"
      :init="{
        plugins: 'lists link image table code help wordcount',
      }"
    />
  </main>
</template>

<style scoped>
</style>
