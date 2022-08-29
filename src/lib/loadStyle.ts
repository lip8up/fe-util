const promiseMap = {} as Record<string, Promise<HTMLLinkElement>>

/**
 * 手动加载样式
 * @param url 样式地址
 */
export default function loadStyle(url: string) {
  let promise = promiseMap[url]

  if (promise == null) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'

    const clearHandlers = () => {
      link.onload = null
      link.onerror = null
    }

    promise = promiseMap[url] = new Promise((resolve, reject) => {
      link.onload = ev => {
        clearHandlers()
        resolve(link)
      }
      link.onerror = ev => {
        clearHandlers()
        delete promiseMap[url]
        reject(new Error(`failed to load ${url}`))
      }
      link.href = url
      document.body.appendChild(link)
    })
  }

  return promise
}
