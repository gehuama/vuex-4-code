import { reactive } from "vue"
import { forEachValue } from "./utils";
import { storeKey } from "./inject-key";
export default class Store {
    constructor(options) {
        console.log(options)
        // this.a =100; 
        // vue3 内部会创造一个vue实例，但vuex4直接会采用vue3提供的响应式方法
        // this.state = options.state;
        const store = this;
        // store._store.data 
        store._state = reactive({ data: options.state }) // new Vue()
        // vuex 中有个比较重要的API replaceState
        const _getters = options.getters; // {double: function => getter}
        store.getters = {};
        forEachValue(_getters, function (fn, key) {
            Object.defineProperty(store.getters, key, {
                get: () => fn(store.state) // computed, 很遗憾，在vuex中vue3.1 不能用computed 实现 如果组件销毁了会移除计算属性，vue3.2会改掉这个bug

            })
        })
        // mutation action {add:function} {asyncAdd: function}
        // commit("add") dispatch("asyncAdd")
        store._mutations = Object.create(null);
        store._actions = Object.create(null);
        const _mutations = options.mutations;
        const _actions = options.actions;
        forEachValue(_mutations, (mutations, key) => {
            store._mutations[key] = (payLoad) => {
                mutations.call(store, store.state, payLoad);
            }
        })
        forEachValue(_actions, (actions, key) => { //
            store._actions[key] = (payLoad) => {
                actions.call(store, store, payLoad);
            }
        })
    }
    commit = (type, payLoad) => { // bindsss
        this._mutations[type](payLoad);
    }
    dispatch = (type, payload) => {
        this._actions[type](payload);
    }
    get state() { // 类的属性访问器
        return this._state.data;
    }
    install(app, injectKey) { // createApp().use(store, 'my')
        // 全局暴露一个变量 暴露的是store的实例
        app.provide(injectKey || storeKey, this); // 给跟app增加一个 _provides,子组件会去向上查找
        // vue.properties.$store = this
        app.config.globalProperties.$store = this; // 增添 $store
    }
}