<script lang="ts" setup>
import { ref } from 'vue'

const activeTab = ref('/')

const route = useRoute()

activeTab.value = route.path
</script>

<template>
  <div id="root-container" class="container">
    <slot />
    <van-tabbar v-model="activeTab" class="!absolute">
      <van-tabbar-item name="/" replace icon="home-o" to="/">
        Home
      </van-tabbar-item>
      <van-tabbar-item name="/growth" replace icon="contact-o" to="/growth">
        Growth
      </van-tabbar-item>
      <van-tabbar-item name="/friends" replace icon="friends-o" to="/friends">
        Friends
      </van-tabbar-item>
      <van-tabbar-item name="/setting" replace icon="setting-o" to="/setting">
        Setting
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  height: 100%;
  max-width: 500px;
  margin: auto;
}
</style>
