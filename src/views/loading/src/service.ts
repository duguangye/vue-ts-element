import type {LoadingOptions, LoadingOptionsResolved} from "@/views/loading/src/types";
import type {LoadingInstance} from "@/views/loading/src/loading";
import {isString} from "@vue/shared";
import {createLoadingComponent} from "@/views/loading/src/loading";

// 全屏的loading 只有一个实例
let fullscreenInstance: LoadingInstance | undefined = undefined
// 根据loading options 创建并返回 loading实例
export const Loading = function (options: LoadingOptions = {}): LoadingInstance {
  const resolved = resolveOptions(options)
  if (resolved.fullscreen && fullscreenInstance) {
    return fullscreenInstance
  }
  const instance = createLoadingComponent({
    ...resolved,
    closed: () => {
      // 这个不知道先放上
    }
  })
  return instance
}

// 处理参数
const resolveOptions = (options: LoadingOptions): LoadingOptionsResolved => {
  let target: HTMLElement
  if (isString(options.target)) {
    target = document.querySelector<HTMLElement>(options.target) ?? document.body
  } else {
    target = options.target || document.body
  }
  return {
    parent: target === document.body || options.body ? document.body : target,
    background: options.background || '',
    svg: options.svg || '',
    svgViewBox: options.svgViewBox || '',
    spinner: options.spinner || false,
    text: options.text || '',
    fullscreen: target === document.body && (options.fullscreen ?? true),
    lock: options.lock ?? false,
    customClass: options.customClass || '',
    visible: options.visible ?? true,
    target
  }
}
