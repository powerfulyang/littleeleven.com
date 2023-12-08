<script setup lang="ts">
import { Chart } from '@antv/g2'
import dayjs from 'dayjs'
import { groupBy } from 'lodash-es'
import { useGetApiEventLog } from '~/schemas/services/myAPI'

const router = useRouter()

const { data, suspense } = useGetApiEventLog()

onServerPrefetch(suspense)

const active = ref(0)

const chart_data = computed(() => {
  if (!data.value)
    return []

  const diaper = data.value?.filter(item => item.eventName === 'Diaper')
  const grouped = groupBy(diaper, (item) => {
    // day
    if (active.value === 0)
      return dayjs(item.eventTime).diff('2023-10-05', 'day')
    // week
    if (active.value === 1)
      return dayjs(item.eventTime).diff('2023-10-05', 'week')
    // month
    if (active.value === 2)
      return dayjs(item.eventTime).format('YYYY-MM')
    // year
    if (active.value === 3)
      return dayjs(item.eventTime).format('YYYY')
  })
  return Object.entries(grouped).map(([key, value]) => {
    return {
      label: key,
      count: value.length,
    }
  }).sort((a, b) => {
    if (active.value === 1 || active.value === 0)
      return Number(a.label) - Number(b.label)

    return a.label.localeCompare(b.label)
  })
})
const container = ref<HTMLElement>(null!)
onMounted(async () => {
  watchEffect((onCleanup) => {
    const chart = new Chart({
      container: container.value,
      autoFit: true,
    })
    // 直方图
    chart
      .interval()
      .data(chart_data.value)
      .encode('x', 'label')
      .encode('y', 'count')
      .axis('x', {
        title: false,
        label: false,
      })
      .axis('y', {
        title: false,
      })
      .style({
        radiusTopLeft: 4,
        radiusTopRight: 4,
      })
    chart.render()
    onCleanup(() => {
      chart.destroy()
    })
  })
})
</script>

<template>
  <div class="h-full overflow-auto bg-#f5f5f5 pb-16">
    <van-nav-bar
      title="统计"
      left-arrow
      @click-left="router.back"
    />
    <van-tabs v-model:active="active" class="pt-4" shrink type="card">
      <van-tab title="Day" />
      <van-tab title="Week" />
      <van-tab title="Month" />
      <van-tab title="Year" />
    </van-tabs>
    <div ref="container" />
  </div>
</template>

<style scoped lang="scss">

</style>
