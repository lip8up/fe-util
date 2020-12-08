/**
 * 所有的 Ajax 请求，都要使用该组件进行
 * @author zhangpeng
 */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import event from '@/lib/event'
import tryParseJson from '@/lib/tryParseJson'

/**
 * Ajax 调用结果
 */
export interface AjaxResult<DataType = any> {
  /** 结果 code */
  code: number
  /** 结果数据 */
  data: DataType
  /** 错误消息 */
  msg: string
  /** 是否被处理过，用于拦截错误处理 */
  handled?: boolean
}

/**
 * 判断 object 是否为 AjaxResult（只要含有 code 就行）
 * @param object 对象
 */
export function isAjaxResult(object: any) {
  return !!(object && typeof object === 'object' && 'code' in object)
}

/**
 * Ajax 选项，在 `AxiosRequestConfig` 的基础上，加上一些扩展配置
 */
export interface AjaxOptions extends AxiosRequestConfig {
  /**
   * 观察调用结果，若返回值，该值将作为接下来的 response
   * @param response 调用结果
   */
  inspect?(response: AxiosResponse<AjaxResult>): any

  /**
   * 观察原始错误，若返回值，该值将作为接下来的 exception
   * @param exception 原始错误
   */
  error?(exception: any): any
}

let ajaxBaseUrl = ''

/**
 * 获取 Ajax 基础 URL
 */
export function getAjaxBaseUrl() {
  return ajaxBaseUrl
}

/**
 * 设置 Ajax 基础 URL，该方法只能调用一次
 * @param url 基础 URL
 */
export function setAjaxBaseUrl(url: string) {
  if (ajaxBaseUrl !== '') {
    throw Error(`Cannot call setAjaxBaseUrl, because it already has a value ${ajaxBaseUrl}`)
  }
  ajaxBaseUrl = url
}

const isAbsoluteUrl = (url: string) => /^[a-z][a-z0-9+.-]*:/.test(url)

const emit = <DataType = any>(response: AjaxResult<DataType>) => {
  // 延迟发出 event，以便可以被阻止
  response.handled = false
  setTimeout(() => response.handled || event.emit(`ajax${response.code}`, response))
  return response
}

// 确保最终的数据，始终有值
const perfectData = <DataType = any>({ code, data, msg }: any = {}): AjaxResult<DataType> => {
  return {
    code,
    data: data || {},
    msg: msg || ''
  }
}

const request = async <DataType = any>(url: string, options: AjaxOptions): Promise<AjaxResult<DataType>> => {
  const isAbs = isAbsoluteUrl(url)

  const config = {
    baseURL: isAbs ? '' : ajaxBaseUrl,
    url,
    withCredentials: true,
    ...options,
  }

  let res: any

  try {
    res = await axios(config)
    const inspectResult = config.inspect && config.inspect(res as AxiosResponse<AjaxResult<DataType>>)
    inspectResult && (res = inspectResult)
  } catch (ex) {
    const errorResult = config.error && config.error(ex)
    errorResult && (ex = errorResult)
    if (ex && ex.response) {
      const { status, data: html } = ex.response
      const error: any = { code: status, data: { html }, msg: 'HTTP 错误' }
      // 对 500 进一步处理
      if (status == 500) {
        res = {
          data: tryParseJson(html, error)
        }
      } else {
        throw emit(error)
      }
    } else {
      const msg = ex && ex.message || '未知错误'
      throw emit({ code: 810, data: { ex }, msg })
    }
  }

  const { data } = res as AxiosResponse<AjaxResult<DataType>>
  if (data && data.code !== undefined) {
    const result = perfectData(data) as AjaxResult<DataType>
    if (data.code == 0) {
      return result
    } else {
      throw emit(result)
    }
  } else {
    throw emit({ code: 800, data: { raw: data }, msg: '数据格式错误' })
  }
}

/**
 * 执行 http GET 请求
 * @param url 请求的 url
 * @param data 请求数据
 * @param options 选项
 */
export async function ajaxGet<DataType = any>(url: string, data?: object, options?: AjaxOptions) {
  return request<DataType>(url, {
    method: 'get',
    params: {
      ...data,
      _: Date.now(),
    },
    ...options,
  })
}

/**
 * 执行 http POST 请求
 * @param url 请求的 url
 * @param data 请求数据
 * @param options 选项
 */
export async function ajaxPost<DataType = any>(url: string, data?: object, options?: AjaxOptions) {
  return request<DataType>(url, {
    method: 'post',
    data,
    ...options,
  })
}

/**
 * 执行 http PUT 请求
 * @param url 请求的 url
 * @param data 请求数据
 * @param options 选项
 */
export async function ajaxPut<DataType = any>(url: string, data?: object, options?: AjaxOptions) {
  return request<DataType>(url, {
    method: 'put',
    data,
    ...options,
  })
}

/**
 * 执行 http DELETE 请求
 * @param url 请求的 url
 * @param data 请求数据
 * @param options 选项
 */
export async function ajaxDelete<DataType = any>(url: string, data?: object, options?: AjaxOptions) {
  return request<DataType>(url, {
    method: 'delete',
    data,
    ...options,
  })
}
