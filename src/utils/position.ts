//获得当前元素距离最外层元素的距离
export const getOffsetTop = (el:HTMLElement)=>{
    let offset = 0
    let parent = el
    while(parent){
        offset += parent.offsetTop //OffsetTop 元素到offsetParent顶部的距离
        parent = parent.offsetParent as HTMLElement
    }
    return offset
}
// 获取 el 与 containerEl 的顶部距离
export const getOffsetTopDistance = (el:HTMLElement,containerEl:HTMLElement)=>{
    return Math.abs(getOffsetTop(el) - getOffsetTop(containerEl))
}
