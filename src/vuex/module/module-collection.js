import {forEachValue} from "../utils"
import Module from "./module"
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
        console.log(this.root);
    }
}