<script setup lang="ts">
import {
  GithubOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  UserOutlined,
} from '@vicons/antd'
import { useLayoutStore } from '~/composables/layout'

const store = useLayoutStore()
// 图标列表
const iconList = [
  {
    icon: SearchOutlined,
    tips: '搜索',
  },
  {
    icon: GithubOutlined,
    tips: 'github',
    eventObject: {
      click: () => window.open('https://github.com/powerfulyang/littleeleven.com'),
    },
  },
]
const breadcrumbList = [
  { name: 'event', meta: { title: '事件管理' } },
  { name: 'event-setting', meta: { title: '事件属性配置' } },
]
const avatarOptions = [
  {
    label: '个人设置',
    key: 1,
  },
  {
    label: '退出登录',
    key: 2,
  },
]
const router = useRouter()
// 头像下拉菜单
function avatarSelect(key) {
  switch (key) {
    case 1:
      router.push({ path: 'Setting' })
      break
    case 2:
      break
  }
}
</script>

<template>
  <div class="layout-header">
    <!-- 左侧菜单 -->
    <div class="layout-header-left">
      <!-- 菜单收起 -->
      <div
        class="layout-header-trigger layout-header-trigger-min ml-1"
        @click="store.collapsed = !store.collapsed"
      >
        <n-icon v-if="store.collapsed" size="18">
          <MenuUnfoldOutlined />
        </n-icon>
        <n-icon v-else size="18">
          <MenuFoldOutlined />
        </n-icon>
      </div>
      <!-- 面包屑 -->
      <n-breadcrumb>
        <template
          v-for="routeItem in breadcrumbList"
          :key="routeItem.name"
        >
          <n-breadcrumb-item v-if="routeItem.meta.title">
            <span class="link-text">
              {{ routeItem.meta.title }}
            </span>
          </n-breadcrumb-item>
        </template>
      </n-breadcrumb>
    </div>
    <div class="layout-header-right">
      <div
        v-for="item in iconList"
        :key="item.tips"
        class="layout-header-trigger layout-header-trigger-min"
      >
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="18">
              <component :is="item.icon" v-on="item.eventObject || {}" />
            </n-icon>
          </template>
          <span>{{ item.tips }}</span>
        </n-tooltip>
      </div>
      <!-- 个人中心 -->
      <div class="layout-header-trigger layout-header-trigger-min">
        <n-dropdown trigger="hover" :options="avatarOptions" @select="avatarSelect">
          <div class="avatar">
            <n-avatar round>
              eleven
              <template #icon>
                <UserOutlined />
              </template>
            </n-avatar>
          </div>
        </n-dropdown>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  height: 64px;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  transition: all 0.2s ease-in-out;
  width: 100%;
  z-index: 11;

  &-left {
    display: flex;
    align-items: center;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 64px;
      line-height: 64px;
      overflow: hidden;
      white-space: nowrap;
      padding-left: 10px;

      img {
        width: auto;
        height: 32px;
        margin-right: 10px;
      }

      .title {
        margin-bottom: 0;
      }
    }

    ::v-deep(.ant-breadcrumb span:last-child .link-text) {
      color: #515a6e;
    }

    .n-breadcrumb {
      display: inline-block;
    }

    &-menu {
      color: var(--text-color);
    }
  }

  &-right {
    display: flex;
    align-items: center;
    margin-right: 20px;

    .avatar {
      display: flex;
      align-items: center;
      height: 64px;
    }

    > * {
      cursor: pointer;
    }
  }

  &-trigger {
    display: inline-block;
    width: 64px;
    height: 64px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    .n-icon {
      display: flex;
      align-items: center;
      height: 64px;
      line-height: 64px;
    }

    &:hover {
      background: hsla(0, 0%, 100%, 0.08);
    }

    .anticon {
      font-size: 16px;
      color: #515a6e;
    }
  }

  &-trigger-min {
    width: auto;
    padding: 0 12px;
  }
}

.layout-header-light {
  background: #fff;
  color: #515a6e;

  .n-icon {
    color: #515a6e;
  }

  .layout-header-left {
    ::v-deep(.n-breadcrumb .n-breadcrumb-item:last-child .n-breadcrumb-item__link) {
      color: #515a6e;
    }
  }

  .layout-header-trigger {
    &:hover {
      background: #f8f8f9;
    }
  }
}

.layout-header-fix {
  position: fixed;
  top: 0;
  right: 0;
  left: 200px;
  z-index: 11;
}
</style>
