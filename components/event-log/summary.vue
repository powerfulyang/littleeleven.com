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
const { data: _tags, isFetching: isFetchingTags, refetch: refetchTags, suspense: suspenseTags } = useGetApiEventLogDistinct(
  computed(() => {
    return {
      date: activeDate.value,
    }
  }),
)

const { data: logs, isFetching: isFetchingLogs, isPending, refetch: refetchLogs, suspense: suspenseLogs } = useGetApiEventLog(
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

watch(_tags, () => {
  if (_tags.value && !_tags.value.find(e => e.eventName === activeEvent.value))
    activeEvent.value = undefined
})

const tags = computed(() => {
  const totalCnt = _tags.value?.reduce((acc, cur) => acc + cur.count, 0) || 0
  return [
    {
      displayName: '全部',
      eventName: undefined,
      count: totalCnt,
    },
    ...(_tags.value || []),
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
</script>

<template>
  <div bg="#f5f5f5" h-full w-full overflow-auto pb-14>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="pink">
      <van-swipe-item>
        <growth-weight />
      </van-swipe-item>
      <van-swipe-item>
        <growth-diaper />
      </van-swipe-item>
      <van-swipe-item>
        <growth-feed />
      </van-swipe-item>
      <van-swipe-item>周总结</van-swipe-item>
    </van-swipe>
    <van-pull-refresh v-model="isRefreshing" style="min-height: calc(100% - 200px)" @refresh="onRefresh">
      <div px-4>
        <div my-3 text-lg>
          日常记录
        </div>
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
        <div v-if="!!_tags?.length" mt-4 flex flex-wrap>
          <van-tag
            v-for="event in tags" :key="event.eventName"
            :text-color="event.eventName === activeEvent ? '#fff' : '#373737'"
            round mb-2 mr-2
            class="!p-1 !px-2.5"
            :color="event.eventName === activeEvent ? '#ec489a' : '#eeeeee'"
            @click="activeEvent = event.eventName"
          >
            {{ event.displayName }} ({{ event.count }})
          </van-tag>
        </div>
        <div v-if="!isFetching || isRefreshing" grid grid-cols-2 mt-2 gap-2>
          <template v-for="log in logs" :key="log.id">
            <event-log-detail :event-log="log" />
          </template>
        </div>
        <van-loading v-if="(isPending || isFetching) && !isRefreshing" color="#ec489a" vertical mt-4>
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
