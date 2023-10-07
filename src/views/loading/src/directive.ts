/**
 * 1. 定位整个遮罩在指令的el上，加上一个loading动画
 */
import type {DirectiveBinding, ObjectDirective, UnwrapRef} from "vue";
import type {LoadingOptions} from "@/views/loading/src/types";
import {hyphenate, isObject, isString} from "@vue/shared";
import { ref} from "vue";
import {Loading} from'@/views/loading/src/service'

/**
 * 每一个 Symbol 值都是不相等的，用于对象的属性名，就能保证不会出现同名的属性。
 * 这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖
 */
const INSTANCE_KEY = Symbol('ElLoading')

// loading 绑定值的类型
export type LoadingBinding = boolean | UnwrapRef<LoadingOptions>

// loading 指令绑定元素的类，多加上了 ElLoading这个属性的存在
export interface ElementLoading extends HTMLElement {
    [INSTANCE_KEY]?: {
        // instance: LoadingInstance
        options: LoadingOptions
    }
}


// 生成loading动画元素
const createInstance = (el: ElementLoading, binding: DirectiveBinding<LoadingBinding>) => {
    console.log(el, '这里需要创建 loading动画的元素')
    // 是制定绑定的vue实例
    const vm = binding.instance
    // 这里是一个箭头函数 返回值的类型根据 k 匹配到LoadingOptions 中属性的类型
    const getBindingProp = <K extends keyof LoadingOptions>(key: K): LoadingOptions[K] => isObject(binding.value) ? binding.value[key] : undefined

    // 处理获取到值
    const resolveExpression = (key: any) => {
        // 如果是字符串，并且vm上面有 就返回ref(true) 否则就直接返回 传入的数据
        const data = (isString(key) && vm?.[key]) || key
        if (data) return ref(data)
        else return data
    }
    // 获取绑定指令上面的dom元素属性 注： hyphenate 用字符链接
    const getProp = <K extends keyof LoadingOptions>(name: K) => {
        console.log('hyphenate 用字符链接', hyphenate(name))
        // 如果能在binding上获取 prop的值，就使用 不能就直接在 el上获取对应属性值
        return resolveExpression(getBindingProp(name) || el.getAttribute(`element-loading-${hyphenate(name)}`))
    }

    // 判断是否是全屏loading 双问号?? 当前面是 null 或者 undefined的时候 才会返回后面，不然返回前面 可以用于处理前面等于0被js判定为假值的情况
    const fullscreen = getBindingProp('fullscreen') ?? binding.modifiers.fullscreen

    const options: LoadingOptions = {
        fullscreen
    }
    el[INSTANCE_KEY] = {
        options,
        instance: Loading(options)
    }

}

// const createInstance =  (el:ElementLoading,binding:DirectiveBinding<LoadingBinding>)=>{
//
//     // 在el下面插入一一个loading
//     const loadingDiv = document.createElement('div')
//     // 设置全部定位
//     loadingDiv.className = 'el-loading-mask'
//     // 把元素插入到
//     console.log('el',el)
//     el.style.position = 'relative'
//     el.appendChild(loadingDiv)
// }

const vLoading: ObjectDirective<ElementLoading> = {
    mounted(el, binding) {
        // value 是绑定的值
        const {value} = binding
        if (value) {
            createInstance(el, binding)
        }
        console.log('loading value', value)
    },
    updated() {
    },
    beforeUnmount() {
        // 卸载前做一些清除工作
    }
}

export default vLoading
