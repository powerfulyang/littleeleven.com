import { stringify } from 'qs'
import { showToast } from '#imports'
import { proxyBaseURL } from '~/constants'

let baseURL = proxyBaseURL

// eslint-disable-next-line node/prefer-global/process
if (process.env.NODE_ENV === 'development' && process.client)
  baseURL = ''

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

  const response = await fetch(
    requestURL,
    {
      method,
      ...(data ? { body: JSON.stringify(data) } : {}),
      headers,
      signal,
    },
  )
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
