import { useQueryClient } from '@tanstack/vue-query'
import {
  type DataTableColumns,
  type FormInst,
  NButton,
  NCard,
  NDataTable,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NSpace,
  NUpload,
} from 'naive-ui'
import type { FileInfo } from 'naive-ui/es/upload/src/interface'
import { JsonMonacoEditor } from '#components'
import { baseURL } from '~/api/mutator/custom-instance'
import Icon from '~/components/Icon.vue'
import type { Event, PostApiUpload200 } from '~/schemas/model'
import { getGetApiEventQueryKey, useGetApiEvent, usePatchApiEvent } from '~/schemas/services/myAPI'
import { isRemoteImage } from '~/utils/isRemoteImage'
import './style.scss'

export default defineComponent({
  setup() {
    const modalShow = ref(false)
    const event = reactive<Event>({} as Event)

    const fileList = ref<FileInfo[]>([])

    const columns: DataTableColumns<Event> = [
      {
        title: 'ID',
        key: 'id',
      },
      {
        title: 'Name',
        key: 'name',
      },
      {
        title: 'DisplayName',
        key: 'displayName',
      },
      {
        title: 'Icon',
        key: 'icon',
        render(rowData) {
          return <Icon class="object-contain !h-12 !w-12" name={rowData.icon} />
        },
      },
      {
        title: 'ExtraFields',
        key: 'extraFields',
        render(rowData) {
          return (
            <div>
              {rowData.extraFields?.map(field => (
                <div key={field.name}>
                  {`${field.name}:${field.type}`}
                </div>
              ))}
            </div>
          )
        },
      },
      {
        title: 'CreatedAt',
        key: 'createdAt',
      },
      {
        title: 'UpdatedAt',
        key: 'updatedAt',
      },
      {
        title: 'Actions',
        key: 'actions',
        fixed: 'right',
        render(rowData) {
          return (
            <NSpace>
              <NButton
                size="small"
                type="primary"
                ghost
                onClick={() => {
                  modalShow.value = true
                  const { extraFields, ...rest } = rowData
                  const _event = {
                    ...rest,
                    extraFields: JSON.stringify(extraFields, null, 2),
                  }
                  Object.assign(event, _event)
                  if (rowData.icon && isRemoteImage(rowData.icon)) {
                    fileList.value = [{
                      id: rowData.icon,
                      name: rowData.icon,
                      thumbnailUrl: rowData.icon,
                      status: 'finished',
                      type: 'image/png',
                    }]
                  }
                  else {
                    fileList.value = []
                  }
                }}
              >
                Edit
              </NButton>
            </NSpace>
          )
        },
      },
    ]

    const { data, isFetching, suspense } = useGetApiEvent()

    onServerPrefetch(suspense)

    const formRef = ref<FormInst>(null!)

    const queryClient = useQueryClient()

    const mutation = usePatchApiEvent({
      mutation: {
        onSuccess() {
          modalShow.value = false
          return queryClient.invalidateQueries({
            queryKey: getGetApiEventQueryKey(),
          })
        },
      },
    })

    return () => {
      return (
        <div class="m-4">
          <NCard title="事件属性管理">
            <NDataTable
              loading={isFetching.value}
              columns={columns}
              data={data.value}
              bordered
              pagination={{
                pageSize: 10,
              }}
              scrollX="max-content"
            />
          </NCard>
          <NModal
            v-model:show={modalShow.value}
            class="max-w-700px"
          >
            <NCard title="编辑事件">
              <NForm
                ref={formRef}
                labelPlacement="left"
                labelWidth={120}
                model={event}
              >
                <NFormItem
                  label="Name"
                  path="name"
                  rule={[{
                    required: true,
                  }]}
                >
                  <NInput v-model:value={event.name} />
                </NFormItem>
                <NFormItem
                  label="DisplayName"
                  path="displayName"
                  rule={[{
                    required: true,
                  }]}
                >
                  <NInput v-model:value={event.displayName} />
                </NFormItem>
                <NFormItem
                  label="Icon"
                  path="icon"
                  rule={[{
                    required: true,
                  }]}
                >
                  <NSpace vertical class="w-full">
                    <NInput v-model:value={event.icon} />
                    <NUpload
                      action={`${baseURL}/api/upload`}
                      list-type="image-card"
                      accept="image/*"
                      max={1}
                      responseType="json"
                      onFinish={(res) => {
                        // eslint-disable-next-line ts/ban-ts-comment
                        // @ts-expect-error
                        const result = res.event.target.response as PostApiUpload200
                        event.icon = `//${result.bucket.domain}/${result.hash}`
                      }}
                      v-model:fileList={fileList.value}
                      fileListClass="file-list"
                    />
                  </NSpace>
                </NFormItem>
                <NFormItem
                  label="ExtraFields"
                  path="extraFields"
                  rule={[{
                    required: true,
                  }]}
                >
                  <JsonMonacoEditor v-model:value={event.extraFields} />
                </NFormItem>
                <NSpace justify="end">
                  <NButton
                    type="default"
                    onClick={() => {
                      modalShow.value = false
                    }}
                  >
                    Cancel
                  </NButton>
                  <NButton
                    type="primary"
                    loading={mutation.isPending.value}
                    onClick={async () => {
                      await formRef.value.validate()
                      mutation.mutate({
                        data: {
                          ...event,
                          // eslint-disable-next-line ts/ban-ts-comment
                          // @ts-expect-error
                          extraFields: JSON.parse(event.extraFields),
                        },
                      })
                    }}
                  >
                    OK
                  </NButton>
                </NSpace>
              </NForm>
            </NCard>
          </NModal>
        </div>
      )
    }
  },
})
