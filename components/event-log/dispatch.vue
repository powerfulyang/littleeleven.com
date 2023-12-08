<script setup lang="ts">
import { ref } from 'vue'
import type { Event } from '~/schemas/model'
import { useGetApiEvent } from '~/schemas/services/myAPI'

const emit = defineEmits<{
  (event: 'success', time: string): void
}>()

const showPopover = ref(false)
const showFormPopup = ref(false)

const { data: events, suspense } = useGetApiEvent()

const selectedEvent = ref<Event>()

async function showEventLogCreateForm(event: Event) {
  showPopover.value = false
  selectedEvent.value = event
  showFormPopup.value = true
}

onServerPrefetch(suspense)
</script>

<template>
  <div absolute bottom-14 right-4>
    <van-popover v-model:show="showPopover" class="!overflow-visible" placement="top-end">
      <van-grid
        clickable
        square
        :border="false"
        column-num="3"
        class="w-330px"
      >
        <van-grid-item
          v-for="event in events"
          :key="event.displayName"
          @click="showEventLogCreateForm(event)"
        >
          <Icon :preview-disabled="true" class="m-auto !h-unset !w-full" :name="event.icon" />
          <span class="whitespace-nowrap pt-1 text-xs text-gray-4">
            {{ event.displayName }}
          </span>
        </van-grid-item>
      </van-grid>
      <template #reference>
        <div h-14 w-14 flex items-center justify-center rounded-full bg-pink-5>
          <van-icon name="plus" :size="30" color="#fff" />
        </div>
      </template>
    </van-popover>
    <event-log-form
      v-model:show="showFormPopup"
      :event="selectedEvent"
      @success="(time) => {
        emit('success', time)
      }"
    />
  </div>
</template>

<style scoped></style>
