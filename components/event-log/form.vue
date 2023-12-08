<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import dayjs from 'dayjs'
import type { PropType } from 'vue'
import type { Event, EventLogResult } from '~/schemas/model'
import { patchApiEventLog, postApiEventLog } from '~/schemas/services/myAPI'
import { formatDatetime, timeToISOString } from '~/utils/formatDatetime'

const props = defineProps({
  event: {
    type: Object as PropType<Event>,
  },
  eventLog: {
    type: Object as PropType<EventLogResult>,
  },
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<
  {
    (event: 'update:show', show: boolean): void
    (event: 'success', time: string): void
  }
  >()

const eventLog = computed(() => props.eventLog)

const isEdit = computed(() => !!eventLog?.value)

const event = computed(() => props.eventLog?.event ?? props.event)

const { isPending, mutate } = useMutation({
  mutationFn: (variables: any) => {
    if (eventLog?.value?.id) {
      return patchApiEventLog({
        id: eventLog.value.id,
        ...variables,
      })
    }
    return postApiEventLog(variables)
  },
  onSuccess: (v) => {
    emit('update:show', false)
    emit('success', formatDatetime(v.eventTime!, 'YYYY-MM-DD'))
  },
})

function getInitialValues() {
  let extra: Record<string, any> = {}
  let eventTime = dayjs().format('HH:mm')
  let comment = ''
  if (eventLog?.value) {
    extra = Object.assign({}, eventLog.value.extra)
    extra.endTime = extra.endTime ? dayjs(extra.endTime).format('HH:mm') : undefined
    eventTime = dayjs(eventLog.value.eventTime!).format('HH:mm')
    comment = eventLog.value.comment!
  }
  else {
    event?.value?.extraFields?.forEach((field) => {
      if (field.type === 'checkbox')
        extra[field.name] = []
      if (field.defaultValue !== undefined)
        extra[field.name] = field.defaultValue
    })
  }
  return {
    eventTime,
    extra,
    comment,
  }
}

const formValues = reactive(getInitialValues())

const show = toRef(props, 'show')

watch(show, (v) => {
  if (v)
    Object.assign(formValues, getInitialValues())
})

async function onSubmit(values) {
  let { eventTime, comment, ...extra } = values
  eventTime = timeToISOString(eventTime, eventLog?.value)

  if (event.value?.extraFields?.find(field => field.name === 'endTime'))
    extra.startTime = eventTime

  if (extra.endTime)
    extra.endTime = timeToISOString(extra.endTime, eventLog?.value)

  mutate({
    eventName: event.value!.name,
    eventTime,
    extra,
    comment,
  })
}
</script>

<template>
  <ClientOnly>
    <van-popup
      :show="show"
      position="bottom"
      :style="{ backgroundColor: '#f5f5f5', position: 'absolute' }"
      teleport="#root-container"
      @close="emit('update:show', false)"
    >
      <div flex px-6 pt-2 text-sm font-medium>
        {{ event?.displayName }}
      </div>
      <div px-6 pb-3 pt-1 text-xs text-gray-4>
        记录当下，分享未来
      </div>
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="formValues.eventTime"
            name="eventTime"
            label="开始时间"
            type="time"
            :required="true"
            placeholder="请选择开始时间"
            :rules="[{ required: true, message: '开始时间是必填项' }]"
          />
          <template
            v-for="field in event?.extraFields?.filter(field => field.userInput || isEdit)"
            :key="field.name"
          >
            <van-field
              v-if="field.type === 'radio' && (!field.cascade || formValues.extra[field.cascade?.fieldName] === field.cascade?.fieldValue)"
              v-model="formValues.extra[field.name]"
              :required="field.required"
              :name="field.name"
              :label="field.displayName"
              :type="field.type"
              :placeholder="`请输入${field.displayName}`"
              :rules="[{ required: field.required, message: `${field.displayName}是必填项` }]"
            >
              <template #input>
                <van-radio-group v-model="formValues.extra[field.name]" direction="vertical">
                  <van-radio v-for="o in field.enums" :key="o" mt-1 :name="o">
                    {{ o }}
                  </van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              v-else-if="field.type === 'checkbox' && (!field.cascade || formValues.extra[field.cascade?.fieldName] === field.cascade?.fieldValue)"
              :required="field.required"
              :name="field.name"
              :label="field.displayName"
              :type="field.type"
              :placeholder="`请输入${field.displayName}`"
              :rules="[{ required: field.required, message: `${field.displayName}是必填项` }]"
            >
              <template #input>
                <van-checkbox-group v-model="formValues.extra[field.name]" direction="vertical">
                  <van-checkbox v-for="o in field.enums" :key="o" shape="square" mt-1 :name="o">
                    {{ o }}
                  </van-checkbox>
                </van-checkbox-group>
              </template>
            </van-field>
            <van-field
              v-else-if="field.type !== 'picker' && (!field.cascade || formValues.extra[field.cascade?.fieldName] === field.cascade?.fieldValue)"
              v-model="formValues.extra[field.name]"
              :required="field.required"
              :name="field.name"
              :label="field.displayName"
              :type="field.type"
              :placeholder="`请输入${field.displayName}`"
              :rules="[{ required: field.required, message: `${field.displayName}是必填项` }]"
            />
          </template>
          <van-field
            v-model="formValues.comment"
            name="comment"
            label="备注"
            placeholder="记录美好生活..."
            type="textarea"
            rows="2"
            autosize
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button :loading="isPending" round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </van-popup>
  </ClientOnly>
</template>

<style scoped lang="scss">

</style>
