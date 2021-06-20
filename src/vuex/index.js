import {inject} from "vue"
// 创建容器 返回一个store
const storeKey = "store"
class Store{
    constructor(options){

    }
    install(app, injectKey){ // createApp().use(store, 'my')
        // 全局暴露一个变量 暴露的是store的实例
        app.provide(injectKey || storeKey,this);
    }
}

export function createStore(options) {
    return new Store(options)
    
}
// vue内部已经将这些api导s出来了
export function useStore(injectKey = storeKey){
    return inject(injectKey !== null ? injectKey : storeKey)
}