// 是滚动元素
import {getStyle} from "@/utils/style";

export const isScroll = (el: HTMLElement, isVertical?: boolean) => {
    // 读取对象的属性 isVertical转为字符串后作为 待选项的key
    const key = ({
        undefined: 'overflow',
        true: 'overflow-y',
        false: 'overflow-x'
    } as const)[String(isVertical)]!
    // 获取el的 对应的style值
    const overflow = getStyle(el, key)
    return ['scroll','auto','overlay'].some((s)=> overflow.includes(s))
}
// 获取到滚动的元素
export const getContainerScroll = (el: HTMLElement, isVertical?: boolean): Window | HTMLElement | undefined => {
    let parent: HTMLElement = el
    // debugger
    while(parent){
        // 如果滚动的元素是document元素 直接返回window 否则返回parent
        if ([window, document, document.documentElement].includes(parent)){
            return window
        }
        if (isScroll(parent,isVertical)) return parent
        parent = parent.parentNode as HTMLElement
    }
    return parent
}
