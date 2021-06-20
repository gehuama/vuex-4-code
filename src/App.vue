<template>
  <!-- <div>这是计数器：{{count}}</div>
  <div>这是double：{{double}}</div>
  <button @click="$store.state.count++">错误修改</button>
  <button @click="add">同步修改</button>
  <button @click="asyncAdd">异步修改</button> -->
  <!--测试a是否可以拿到-->
  <!-- <div>{{$store.a}}</div>s -->
  <div>这是计数器：{{count}}</div>
  <!-- <div>这是double：{{double}}</div>-->
  <button @click="$store.state.count++">错误修改</button>
  <!-- <button @click="add">同步修改</button>
  <button @click="asyncAdd">异步修改</button>  -->
</template>

<script>
import {computed} from 'vue';
import {useStore} from "@/vuex";
export default {
  name: 'App',
  setup(){
    const store = useStore();

    const add = ()=>{
      // store.commit('add', 1)
    };
    const asyncAdd = ()=>{
      // store.dispatch('asyncAdd', 1)
    };
    console.log(store);
    return{
      count: computed(()=>
        store.state.count
      ),
      double: computed(()=>store.getters.double),
      add,
      asyncAdd
    }
  }
}
</script>

<style>

</style>
