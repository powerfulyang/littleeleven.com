<script lang="ts" setup>
import { useLayoutStore } from '~/composables/layout'

const store = useLayoutStore()
</script>

<template>
  <ClientOnly>
    <NConfigProvider>
      <NMessageProvider>
        <NNotificationProvider>
          <NLoadingBarProvider>
            <NDialogProvider>
              <n-layout class="layout" has-sider>
                <n-layout-sider
                  show-trigger="bar"
                  collapse-mode="width"
                  :collapsed-width="64"
                  :width="250"
                  :native-scrollbar="false"
                  inverted
                  class="layout-sider"
                  :collapsed="store.collapsed"
                  @collapse="store.collapsed = true"
                  @expand="store.collapsed = false"
                >
                  <LayoutLogo />
                  <LayoutMenu />
                </n-layout-sider>

                <n-layout>
                  <n-layout-header>
                    <div class="layout-header">
                      <LayoutHeader />
                    </div>
                  </n-layout-header>

                  <n-layout-content
                    class="layout-content layout-default-background"
                  >
                    <div
                      class="layout-content-main fluid-header"
                    >
                      <div
                        class="noMultiTabs main-view"
                      >
                        <slot />
                      </div>
                    </div>
                  </n-layout-content>
                  <n-back-top :right="100" />
                </n-layout>
              </n-layout>
            </NDialogProvider>
          </NLoadingBarProvider>
        </NNotificationProvider>
      </NMessageProvider>
    </NConfigProvider>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: row;
  flex: auto;

  &-default-background {
    background: #f5f7f9;
  }

  .layout-sider {
    height: 100vh;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
    position: relative;
    z-index: 13;
    transition: all 0.2s ease-in-out;
  }

  .layout-content {
    overflow: auto;
    height: calc(100vh - 64px);
  }
}

.layout-content-main {
  margin: 0 10px 10px;
  position: relative;
  padding-top: 64px;
}

.fluid-header {
  padding-top: 0;
}

.noMultiTabs {
  padding-top: 0;
}
</style>
