import { defineConfig } from 'orval'
import { proxyBaseURL } from './constants'

const config = defineConfig({
  petstore: {
    output: {
      mode: 'split',
      target: './schemas/services',
      schemas: './schemas/model',
      client: 'vue-query',
      mock: false,
      override: {
        mutator: {
          path: './api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
    input: {
      target: `${proxyBaseURL}/api/doc`,
    },
  },
})

export default config
