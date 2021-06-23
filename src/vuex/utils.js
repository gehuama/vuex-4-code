// 循环对象
export function forEachValue(obj, fn) {
    Object.keys(obj).forEach(key => fn(obj[key], key));
}
  // forEachValue({a:1,b:2},function(value, key){
  //     console.log(value, key)
  // })
// 判断是不是promise
export function isPromise(val){
    return val && typeof val.then === 'function';
}