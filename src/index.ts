type StopInterceptor = () => void

const interceptors: Record<string, UniApp.InterceptorOptions[]> = {}

/**
 * @description
 * - 用于拦截指定API，返回一个移除"添加时"拦截器的函数
 * - 使用方式与"uni.addInterceptor"一致，不同点在于"uni.removeInterceptor"是移除指定API所有拦截器
 * - 文档: [http://uniapp.dcloud.io/api/interceptor](http://uniapp.dcloud.io/api/interceptor)
 * @param api 拦截API
 * @param interceptorOptions 拦截器配置
 * @returns 移除拦截器的函数
 * @example
 * ```ts
 * import useInterceptor, { removeAllInterceptor } from 'uni-use-interceptor'
 * const stop = useInterceptor('request', {
 *   invoke(args) {
 *     args.url = 'https://www.example.com/' + args.url
 *   }
 * })
 * // 移除指定拦截器
 * stop()
 * // 移除所有拦截器
 * removeAllInterceptor('request')
 * ```
 */
export default function useInterceptor(api: string, interceptorOptions: UniApp.InterceptorOptions): StopInterceptor {
  if (interceptors[api]) {
    const i = interceptors[api].push(interceptorOptions) - 1
    return () => stopInterceptor(i, api)
  } else {
    interceptors[api] = []
  }

  uni.addInterceptor(api, {
    invoke(...args) {
      for (const intcp of interceptors[api]) {
        if (intcp.invoke) intcp.invoke(...args)
      }
    },
    success(...result) {
      for (const intcp of interceptors[api]) {
        if (intcp.success) intcp.success(...result)
      }
    },
    fail(...err) {
      for (const intcp of interceptors[api]) {
        if (intcp.fail) intcp.fail(...err)
      }
    },
    complete(...res) {
      for (const intcp of interceptors[api]) {
        if (intcp.complete) intcp.complete(...res)
      }
    },
    returnValue(res) {
      for (const intcp of interceptors[api]) {
        if (intcp.returnValue) return intcp.returnValue(res)
      }

      return res
    }
  })

  const i = interceptors[api].push(interceptorOptions) - 1
  return () => stopInterceptor(i, api)
}

function stopInterceptor(i: number, api: string) {
  if (!interceptors[api]) return

  if (!interceptors[api].length) {
    delete interceptors[api]
    uni.removeInterceptor(api)
    return
  }

  interceptors[api].splice(i, 1)
}

export function removeAllInterceptor(api: string) {
  if (!interceptors[api]) return

  delete interceptors[api]
  uni.removeInterceptor(api)
}
