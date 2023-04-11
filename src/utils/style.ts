import type {CSSProperties} from "vue";
import {camelize} from "@/utils/string";

// 获取style属性的值
export const getStyle = (
    element: HTMLElement,
    styleName: keyof CSSProperties
): string => {
    // debugger
    // 转为驼峰
    let key = camelize(styleName)
    // float 是 js的保留字段
    if (key === 'float') key = 'cssFloat'
    try {
        // 这里为什么元素的style都是空的
        const style = (element.style as any)[key]
        if (style) return style
        // document.defaultView 返回当前document关联的window对象
        // getComputedStyle 返回任何基本计算后报告元素的所有 CSS 属性的值 获取通过计算得到的style的值
        const computed: any = document.defaultView?.getComputedStyle(element, '')
        return computed ? computed[key] : ''
    } catch {
        return (element.style as any)[key]
    }
}
