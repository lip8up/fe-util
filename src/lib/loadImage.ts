import { Dictionary } from 'lodash'

/**
 * LoadImage 结果
 */
export interface LoadImageResult {
  img: HTMLImageElement
  width: number
  height: number
}

const promiseMap = {} as Dictionary<Promise<LoadImageResult>>

/**
 * 选项
 */
export interface LoadImageOptions {
  /**
   * 是否匿名
   */
  anonymous?: boolean
}

const defaultOptions = {
  anonymous: false
}

/**
 * 手动加载图片
 * @param url 图片地址
 * @param options 选项
 */
export default function loadImage(
  url: string,
  options = {} as LoadImageOptions
) {
  const opts = {
    ...defaultOptions,
    ...options,
  }

  let promise = promiseMap[url]

  if (promise == null) {
    const img = new Image

    const clearHandlers = () => {
      delete img.onload
      delete img.onerror
    }

    promise = promiseMap[url] = new Promise((resolve, reject) => {
      img.onload = ev => {
        clearHandlers()
        resolve({
          img,
          width: img.width,
          height: img.height
        })
      }
      img.onerror = ev => {
        clearHandlers()
        delete promiseMap[url]
        reject(new Error(`failed to load ${url}`))
      }
      // anonymous 用于 canvas 下载图片到本地等情形
      opts.anonymous && img.setAttribute('crossOrigin', 'Anonymous')
      img.src = url
    })
  }

  return promise
}
