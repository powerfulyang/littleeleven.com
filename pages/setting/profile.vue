<script setup lang="ts">
import type { UploaderFileListItem } from 'vant/es/uploader/types'
import { postApiUpload, useGetApiBabyId, usePatchApiBaby } from '~/schemas/services/myAPI'
import { getUploadThumbnailURL } from '~/utils/getUploadURL'

const { data, suspense } = useGetApiBabyId('1')

onServerPrefetch(suspense)

const model = reactive<{
  name: string
  bornAt: string
  gender: number
  avatar: { id: number }[]
}>({
  name: '',
  bornAt: '',
  gender: 0,
  avatar: [],
})

watchEffect(() => {
  if (data.value) {
    Object.assign(model, {
      ...toRaw(data.value),
      avatar: [{
        url: getUploadThumbnailURL(data.value?.avatar),
        isImage: true,
        id: data.value?.avatar.id,
      }],
    })
  }
})

function afterRead(items: UploaderFileListItem | UploaderFileListItem[]) {
  const files = Array.isArray(items) ? items : [items]
  files.forEach((file) => {
    file.status = 'uploading'
    file.message = '上传中...'
    postApiUpload({
      file: file.file,
    }).then((res) => {
      file.status = 'done'
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      file.id = res.id
    }).catch((err) => {
      file.status = 'failed'
      file.message = err.message
    })
  })
}

const showPicker = ref(false)
const router = useRouter()
const { isPending, mutate } = usePatchApiBaby({
  mutation: {
    onSuccess() {
      router.replace('/setting')
    },
  },
})
function onSubmit() {
  const avatarId = model.avatar[0].id
  mutate({
    data: {
      ...model,
      avatar: avatarId,
      id: 1,
    },
  })
}
</script>

<template>
  <div class="h-full bg-#f5f5f5">
    <van-nav-bar
      title="宝宝信息"
      left-arrow
      class="mb-4"
      @click-left="router.back"
    />
    <van-form v-model="model" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="model.name"
          name="name"
          label="姓名"
          placeholder="姓名"
          required
          :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <van-field name="avatar" label="头像">
          <template #input>
            <van-uploader
              v-model="model.avatar"
              reupload
              :max-count="1"
              :deletable="false"
              :after-read="afterRead"
            />
          </template>
        </van-field>
        <van-field
          v-model="model.bornAt"
          is-link
          readonly
          name="bornAt"
          label="时间选择"
          placeholder="点击选择时间"
          @click="showPicker = true"
        />
        <van-field name="gender" label="性别">
          <template #input>
            <van-radio-group v-model="model.gender" direction="horizontal">
              <van-radio :name="1">
                男宝
              </van-radio>
              <van-radio :name="0">
                女宝
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <client-only>
          <van-popup
            v-model:show="showPicker"
            teleport="#root-container"
            class="!absolute"
            position="bottom"
          >
            <van-date-picker
              :model-value="model.bornAt.split('-')"
              @confirm="({ selectedValues }) => {
                model.bornAt = selectedValues.join('-')
                showPicker = false
              }"
              @cancel="showPicker = false"
            />
          </van-popup>
        </client-only>
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button :loading="isPending" round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style scoped lang="scss">

</style>
