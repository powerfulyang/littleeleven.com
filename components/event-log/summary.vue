<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'
import { useGetApiEventLog, useGetApiEventLogDistinct } from '~/schemas/services/myAPI'

function initDates() {
  return Array.from({ length: 14 }, (_, i) => {
    return {
      date: dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
      day: dayjs().subtract(i, 'day').format('ddd'),
      dateStr: dayjs().subtract(i, 'day').format('MM-DD'),
    }
  })
}

const dates = ref<ReturnType<typeof initDates>>()
const activeDate = ref<string>()
const activeEvent = ref<string>()

function mount(date?: string) {
  dates.value = initDates()
  if (date)
    activeDate.value = date
}

mount(formatDatetime(new Date(), 'YYYY-MM-DD'))

// name list
const { data: tags, isPending: isFetchingTags, refetch: refetchTags, suspense: suspenseTags } = useGetApiEventLogDistinct(
  computed(() => {
    return {
      date: activeDate.value,
    }
  }),
)

const { data: logs, isPending: isFetchingLogs, refetch: refetchLogs, suspense: suspenseLogs } = useGetApiEventLog(
  computed(() => {
    return {
      eventName: activeEvent.value,
      date: activeDate.value,
    }
  }),
)

const isRefreshing = ref(false)

function onRefresh(date: string) {
  if (date)
    mount(date)

  Promise.all(
    [
      refetchTags(),
      refetchLogs(),
    ],
  ).then(() => {
    isRefreshing.value = false
    showToast('刷新成功')
  })
}

defineExpose({
  refresh: onRefresh,
})

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

const isFetching = computed(() => {
  return isFetchingTags.value || isFetchingLogs.value
})

onServerPrefetch(async () => {
  await Promise.all(
    [
      suspenseTags(),
      suspenseLogs(),
    ],
  )
})

const currentTime = ref()
const nearLastFeed = computed(() => {
  const lastFeed = logs.value?.find(e => e.eventName === 'Feed')
  if (!lastFeed)
    return '未知'
  else
    return getDuration(lastFeed.eventTime!, currentTime.value)
})

const nearLastDiaper = computed(() => {
  const lastDiaper = logs.value?.find(e => e.eventName === 'Diaper')
  if (!lastDiaper)
    return '未知'
  else
    return getDuration(lastDiaper.eventTime!, currentTime.value)
})

const nearLastSleep = computed(() => {
  const lastSleep = logs.value?.find(e => e.eventName === 'Sleep')
  if (!lastSleep)
    return '未知'
  else
    return getDuration(lastSleep.eventTime!, currentTime.value)
})

onMounted(() => {
  const interval = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})

const hasFeedAD = computed(() => {
  return !!logs.value?.find(e => e.eventName === 'Supplement' && JSON.stringify(e.extra)?.includes('AD'))
})

const sleepTime = computed(() => {
  const sleepLogs = logs.value?.filter(e => e.eventName === 'Sleep')
  if (!sleepLogs?.length)
    return '0 小时 0 分钟'

  const minutes = sleepLogs.reduce((acc, cur) => {
    acc = acc + dayjs(cur.extra?.endTime as any).diff(dayjs(cur.eventTime), 'minute')
    return acc
  }, 0)

  return `${Math.floor(minutes / 60)} 小时 ${minutes % 60} 分钟`
})
</script>

<template>
  <div bg="#f5f5f5" h-full w-full overflow-auto pb-13>
    <van-nav-bar
      title="事件记录"
      class="mb-4"
    />
    <van-pull-refresh v-model="isRefreshing" class="overflow-visible" @refresh="onRefresh">
      <div class="px-4">
        <div overflow-hidden rounded-xl bg-white>
          <van-grid
            :border="false"
            column-num="7"
            clickable
          >
            <van-grid-item
              v-for="item in dates"
              :key="item.date"
              :class="{
                'active-item': activeDate === item.date,
              }"
              @click="activeDate = item.date"
            >
              <div class="text-xs text-gray-4">
                {{ item.day }}
              </div>
              <div class="text-xs text-gray-6">
                {{ item.dateStr }}
              </div>
            </van-grid-item>
          </van-grid>
        </div>
        <div v-if="!isFetching && !activeEvent" class="mt-3 px-2 text-xs">
          <div v-if="activeDate === dayjs().format('YYYY-MM-DD')">
            距离上次喂养: <span class="text-pink">{{ nearLastFeed }}</span> <br>
            距离上次换尿不湿: <span class="text-pink">{{ nearLastDiaper }}</span> <br>
            距离上次睡觉: <span class="text-pink">{{ nearLastSleep }}</span>
          </div>
          <div>
            AD 吃了没: <span class="text-pink">{{ hasFeedAD ? '吃了' : '没吃' }}</span>
          </div>
          <div>
            今日总计睡眠时长: <span class="text-pink">{{ sleepTime }}</span>
          </div>
        </div>
        <div v-if="!!tags?.length" mt-2 flex flex-wrap>
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
        <div v-if="!isFetching" grid grid-cols-2 mb-2 gap-2>
          <template v-for="log in logs" :key="log.id">
            <event-log-detail :event-log="log" />
          </template>
        </div>
        <van-loading v-if="isFetching" color="#ec489a" vertical mt-4>
          加载中...
        </van-loading>
        <van-empty v-else-if="!logs?.length" description="当天没有记录哦～" />
      </div>
    </van-pull-refresh>
  </div>
</template>

<style lang="scss">
.my-swipe .van-swipe-item {
  background-color: #fff;
  height: 200px;
}

.active-item {
  .van-grid-item__content {
    background-color: #ec489a;

    div {
      color: white;
    }
  }
}
</style>
