<script setup lang="ts">
import { Chart } from '@antv/g2'
import girlWeight from '@/common/data/girl.weight.csv'
import girlHeight from '@/common/data/girl.height.csv'

const w_data = girlWeight.slice(0, 12).reduce((acc, cur) => {
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

const h_data = girlHeight.slice(0, 12).reduce((acc, cur) => {
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
    height: 400,
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
    height: 400,
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

  return () => {
    h_chart.destroy()
    w_chart.destroy()
  }
})
</script>

<template>
  <div class="h-full overflow-auto pb-12">
    <div ref="w_container" />
    <div ref="h_container" />
  </div>
</template>

<style scoped lang="scss">

</style>
