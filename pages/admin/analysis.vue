<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <client-only>
    <div class="grid grid-cols-3 h-300px gap-2 p-4">
      <NCard title="体重曲线">
        <growth-weight />
      </NCard>
      <NCard title="尿不湿用量">
        <growth-diaper />
      </NCard>
      <NCard title="喂养次数">
        <growth-feed />
      </NCard>
    </div>
  </client-only>
</template>

<style scoped>

</style>
