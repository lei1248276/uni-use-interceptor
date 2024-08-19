# uni-use-interceptor
- 优化版 uni Interceptor，使用方式与"uni.addInterceptor"一致，不同点在于"uni.removeInterceptor"是移除指定API所有拦截器，该实现可以移除其中一个或所有。


## Install 
```bash
pnpm add uni-use-interceptor
```
```bash
yarn add uni-use-interceptor
```
```bash
npm install uni-use-interceptor
```

## Usage
```typescript
import useInterceptor, { removeAllInterceptor } from 'uni-use-interceptor'
const stop = useInterceptor('request', {
  invoke(args) {
    args.url = 'https://www.example.com/' + args.url
  }
})
// 移除指定拦截器
stop()
// 移除所有拦截器
removeAllInterceptor('request')
```