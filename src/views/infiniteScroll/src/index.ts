/**
 * 1. 获取当前绑定的dom元素
 * 2. 获取三个高度 scrollTop,scrollHeight,clientHeight
 * 3. 监听dom元素的滚动事件
 * 3. scrollTop + clientHeight >= scrollHeight 执行回调函数
 */
// 这里 lodash 是一个js的工具库，lodash-unified 是对lodash-es 做了兼容CJS格式(http://yiming_chang.gitee.io/pure-admin-doc/pages/FAQ/)
import { throttle } from 'lodash-unified'
const VInfiniteScroll = {
    created() {
        console.log('指令测试')
    },
    mounted(el: HTMLElement, binding:{value:()=>void}) {
        console.log('---mounted---开始')
        console.log(el,binding)
        // const {scrollTop,scrollHeight,clientHeight} = el
        const { value:callback}=binding

        el.addEventListener('scroll',function (event){
            const {scrollTop,scrollHeight,clientHeight} = el
            if (scrollTop + clientHeight >= scrollHeight){
                callback && callback()
            }
            console.log(scrollTop,scrollHeight,clientHeight)
        })

        // if (
        console.log('---mounted---end')
    }
}
export default VInfiniteScroll
