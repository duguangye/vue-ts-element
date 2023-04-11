/**
 * 主要功能：在滚动到边缘的时候调用回掉函数：指令绑定的时，给滚动容器绑定 onScroll事件，卸载的时候清除事件侦听
 * props实现：
 * - 1。 disabled 判断disabled为true
 * - 2。 distance 设置判断的距离
 * - 3。 immediate 是否在初始是执行回掉函数以充满容器。：给滚动容易添加上mutationObserver监听 dom改变，如果容器充满 清除observer 否则继续执行checkFull
 * - 4。 delay 防抖的时间间隔
 * 关键点：
 * 1。寻找滚动容器，找到元素overflow的值，没有继续向上查找，查找到顶部使用window
 * 2。执行回调函数 使this指向绑定 指令的组件实例
 * 3。判断是否达到临界值，绑定元素 == 滚动元素，滚动距离+元素高度>整体高度，绑定元素 != 滚动元素， 容器的滚动高度+容器的元素高度> 绑定元素距离顶部的offsetTop+绑定元素外边框clientHeight
 */
// 这里 lodash 是一个js的工具库，lodash-unified 是对lodash-es 做了兼容CJS格式(http://yiming_chang.gitee.io/pure-admin-doc/pages/FAQ/)
// import {throttle} from 'lodash-unified'
import {isFunction} from "@vue/shared";
import {throwError} from "@/utils/error";
import {throttle} from 'lodash-unified';
import type {ComponentPublicInstance, ObjectDirective} from "vue";
import {getContainerScroll} from "@/utils/scroll";
import {nextTick} from "vue";
import {getOffsetTopDistance} from "@/utils/position";
// 参数的默认常量
const SCOPE = 'ElInfiniteScroll' // 当前组件
// 延迟
const DEFAULT_DELAY = 200
//
const CHECK_INTERVAL = 50
// 默认 的距离
const DEFAULT_DISTANCE = 0
// 指令组件可能会有的参数
const attributes = {
    delay: {
        type: Number,
        default: DEFAULT_DELAY
    },
    distance: {
        type: Number,
        default: DEFAULT_DISTANCE
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    immediate: {
        type: Boolean,
        default: false,
    }
}

// 使用参考 关于K in keyof Attrs【https://zhuanlan.zhihu.com/p/384172236】
type Attrs = typeof attributes
type ScrollOptions = { [K in keyof Attrs]: Attrs[K]['default'] }
type InfiniteScrollCallback = () => void
type InfiniteScrollEl = HTMLElement & {
    [SCOPE]: {
        container: HTMLElement | Window // scroll容器
        containerEl: HTMLElement
        instance: ComponentPublicInstance,
        callback: InfiniteScrollCallback,
        onScroll: () => void,
        observer?: MutationObserver,
        lastScrollTop: number
    }
}

// type ScrollOptions = { [K in keyof Attrs]: Attrs[K]['default'] }
// 获取指令绑定dom的其他参数
const getScrollOptions = (el: HTMLElement, instance: ComponentPublicInstance): ScrollOptions => {
    // 1.需要操作的dom
    // const result  =
    return Object.entries(attributes).reduce((acm, [name, option]) => {
        // console.log(acm, name, option)
        // type 是 option的类型函数
        const {type, default: defaultName} = option
        const attrVal = el.getAttribute(`infinite-scroll-${name}`)
        // 如果元素属性有值 就使用 ，没有值就是用默认值  todo 不理解这里为什么要使用instance 里面的
        let value = instance[attrVal] ?? attrVal ?? defaultName
        value = value === 'false' ? false : value
        value = type(value)
        value = Number.isNaN(value) ? defaultName : value
        acm[name] = value
        return acm
        // console.log('获取到attrVal',name,attrVal)
    }, {} as ScrollOptions)
}

// 抽离出一个处理scroll的函数 在updated更新的时候调用
const handleScroll = (el: InfiniteScrollEl, callback: Function) => {
    console.log('handle scroll is running')
    const {container, containerEl, instance, observer, lastScrollTop} = el[SCOPE]
    const {disabled, distance} = getScrollOptions(el, instance)
    const {scrollTop, scrollHeight, clientHeight} = containerEl // 这里使用找到的滚动容器
    el[SCOPE].lastScrollTop = scrollTop // 更新滚动高度
    const delta = scrollTop - lastScrollTop // 现在的滑动高度小于以前的滑动高度的时候不处罚
    // 如果在初次充满有observer 都不继续执行
    if (disabled || observer || delta < 0) return

    let shouldTrigger = false
    if (container === el) {
        // distance + scrollTop + clientHeight 接近 scroll高度 触发
        shouldTrigger = scrollHeight <= distance + scrollTop + clientHeight
    } else {
        // clientTop  border.top(上边框的宽度) 一个元素顶部边框的宽度
        const {clientTop, scrollHeight: height} = el
        const offsetTop = getOffsetTopDistance(el, containerEl)
        // distance + scrollTop + clientHeight 接近  el本身的高度+el的clientTop + el与滚动容器的距离
        shouldTrigger = offsetTop + clientTop + height <= distance + scrollTop + clientHeight
        // if (shouldTrigger){
        //     console.table({
        //         clientTop,
        //         scrollHeight: height,
        //         offsetTop
        //     })
        //     console.table({
        //         scrollTop, scrollHeight, clientHeight
        //     })
        // }
    }
    if (shouldTrigger) {
        callback.call(instance)
    }
}

// 判断内容是否充满dom  充满就停止
function checkFull(el: InfiniteScrollEl, callback: Function, key = 8) {
    const {containerEl, instance} = el[SCOPE]
    const {disabled} = getScrollOptions(el, instance)
    // 如果为 disabled 或 滚动容器高度为0 就返回
    if (disabled || containerEl.clientHeight === 0) return

    // 如果元素已经充满滚动容器 就清除 observer 否则就调用回掉函数
    if (containerEl.scrollHeight <= containerEl.clientHeight) {
        // 让this 指向当前组件的实例
        callback.call(instance)
    } else {
        destroyObserver(el)
    }
}

const destroyObserver = (el: InfiniteScrollEl) => {
    const {observer} = el[SCOPE]
    if (observer) {
        observer.disconnect()
        delete el[SCOPE].observer
    }
}

const VInfiniteScroll: ObjectDirective<InfiniteScrollEl, InfiniteScrollCallback> = {
    // mounted 只会在挂载的时候触发一次
    async mounted(el, binding) {
        // instance 使用改指令的组件实例
        const {value: callback, instance} = binding
        console.warn('this is instance', instance)
        await nextTick()
        // 1. 如果value 不是函数 抛出错误提示
        if (!isFunction(callback)) {
            return throwError(SCOPE, "'v-infinite-scroll' binding value must a function")
        }
        // 如果在这里写 那么disabled, distance,delay 这些值将不会更新 infinite-scroll-disabled 的值
        const {delay, immediate} = getScrollOptions(el, instance)
        const onScroll = throttle(handleScroll.bind(null, el, callback), delay)
        // el 是指令绑定的元素 container 触发scroll事件的元素
        const container = getContainerScroll(el, true)
        const containerEl = container === window ? document.documentElement : (container as HTMLElement)
        if (!container) return

        el[SCOPE] = {
            instance,
            container,
            containerEl,
            callback,
            onScroll,
            lastScrollTop: containerEl.scrollTop
        }

        // 是否是立即执行
        if (immediate) {
            // MutationObserver 它会在指定dom发生变化的时候被调用
            const observer = new MutationObserver(throttle(checkFull.bind(null, el, callback), CHECK_INTERVAL))
            el[SCOPE].observer = observer
            // 设置需要监听的dom元素 第二个参数配置选项
            observer.observe(el, {childList: true, subtree: true})
            checkFull(el, callback, 9)
        }
        container.addEventListener('scroll', onScroll)

    },
    // dom更新的时候
    async updated(el, c) {
        console.log('指令updated')
        if (!el[SCOPE]) {
            // 如果el没有SCOPE属性就等待dom更新后
            await nextTick()
        } else {
            const {containerEl, callback, observer} = el[SCOPE]
            // 如果滚动容器有高度，并且observer还存在 就调用checkFull 使内容充满容器
            if (containerEl.clientHeight && observer) {
                checkFull(el, callback)
            }
        }
    },
    // dom元素卸载时候清除监听事件与observer
    unmounted(el) {
        const {container, onScroll} = el[SCOPE]
        // addEventListener 同一个事件能绑定多个 事件处理函数
        container?.removeEventListener('scroll', onScroll)
        destroyObserver(el)
    }
}
export default VInfiniteScroll
