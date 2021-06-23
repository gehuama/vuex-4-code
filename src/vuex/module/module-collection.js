import {forEachValue} from "../utils"
import Module from "./module"
// 模块收集
export default class ModuleCollection{
    constructor(rootModule){
        this.root = null
        this.register(rootModule, []); // root =>a b a=>c
    }
    register(rawModule, path){
        const newModule = new Module(rawModule)
        if(path.length===0){ // 是一个跟模块
            this.root = newModule;
        }else{
            // [a] [b] [a,c]
            const parent = path.slice(0, -1).reduce((module, current)=>{
                return module.getChild(current)
            }, this. root)
            parent.addChild(path[path.length-1],newModule);
        }
        if(rawModule.modules){
            forEachValue(rawModule.modules,(rawChildModule,key)=>{
                this.register(rawChildModule,path.concat(key));
            })
        }
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