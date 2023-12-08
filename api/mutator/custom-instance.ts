import { stringify } from 'qs'
import { showToast } from '#imports'
import { proxyBaseURL } from '~/constants'

let requestBaseURL = proxyBaseURL

// eslint-disable-next-line node/prefer-global/process
if (process.env.NODE_ENV === 'development' && process.client)
  requestBaseURL = ''

const baseURL = requestBaseURL

export { baseURL }

export async function customInstance<T>({
  url,
  method,
  params,
  data,
  headers,
  signal,
}: {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  params?: any
  data?: unknown
  responseType?: string
  headers?: HeadersInit
  signal?: AbortSignal
}): Promise<T> {
  let requestURL = `${baseURL}${url}`
  if (params)
    requestURL = `${requestURL}?${stringify(params)}`

  const contentType = headers?.['Content-Type'] || headers?.['content-type']

  let body = data as any

  if (contentType === 'application/json')
    body = JSON.stringify(data)

  if (contentType === 'multipart/form-data') {
    // 注意：当使用 FormData 时，不要手动设置 Content-Type
    // fetch 会自动设置正确的 Content-Type
    delete headers?.['Content-Type']
  }

  const response = await fetch(
    requestURL,
    {
      method,
      body,
      headers,
      signal,
    },
  )
  if (response.status === 204)
    return {} as T

  const json = await response.json()
  if (!response.ok) {
    showToast({
      type: 'fail',
      message: json.error,
    })
    throw new Error(json.error)
  }
  return json
}

export default customInstance

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = Error
