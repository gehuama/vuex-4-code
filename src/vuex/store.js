import { reactive, watch } from "vue"
import { isPromise, forEachValue } from "./utils";
import { storeKey } from "./inject-key";
import ModuleCollection from "./module/module-collection";

function getNestedState(state, path) { // 根据路径获取store.上面的最新状态
    return path.reduce((state, key) => state[key], state)
}

// 后续我们会将store.state 用 reactive 包裹
function installModule(store, rootState, path, module) { // 递归安装
    let isRoot = !path.length; // 如果数组是空数组， 说明是根，否则不是

    const namespaced = store._modules.getNamespaced(path); // [a,c]
    console.log(namespaced)
    if (!isRoot) { // [aCount,cCount]
        let parentState = path.slice(0, -1).reduce((state, key) => state[key], rootState);
        store._withCommit(() => {
            parentState[path[path.length - 1]] = module.state;
        })

    }
    // getters module._raw.getters
    module.forEachGetter((getter, key) => { //{double:function(state){}}
        store._wrappedGetters[namespaced + key] = () => { // 例子：state,[a]
            return getter(getNestedState(store.state, path)) // 如果直接使用模块上自己的状态，此状态不是响应式的
        }
    })

    // mutations module._raw.mutations {add,fn,fn} 
    // add:[mutation]
    module.forEachMutation((mutation, key) => {
        const entry = store._mutations[namespaced + key] || (store._mutations[namespaced + key] = [])
        entry.push((payload) => { // store.commit("add", payload)
            mutation.call(store, getNestedState(store.state, path), payload)
        });
    })
    // mutations 和 actions 的一个区别 actions执行后会返回一个是promise
    // actions module._raw.actions
    module.forEachAction((action, key) => {
        const entry = store._actions[namespaced + key] || (store._actions[namespaced + key] = [])
        entry.push((payload) => { // store.dispatch("add", payload) store.dispatch("login", payload).then(()=>{})
            let res = action.call(store, store, payload);
            // res 是不是promise
            if (!isPromise(res)) {
                return Promise.resolve(res);
            }
            return res;
        });
    })

    module.forEachChild((child, key) => { // key:aCount bCount
        installModule(store, rootState, path.concat(key), child)
    });
}
function resetStoreState(store, state) {
    store._state = reactive({ data: state }); // store._state.data = "xxx"
    const wrappedGetters = store._wrappedGetters;
    store.getters = {};
    forEachValue(wrappedGetters, (getter, key) => {
        Object.defineProperty(store.getters, key, {
            get: getter,
            enumerable: true
        })
    })
    if (store.strict) {
        enableStrictMode(store);
    }
}
// mutation 和 action的区别 ？
function enableStrictMode(store) {
    watch(() => store._state.data, () => { // 监控数据变化，数据变化后执行回调函数 effect
        // 如果断言为false，则将一个错误消息写入控制台。如果断言是 true，没有任何反应。
        console.assert(store._committing, 'do not mutate vuex store state outside mutation handlers');
    }, { deep: true, flush: 'sync' }); // 默认watchApi是异步的，这里改成同步的监控
}
export default class Store {
    _withCommit(fn) { // 切片
        const committing = this._committing;
        this._committing = true;
        fn();
        this._committing = committing;
    }
    constructor(options) {
        // {state,actions,mutations,getter,modules} // store.modules.aCount.state
        const store = this;
        // 第一步数据格式化
        store._modules = new ModuleCollection(options); // 格式化完modules
        // {add[fn,fn,fn]} // 发布订阅模式
        store._wrappedGetters = Object.create(null);
        store._mutations = Object.create(null);
        store._actions = Object.create(null);
        this.strict = options.strict || false;

        // 调用的时候 知道是mutation,mutation里面得写是同步
        this._committing = false;
        // 在mutation之前添加一个状态 _committing = true;
        // 调用mutation-> 会更改状态，我们就监控这个状态 如果当前状态变化的时:
        // _committing = true; 同步更改 
        // _committing = false; 异步更改

        // 定义状态
        const state = store._modules.root.state; // 跟状态
        // 第二步 安装 保存在需要的变量上
        installModule(store, state, [], store._modules.root)
        // 第三步 给容器添加对应状态
        resetStoreState(store, state);
        // 把状态定义到 store.state.aCount.cCount.count
        // console.log(state, state);
        store._subscribes = []
        options.plugins.forEach((plugin) => {
            plugin(store);
        });


    }
    subscribe(fn) {
        this._subscribes.push(fn)
    }
    replaceState(newState) {
        // 严格模式下 不能直接修改状态
        this._withCommit(() => {
            this._state.data = newState;
        })

    }
    get state() {
        return this._state.data;
    }
    commit = (type, payload) => {
        const entry = this._mutations[type] || [];
        this._withCommit(() => {
            entry.forEach(handler => handler(payload));
        })
        this._subscribes.forEach(sub => {
            sub({ type, payload }, this.state)
        });
    }
    dispatch = (type, payload) => {
        const entry = this._actions[type] || [];
        return Promise.all(entry.map(handler => handler(payload)))
    }
    install(app, injectKey) { // createApp().use(store, 'my')
        // 全局暴露一个变量 暴露的是store的实例
        app.provide(injectKey || storeKey, this); // 给跟app增加一个 _provides,子组件会去向上查找
        // vue.properties.$store = this
        app.config.globalProperties.$store = this; // 增添 $store
    }
    registerModule(path, rawModule) { // is aCount/bCount
        const store = this;
        if (typeof path == 'string') {
            path = [path]
        }
         // 要在原有的模块基础上新增加一个
         const newModule = store._modules.register(rawModule, path); // 注册上去
         // 再把模块安装上
        installModule(store, store.state, path, newModule)
         // 重置容器
        resetStoreState(store, store.state)
    }
}

