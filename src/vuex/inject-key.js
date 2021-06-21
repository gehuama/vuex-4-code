import { inject } from "vue"
// 创建容器 返回一个store
export const storeKey = "store"
// vue内部已经将这些api导s出来了
export function useStore(injectKey = storeKey) {
    return inject(injectKey !== null ? injectKey : storeKey)
}