/**
 * 本地数值工具。
 *
 * 不依赖全局 `_`：酒馆助手在不同版本/环境下注入的 lodash 可能不带 `clamp`
 * （lodash-es 或裁剪版），直接调用 `clamp()` 会在组件 setup 阶段抛
 * `TypeError: _.clamp is not a function`，导致整个界面渲染成空注释。
 */
export function clamp(value: number, min: number, max: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
}

/** 四舍五入后 clamp，用于关系状态这类必须为整数的档位变量 */
export function clampInt(value: number, min: number, max: number): number {
  return clamp(Math.round(Number(value)), min, max);
}
