<script setup lang="ts">
import { Chart } from '@antv/g2'
import dayjs from 'dayjs'
import girlWeight from '@/common/data/girl.weight.csv'
import girlHeight from '@/common/data/girl.height.csv'
import { useGetApiBabyId, useGetApiEventLog } from '~/schemas/services/myAPI'

const { data, suspense } = useGetApiEventLog()
const { data: baby, suspense: suspenseBaby } = useGetApiBabyId('1')

onServerPrefetch(async () => {
  return Promise.all([suspense(), suspenseBaby()])
})

const w_data = girlWeight.slice(0, 6).reduce((acc, cur) => {
  acc.push({
    month: Number(cur.month),
    type: 'p3',
    weight: Number(cur.p3),
  })
  acc.push({
    month: Number(cur.month),
    type: 'p50',
    weight: Number(cur.p50),
  })
  acc.push({
    month: Number(cur.month),
    type: 'p97',
    weight: Number(cur.p97),
  })
  return acc
}, [] as unknown[])

const h_data = girlHeight.slice(0, 6).reduce((acc, cur) => {
  acc.push({
    month: Number(cur.month),
    type: 'p3',
    height: Number(cur.p3),
  })
  acc.push({
    month: Number(cur.month),
    type: 'p50',
    height: Number(cur.p50),
  })
  acc.push({
    month: Number(cur.month),
    type: 'p97',
    height: Number(cur.p97),
  })
  return acc
}, [] as unknown[])

const w_container = ref<HTMLElement>(null!)
const h_container = ref<HTMLElement>(null!)

onMounted(() => {
  const w_chart = new Chart({
    container: w_container.value,
    autoFit: true,
  })
  w_chart
    .line()
    .encode('shape', 'smooth')
    .data(w_data)
    .encode('x', 'month')
    .encode('y', 'weight')
    .encode('color', 'type')
    .axis('x', {
      labelFormatter: (val) => {
        return `${val}月`
      },
      titleFontFamily: 'Gaegu',
      labelFontFamily: 'Gaegu',
    })
    .axis('y', {
      labelFormatter: (val) => {
        return `${val}kg`
      },
      titleFontFamily: 'Gaegu',
      labelFontFamily: 'Gaegu',
      title: 'Weight (kg)',
    })
  w_chart.render()

  const h_chart = new Chart({
    container: h_container.value,
    autoFit: true,
  })
  h_chart
    .line()
    .encode('shape', 'smooth')
    .data(h_data)
    .encode('x', 'month')
    .encode('y', 'height')
    .encode('color', 'type')
    .axis('x', {
      labelFormatter: (val) => {
        return `${val}月`
      },
      titleFontFamily: 'Gaegu',
      labelFontFamily: 'Gaegu',
    })
    .axis('y', {
      labelFormatter: (val) => {
        return `${val}cm`
      },
      titleFontFamily: 'Gaegu',
      labelFontFamily: 'Gaegu',
      title: 'Height (cm)',
    })
  h_chart.render()

  watchEffect(() => {
    if (!data.value || !baby.value)
      return

    const weight_data = data.value.filter(item => item.eventName === 'Weigh').map((item) => {
      return {
        month: dayjs(item.eventTime).diff(baby.value.bornAt, 'month', true),
        weight: Number(item.extra?.weight),
        type: 'self',
      }
    })

    w_chart.changeData([...weight_data, ...w_data])
  })

  return () => {
    h_chart.destroy()
    w_chart.destroy()
  }
})
</script>

<template>
  <div class="h-full overflow-auto bg-#f5f5f5 pb-12">
    <van-nav-bar
      title="健康曲线"
    />
    <div ref="w_container" class="my-4 h-40% bg-white" />
    <div ref="h_container" class="h-40% bg-white" />
  </div>
</template>

<style scoped lang="scss">

</style>
