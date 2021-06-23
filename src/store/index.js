import { createStore } from '@/vuex' // new store() 函数式API

export default createStore({
  state: { // 组件中的data
    count: 0
  },
  getters: { // 技术属性 vuex4 他并没有实现计算属性的功能
    double(state) {
      return state.count * 2
    }
  },
  mutations: { // 可以更改状态 必须是同步更改的
    add(state, payload) {
      state.count += payload
    }
  },
  actions: { // 可以调用其他action，或者调用mutations
    asyncAdd({ commit }, payload) {
      return new Promise((resolve, reject) => {
        console.log(resolve,reject)
        setTimeout(() => {
          commit("add", payload)
          resolve();
        }, 1000)
      })
      // setTimeout(()=>{
      //   commit("add",payload)
      // },1000)
    }
  },
  modules: { // 子模块 实现逻辑拆分
    aCount: {
      namespaced: true,
      state: { count: 1 },
      mutations: { // 可以更改状态 必须是同步更改的
        add(state, payload) {
          state.count += payload
        }
      },
      modules: {
        cCount: {
          namespaced: true,
          state: { count: 1 },
          mutations: { // 可以更改状态 必须是同步更改的
            add(state, payload) {
              state.count += payload
            }
          }
        },
      }
    },
    bCount: {
      namespaced: true,
      state: { count: 2 },
      mutations: { // 可以更改状态 必须是同步更改的
        add(state, payload) {
          state.count += payload
        }
      },
    }
  }
})

// 严格模式
// dispatch(action) => commit(mutations) => 修改状态

// 又一个功能 在A页面需要调用一个接口 影响的可能是a数据 B页面也需要调用同一个接口 改的是b数据