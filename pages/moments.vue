<script setup lang="ts">
import { showImagePreview } from 'vant'
import type { UploaderInstance } from 'vant'
import type { UploaderFileListItem } from 'vant/es/uploader/types'
import type { GetApiMoment200DataItem } from '~/schemas/model'
import {
  deleteApiMomentId,
  postApiUpload,
  useGetApiBabyId,
  useGetApiMoment,
  usePostApiMoment,
  usePutApiMoment,
} from '~/schemas/services/myAPI'
import { getUploadThumbnailURL, getUploadURL } from '~/utils/getUploadURL'

function getInitialValue() {
  return {
    content: '',
    attachments: [],
    id: undefined,
  }
}

const formValue = reactive<{
  content: string
  attachments: { id: number }[]
  id: number | undefined
}>(getInitialValue())

const { data: baby, isPending: isFetchingBabyInfo } = useGetApiBabyId('1')

const { data: momentsResult, refetch, isPending: isFetchingMoments } = useGetApiMoment(
  {
    type: 'moment',
  },
)

const isFetching = computed(() => {
  return isFetchingBabyInfo.value || isFetchingMoments.value
})

const moments = computed(() => {
  return momentsResult.value?.data || []
})

const { isPending: isPosting, mutate: postMoment } = usePostApiMoment({
  mutation: {
    onSuccess() {
      Object.assign(formValue, getInitialValue())
      refetch()
    },
  },
})

const { isPending: isPutting, mutate: putMoment } = usePutApiMoment({
  mutation: {
    onSuccess() {
      Object.assign(formValue, getInitialValue())
      refetch()
    },
  },
})

const isPending = computed(() => {
  return isPosting.value || isPutting.value
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

const uploaderRef = ref<UploaderInstance>(null!)

function onSubmit() {
  if (formValue.id) {
    putMoment({
      data: {
        ...formValue,
        id: formValue.id,
      },
    })
  }
  else {
    postMoment({
      data: formValue,
    })
  }
}

const containerRef = ref<HTMLElement>(null!)

function updateItem(item: GetApiMoment200DataItem) {
  Object.assign(formValue, {
    content: item.content,
    attachments: item.attachments?.map((attachment) => {
      return {
        id: attachment.id,
        url: getUploadThumbnailURL(attachment),
        file: new File([], '', {
          type: attachment.mediaType,
        }),
        objectUrl: getUploadThumbnailURL(attachment) || getUploadURL(attachment),
      }
    }),
    id: item.id,
  })
  containerRef.value.scrollTo(0, 0)
}

function deleteItem(item: GetApiMoment200DataItem) {
  showConfirmDialog({
    title: '确定要删除吗？',
    message: '删除后不可恢复',
    beforeClose: async (action) => {
      if (action === 'confirm') {
        await deleteApiMomentId(String(item.id))
        await refetch()
      }
      return true
    },
    confirmButtonColor: '#ee0a24',
  })
}
</script>

<template>
  <div ref="containerRef" class="h-full w-full overflow-auto bg-#f5f5f5 pb-12">
    <van-nav-bar
      title="动态"
    />
    <van-form class="px-4 pt-4" @submit="onSubmit">
      <van-field
        v-model="formValue.content"
        type="textarea"
        :rows="5"
        placeholder="说点什么吧"
        spellcheck
        class="mb-2 rounded-xl"
        :rules="[{
          required: true,
          message: '请输入内容',
        }]"
      />
      <van-uploader
        ref="uploaderRef"
        v-model="formValue.attachments"
        accept="image/*,video/*,audio/*"
        class="uploader mb-2"
        multiple
        :after-read="afterRead"
        :show-upload="false"
      >
        <template #preview-cover="{ file }">
          <div v-if="file.type.startsWith('video/') || file.type.startsWith('audio/')" class="relative h-full w-full flex items-center justify-center">
            <video
              :poster="file.type.startsWith('audio/') ? '/audio.jpg' : undefined"
              class="h-full w-full object-cover"
              :src="formValue.attachments.find(x => x.file === file).objectUrl"
              @click="e => {
                e.target.requestFullscreen()
                e.target.play()
              }"
            />
            <van-icon class="play-icon" size="40" name="play-circle-o" />
          </div>
        </template>
      </van-uploader>
      <div class="flex items-center justify-end gap-2">
        <span class="text-xs text-pink" @click="uploaderRef.chooseFile()">上传文件</span>
        <van-button
          v-if="formValue.id"
          type="warning"
          size="small"
          @click="Object.assign(formValue, getInitialValue())"
        >
          放弃修改
        </van-button>
        <van-button
          native-type="submit"
          size="small"
          type="primary"
          :loading="isPending"
        >
          {{ formValue.id ? '修改' : '发布' }}
        </van-button>
      </div>
    </van-form>
    <div v-if="!isFetching" class="p-4 space-y-4">
      <van-empty v-if="!moments?.length" description="还没有动态哦，快去发布吧～" />
      <div
        v-for="moment in moments"
        :key="moment.id"
        class="rounded-xl bg-white p-4"
      >
        <div class="flex items-center gap-2">
          <van-image width="45" height="45" fit="cover" round :src="getUploadThumbnailURL(baby?.avatar)" />
          <div class="flex flex-1 flex-col">
            <span class="text-pink">{{ baby?.name }}</span>
            <span class="text-xs text-gray-4">
              {{ formatDatetime(moment.createdAt) }}
            </span>
          </div>
          <div>
            <span class="cursor-pointer text-red" @click="deleteItem(moment)">
              删除
            </span>
            <span class="cursor-pointer text-pink" @click="updateItem(moment)">
              修改
            </span>
          </div>
        </div>
        <div class="whitespace-pre-wrap pt-2">
          {{ moment.content }}
        </div>
        <div v-if="moment.attachments" class="grid grid-cols-3 gap-1 pt-2">
          <template
            v-for="(attachment, index) in moment.attachments"
            :key="attachment.id"
          >
            <div
              v-if="attachment.mediaType.startsWith('video/') || attachment.mediaType.startsWith('audio/')"
              class="relative aspect-square w-full flex items-center justify-center"
            >
              <video
                :poster="attachment.mediaType.startsWith('audio/') ? '/audio.jpg' : undefined"
                class="h-full w-full object-cover"
                :src="getUploadURL(attachment)"
                @click="e => {
                  e.target.requestFullscreen()
                  e.target.play()
                }"
              />
              <van-icon class="play-icon" size="40" name="play-circle-o" />
            </div>
            <van-image
              v-if="attachment.mediaType.startsWith('image/')"
              fit="cover"
              lazy-load
              class="aspect-square w-full"
              :src="`//${attachment.bucket.domain}/${attachment.thumbnailHash}`"
              @click="showImagePreview({
                images: moment.attachments.map((item) => {
                  return `//${item.bucket.domain}/${item.hash}`
                }),
                startPosition: index,
              })"
            />
          </template>
        </div>
      </div>
    </div>
    <van-loading v-else color="#ec489a" vertical mt-4>
      加载中...
    </van-loading>
  </div>
</template>

<style lang="scss">
.uploader {
  width: 100%;
  display: block !important;
 .van-uploader__wrapper {
   display: grid;
   grid-template-columns: repeat(3, 1fr); /* 定义三列 */
   gap: 10px; /* 定义列间距 */
   .van-uploader__preview{
      width: 100%;
      aspect-ratio: 1 / 1; /* 宽高比 1:1 */
      margin: unset;
     .van-uploader__preview-image{
        width: 100%;
        height: 100%;
        object-fit: cover;
     }
   }
   .van-uploader__upload{
     width: 100%;
     aspect-ratio: 1 / 1; /* 宽高比 1:1 */
     margin: unset;
     height: unset;
   }
   .van-uploader__input-wrapper {
     grid-column: 1 / -1;
   }
 }
}

.play-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  pointer-events: none;
}
</style>
