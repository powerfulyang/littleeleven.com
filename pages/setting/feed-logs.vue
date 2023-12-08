<script setup lang="ts">
import { ref } from 'vue'
import { useGetApiEventLog, useGetApiEventLogDistinct } from '~/schemas/services/myAPI'

const { data: tags, suspense: suspenseTags } = useGetApiEventLogDistinct(
)
const { data: logs, suspense: suspenseLogs } = useGetApiEventLog()

onServerPrefetch(async () => {
  return Promise.all([suspenseTags(), suspenseLogs()])
})

const activeEvent = ref<string>()
watch(tags, () => {
  if (tags.value && !tags.value.find(e => e.eventName === activeEvent.value))
    activeEvent.value = undefined
})

const tagsWithAll = computed(() => {
  const totalCnt = tags.value?.reduce((acc, cur) => acc + cur.count, 0) || 0
  return [
    {
      displayName: '全部',
      eventName: undefined,
      count: totalCnt,
    },
    ...(tags.value || []),
  ]
})
const router = useRouter()
</script>

<template>
  <div class="h-full overflow-auto bg-#f5f5f5">
    <van-nav-bar
      title="喂养记录"
      left-arrow
      @click-left="router.back"
    />
    <div v-if="!!tags?.length" class="ml-2 mt-4 flex flex-wrap">
      <van-tag
        v-for="event in tagsWithAll" :key="event.eventName"
        :text-color="event.eventName === activeEvent ? '#fff' : '#373737'"
        round
        class="mb-2 mr-2 !p-1 !px-2.5"
        :color="event.eventName === activeEvent ? '#ec489a' : '#eeeeee'"
        @click="activeEvent = event.eventName"
      >
        {{ event.displayName }} ({{ event.count }})
      </van-tag>
    </div>
    <div v-for="log in logs" :key="log.id" class="m-2">
      <event-log-detail :event-log="log" />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
