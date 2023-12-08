<script lang="ts" setup>
import { ref } from 'vue'

const activeTab = ref('/')

const router = useRouter()
const route = useRoute()

if (route.path.length > 1) {
  const path = route.path.split('/')[1]
  activeTab.value = `/${path}`
}

router.beforeEach((to, from, next) => {
  const toPath = to.path
  if (toPath.length > 1) {
    const path = toPath.split('/')[1]
    activeTab.value = `/${path}`
  }
  next()
})
</script>

<template>
  <div id="root-container" class="container">
    <slot />
    <van-tabbar
      v-model="activeTab" class="!absolute" :safe-area-inset-bottom="false"
    >
      <van-tabbar-item name="/" icon="home-o" @click="router.push('/')">
        Home
      </van-tabbar-item>
      <van-tabbar-item name="/growth" icon="contact-o" @click="router.push('/growth')">
        Growth
      </van-tabbar-item>
      <van-tabbar-item name="/moments" icon="apps-o" @click="router.push('/moments')">
        Moments
      </van-tabbar-item>
      <van-tabbar-item name="/setting" icon="setting-o" @click="router.push('/setting')">
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
