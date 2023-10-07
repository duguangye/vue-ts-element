import type {MaybeRef} from '@vueuse/core'
// loading 组件需要用到的值 js版本
export type LoadingOptionsResolved = {
    parent: LoadingParentElement,
    background: MaybeRef<string>,
    svg: MaybeRef<string>,
    svgViewBox: MaybeRef<string>,
    spinner: MaybeRef<string>,
    fullscreen:boolean,
    target:HTMLElement,
    text:MaybeRef<string>,
    customClass: MaybeRef<string>,
    lock: boolean,
    visible: boolean
}

//
export type LoadingOptions = Partial<Omit<LoadingOptionsResolved, 'parent' | 'target'> & { target: HTMLElement | string, body: boolean }>

export interface LoadingParentElement extends HTMLElement {
    vLoadingAddClassList?: () => void
}
