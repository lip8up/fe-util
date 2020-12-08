import { Dictionary } from 'lodash'

const promiseMap = {} as Dictionary<Promise<HTMLScriptElement>>

/**
 * 手动加载脚本
 * @param url 脚本地址
 */
export default function loadScript(url: string) {
  let promise = promiseMap[url]

  if (promise == null) {
    const script = document.createElement('script')

    const clearHandlers = () => {
      delete script.onload
      delete script.onerror
    }

    promise = promiseMap[url] = new Promise((resolve, reject) => {
      script.onload = ev => {
        clearHandlers()
        resolve(script)
      }
      script.onerror = ev => {
        clearHandlers()
        delete promiseMap[url]
        reject(new Error(`failed to load ${url}`))
      }
      script.src = url
      document.body.appendChild(script)
    })
  }

  return promise
}
