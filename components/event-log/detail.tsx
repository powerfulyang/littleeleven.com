import { useQueryClient } from '@tanstack/vue-query'
import type { MaybeElement, MaybeElementRef } from '@vueuse/core'
import type { PropType } from 'vue'
import 'vant/es/action-sheet/style/index.mjs'
import { defineComponent } from 'vue'
import { ClientOnly, EventLogForm, Icon, VanActionSheet } from '#components'
import type { EventLogResult } from '~/schemas/model'
import { getGetApiEventLogQueryKey, useDeleteApiEventLogId, usePatchApiEventLog } from '~/schemas/services/myAPI'
import { getDuration } from '~/utils/getDuration'

export default defineComponent({
  props: {
    eventLog: {
      type: Object as PropType<EventLogResult>,
      required: true,
    },
  },
  setup(props) {
    const { eventLog } = toRefs(props)
    const hasEndTimeField = computed(() => {
      return !!eventLog.value.event.extraFields?.filter(field => field.name === 'endTime')?.length
    })
    const eventLogEndTime = computed(() => {
      return eventLog.value.extra?.endTime as string
    })
    const endTime = ref<string>(eventLogEndTime.value)
    const startTime = computed(() => {
      return eventLog.value.extra?.startTime as string
    })

    if (!eventLogEndTime.value) {
      onMounted(() => {
        // 刷新持续时间，每秒刷新一次
        const interval = setInterval(() => {
          endTime.value = new Date().toString()
        }, 1000)

        onUnmounted(() => {
          clearInterval(interval)
        })
      })
    }

    const queryClient = useQueryClient()

    const refetchEventLogs = () => {
      return queryClient.invalidateQueries({
        queryKey: getGetApiEventLogQueryKey(),
      })
    }

    const { mutateAsync } = usePatchApiEventLog({
      mutation: {
        onSuccess() {
          return refetchEventLogs()
        },
      },
    })

    const showPopup = ref(false)
    const showActionSheet = ref(false)

    const stop = async (e: MouseEvent) => {
      if (eventLogEndTime.value) {
        showPopup.value = true
      }
      else {
        e.stopPropagation()
        await mutateAsync({
          data: {
            id: eventLog.value.id,
            extra: {
              ...eventLog.value.extra,
              endTime: new Date().toISOString(),
            },
          },
        })
      }
    }

    const htmlRefHook = ref<MaybeElementRef<MaybeElement>>(null!)

    onLongPress(
      htmlRefHook,
      () => {
        showActionSheet.value = true
      },
      {
        modifiers: {
          prevent: true,
        },
      },
    )

    const { mutateAsync: deleteEventLog } = useDeleteApiEventLogId()

    return () => {
      return (
        <div
          ref={htmlRefHook}
          class="flex select-none items-center gap-2 rounded-xl bg-white p-3"
        >
          <Icon class="!aspect-square !h-unset !w-1/4" name={eventLog.value.event.icon} />
          <div>
            <div class="flex flex-wrap items-center gap-1 text-xs text-gray-5">
              <span>
                {formatLogInfo(eventLog.value)}
              </span>
              {hasEndTimeField.value && startTime.value && (
                <div class="flex items-center gap-0.5 text-blue-6" onClick={stop}>
                  {getDuration(startTime.value, eventLogEndTime.value || endTime.value)}
                  {!eventLogEndTime.value && <Icon name="icon-stop" />}
                </div>
              )}
            </div>
            <div class="mt-1 text-0.6rem text-gray-4">
              {formatDatetime(eventLog.value.eventTime!, 'h:mm A')}
            </div>
            <div class="mt-1 whitespace-pre-wrap text-0.6rem text-gray-4">
              {eventLog.value.comment}
            </div>
          </div>
          <EventLogForm
            eventLog={eventLog.value}
            v-model:show={showPopup.value}
            onSuccess={refetchEventLogs}
          />
          <ClientOnly>
            <VanActionSheet
              class="!absolute"
              teleport="#root-container"
              v-model:show={showActionSheet.value}
              onSelect={(action) => {
                if (action.name === '删除') {
                  showActionSheet.value = false
                  showConfirmDialog({
                    title: '删除事件',
                    message: '删除后无法恢复，确认删除该事件吗？',
                    beforeClose: async (action) => {
                      if (action === 'confirm') {
                        await deleteEventLog({
                          id: String(eventLog.value.id),
                        })
                        await refetchEventLogs()
                      }
                      return true
                    },
                    confirmButtonColor: '#ee0a24',
                  })
                }
                if (action.name === '编辑') {
                  showActionSheet.value = false
                  showPopup.value = true
                }
              }}
              actions={[
                { name: '编辑', color: '#1989fa' },
                { name: '删除', color: '#ee0a24' },
              ]}
            />
          </ClientOnly>
        </div>
      )
    }
  },
})
