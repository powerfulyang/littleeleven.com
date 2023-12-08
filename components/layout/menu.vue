<script setup lang="ts">
import { HomeOutlined, SettingOutlined } from '@vicons/antd'
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'

function renderMenuLabel(option: MenuOption) {
  if ('href' in option) {
    return h(RouterLink, {
      to: {
        path: option.href as string,
      },
    }, {
      default: () => option.label,
    })
  }
  return option.label as string
}

const route = useRoute()

const menuOptions = [
  {
    key: 'home',
    label: '首页',
    icon: renderIcon(HomeOutlined),
    children: [
      {
        key: '/admin/analysis',
        label: '分析页',
        href: '/admin/analysis',
      },
    ],
  },
  {
    key: 'event',
    label: '事件管理',
    icon: renderIcon(SettingOutlined),
    children: [
      {
        key: '/admin/event',
        label: '事件属性配置',
        href: '/admin/event',
      },
    ],
  },
]
</script>

<template>
  <NMenu
    :options="menuOptions"
    :inverted="true"
    :collapsed-width="64"
    :collapsed-icon-size="20"
    :indent="24"
    :value="route.path"
    :render-label="renderMenuLabel"
  />
</template>

<style scoped>

</style>
