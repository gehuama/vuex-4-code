import {inject, reactive } from "vue"
// 创建容器 返回一个store
const storeKey = "store"
class Store{
    constructor(options){
        console.log(options)
        // this.a =100; 
        // vue3 内部会创造一个vue实例，但vuex4直接会采用vue3提供的响应式方法
        // this.state = options.state;
        const store = this ;
        // store._store.data 
        store._state = reactive({data: options.state}) // new Vue()
        
        // vuex 中有个比较重要的API replaceState
    }
    get state(){ // 类的属性访问器
        return this._state.data;
    }
    install(app, injectKey){ // createApp().use(store, 'my')
        // 全局暴露一个变量 暴露的是store的实例
        app.provide(injectKey || storeKey,this); // 给跟app增加一个 _provides,子组件会去向上查找
        // vue.properties.$store = this
        app.config.globalProperties.$store = this; // 增添 $store
    }
}

export function createStore(options) {
    return new Store(options)
    
}
// vue内部已经将这些api导s出来了
export function useStore(injectKey = storeKey){
    return inject(injectKey !== null ? injectKey : storeKey)
}