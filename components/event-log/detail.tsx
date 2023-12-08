import { useQueryClient } from '@tanstack/vue-query'
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
    const { eventLog } = props
    const hasEndTimeField = !!eventLog.event.extraFields?.filter(field => field.name === 'endTime')?.length
    const _endTime = eventLog.extra?.endTime as string
    const endTime = ref<string>(_endTime)
    const startTime = eventLog.extra?.startTime as string

    // 刷新持续时间，每秒刷新一次
    const interval = setInterval(() => {
      if (!_endTime)
        endTime.value = new Date().toString()
    }, 1000)

    onUnmounted(() => {
      clearInterval(interval)
    })

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
      if (_endTime) {
        showPopup.value = true
        return
      }
      e.stopPropagation()
      await mutateAsync({
        data: {
          id: eventLog.id,
          extra: {
            ...eventLog.extra,
            endTime: new Date().toISOString(),
          },
        },
      })
    }

    const htmlRefHook = ref<HTMLElement>(null!)

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
          <Icon class="!aspect-square !h-unset !w-1/4" name={eventLog.event.icon} />
          <div>
            <div class="flex flex-wrap items-center gap-1 text-xs text-gray-5">
              <span>
                {formatLogInfo(eventLog)}
              </span>
              {hasEndTimeField && startTime && (
                <div class="flex items-center gap-0.5 text-blue-6" onClick={stop}>
                  {getDuration(startTime, endTime.value)}
                  {!_endTime && <Icon name="icon-stop" />}
                </div>
              )}
            </div>
            <div class="mt-1 text-0.6rem text-gray-4">
              {formatDatetime(eventLog.eventTime!, 'h:mm A')}
            </div>
            <div class="mt-1 whitespace-pre-wrap text-0.6rem text-gray-4">
              {eventLog.comment}
            </div>
          </div>
          <EventLogForm
            eventLog={eventLog}
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
                          id: String(eventLog.id),
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
