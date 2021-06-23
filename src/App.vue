<template>
  <!-- <div>这是计数器：{{count}}</div>
  <div>这是double：{{double}}</div>
  <button @click="$store.state.count++">错误修改</button>
  <button @click="add">同步修改</button>
  <button @click="asyncAdd">异步修改</button> -->
  <!--测试a是否可以拿到-->
  <!-- <div>{{$store.a}}</div>s -->
  <div>这是计数器：{{count}}</div>
  <div>这是double：{{double}}  {{$store.getters.double}} </div>
  <button @click="$store.state.count++">错误修改</button>
  <button @click="add">同步修改</button>
  <button @click="asyncAdd">异步修改</button> 
  <div>a 模块：{{aCount}}</div>
  <div>b 模块：{{bCount}}</div>
  <div>c 模块：{{cCount}}</div>
  <button @click="aAdd">a同步修改</button>
  <button @click="bAdd">b同步修改</button> 
  <button @click="cAdd">c同步修改</button> 
</template>

<script>
import {computed} from 'vue';
import {useStore} from "@/vuex";
export default {
  name: 'App',
  setup(){
    const store = useStore();

    const add = ()=>{
      store.commit('add', 1)
    };
    const asyncAdd = ()=>{
      store.dispatch('asyncAdd', 1).then(()=>{
        alert("ok")
      })
    };
    console.log(store);
    const aAdd = ()=>{
      store.commit('aCount/add', 1)
    };
    const bAdd = ()=>{
      store.commit('bCount/add', 1)
    };
    const cAdd = ()=>{
      store.commit('aCount/cCount/add', 1)
    };
    return{
      count: computed(()=>store.state.count),
      double: computed(()=>store.getters.double),
      aCount: computed(()=>store.state.aCount.count),
      bCount: computed(()=>store.state.bCount.count),
      cCount: computed(()=>store.state.aCount.cCount.count),
      add,
      asyncAdd,
      aAdd,
      bAdd,
      cAdd
    }
  }
}
</script>

<style>

</style>
