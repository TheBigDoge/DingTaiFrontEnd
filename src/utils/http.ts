// uni-request.ts
import { getAuthToken } from './auth'

export interface Response<T> {
  statusCode: number,
  code: string,
  message: string,
  data?: T,
}

export interface Extra<T> {
  raw: Response<T>,
}

export type HttpResponse<T> = T & Extra<T>

function newResponse<T>(raw: Response<T>): HttpResponse<T> {
  return {
    ...(raw.data as T),
    raw: raw,
  }
}

type QueryParam = Record<string, string | number | boolean | undefined>

/**
 * 处理HTTP请求错误
 * @param err 
 */
function handleError(err: any) {
  console.error('HTTP request error:', err)
  if (err?.message) {
    uni.showToast({
      title: `错误: ${err?.message}`,
      icon: 'none',
    })
  }
}

function buildQueryString(queries?: QueryParam): string {
  if (!queries) return ''
  const params = new Map<string, string>();
  for (const [key, value] of Object.entries(queries)) {
    if (value !== undefined) {
      params.set(key, value.toString());
    }
  }

  const kv = [] as string[];
  for (const [key, value] of params) {
    kv.push(`${key}=${encodeURI(value)}`);
  }

  return kv ? `?${kv.join('&')}` : ''
}

interface UniRequestConfig {
  url: string,
  method: 'GET' | 'POST' | 'DELETE' | 'PUT',
  data?: any,
  header?: Record<string, any>,
  timeout?: number,
}

/**
 * 统一的请求函数，返回泛型HttpResponse<T>
 */
function request<T>(config: UniRequestConfig): Promise<HttpResponse<T>> {
  return new Promise((resolve, reject) => {
    // 请求拦截：加token
    const token = getAuthToken()
    const headers = {
      'Content-Type': 'application/json',
      ...(config.header || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    uni.request({
      url: import.meta.env.VITE_API_HOST + config.url,
      method: config.method,
      data: config.data,
      header: headers,
      timeout: config.timeout ?? 15000,
      success: (res) => {
        const { statusCode, data } = res

        // 假设后端返回格式和Response<T>一致
        if (statusCode === 200 && data) {
          resolve(newResponse<T>(data as Response<T>))
        } else {
          // HTTP状态码非200或后端返回异常都当作失败处理
          const error = {
            message: (data as Response<T>)?.message || `HTTP status ${statusCode}`,
            statusCode,
            code: (data as Response<T>)?.code || 'unknown',
            data,
          }
          handleError(error)
          reject(error)
        }
      },
      fail: (err) => {
        handleError(err)
        reject(err)
      }
    })
  })
}

async function get<T>(url: string, queries?: QueryParam): Promise<HttpResponse<T>> {
  const finalUrl = url + buildQueryString(queries)
  return request<T>({
    url: finalUrl,
    method: 'GET',
  })
}

async function post<R, T>(url: string, payload?: R): Promise<HttpResponse<T>> {
  return request<T>({
    url,
    method: 'POST',
    data: payload,
  })
}

async function put<R, T>(url: string, payload?: R): Promise<HttpResponse<T>> {
  return request<T>({
    url,
    method: 'PUT',
    data: payload,
  })
}

async function del<T>(url: string): Promise<HttpResponse<T>> {
  return request<T>({
    url,
    method: 'DELETE',
  })
}

export default {
  get,
  post,
  put,
  delete: del,
}
