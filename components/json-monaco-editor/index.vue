<script setup lang="ts">
import type { editor } from 'monaco-editor'
import { baseURL } from '~/api/mutator/custom-instance'

const props = defineProps(['value'])

defineEmits(['update:value'])

const options: editor.IEditorConstructionOptions = {
  minimap: {
    enabled: false,
  },
}
const res = await fetch(`${baseURL}/api/doc`)
const json = await res.json()

const monaco = useMonaco()!
const editorRef = ref<{
  $editor: editor.IStandaloneCodeEditor
}>()

let model: editor.ITextModel

onMounted(() => {
  const modelUri = monaco.Uri.parse('schema.json')
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [
      {
        uri: modelUri.toString(),
        fileMatch: [modelUri.toString()],
        schema: json.components.schemas.EventExtraFields,
      },
    ],
  })
  model = monaco.editor.createModel(props.value, 'json', modelUri)
  editorRef.value!.$editor.setModel(model)
})

onUnmounted(() => {
  model.dispose()
})
</script>

<template>
  <monaco-editor
    ref="editorRef"
    :model-value="value"
    :options="options"
    class="h-300px w-full border border-gray-200 border-solid"
    @update:model-value="$emit('update:value', $event)"
  />
</template>

<style scoped lang="scss">

</style>
