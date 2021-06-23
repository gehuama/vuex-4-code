// import { reactive } from "vue"
// import { forEachValue } from "./utils";
import { storeKey } from "./inject-key";
import  ModuleCollection from "./module/module-collection";

function installModule(store,rootState,path,module){ // 递归安装
    let isRoot = !path.length; // 如果数组是空数组， 说明是根，否则不是
    if(!isRoot){ // [aCount,cCount]
        let parentState = path.slice(0,-1).reduce((state,key)=>state[key],rootState);
        parentState[path[path.length-1]] = module.state;
    }
    module.forEachChild((child,key)=>{ // key:aCount bCount
        installModule(store,rootState,path.concat(key),child)
    });
}

export default class Store {
    constructor(options) {
        // {state,actions,mutations,getter,modules} // store.modules.aCount.state
        const store = this;
        store._modules = new ModuleCollection(options); // 格式化完modules
        // 定义状态
        const state = store._modules.root.state; // 跟状态
        installModule(state, state,[], store._modules.root) 
        // 把状态定义到 store.state.aCount.cCount.count
        console.log(state);
    }
    install(app, injectKey) { // createApp().use(store, 'my')
        // 全局暴露一个变量 暴露的是store的实例
        app.provide(injectKey || storeKey, this); // 给跟app增加一个 _provides,子组件会去向上查找
        // vue.properties.$store = this
        app.config.globalProperties.$store = this; // 增添 $store
    }
}

// 格式化用户的参数，实现根据自己的需要 后续使用时方便
// let rootModule={ state,actions,mutations,getters,modules}
// let root= {
//     _row:rootModule,
//     state: rootModule.state,
//     _children:{
//         aCount:{
//             _raw:aModule,
//             state:aModule.state,
//             _children:{
//                 _raw:cModule,
//                 state:cModule.state,
//                 _children:{
                    
//                 }
//             }
//         },
//         bCount:{
//             _raw:bsModule,
//             state:bModule.state,
//             _children:{}
//         }
//     }
// }

// root.state aCount.state bCount.state