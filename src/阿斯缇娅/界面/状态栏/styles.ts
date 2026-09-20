/**
 * 主题令牌：给颜色起名字，让组件只传名字、不传 CSS 字符串。
 *
 * 为什么要这一层：Vue 3.4+ 支持「同名简写」`v-bind()`，而模板内联 `:style` 里一旦出现
 * `'var(--c-xxx)'` 这样的字符串，编译器可能把它误判成同名简写而报
 * `v-bind is missing expression`。所以组件一律通过语义类名上色，内联样式只留宽度百分比。
 */

/** 色相令牌：对应 global.css 里的 --c-* 变量 */
export const TONES = ['power', 'amber', 'rust', 'warm', 'intimacy', 'danger', 'gold', 'muted'] as const;
export type Tone = (typeof TONES)[number];

/** 生成一个读数条的类名串 */
export function toneClass(prefix: string, tone: Tone): string {
  return `${prefix}-${tone}`;
}

/** 进度条宽度：夹到 0~100 并取整，只用于 width 百分比 */
export function widthPct(value: unknown): string {
  const n = _.clamp(Math.round(Number(value) || 0), 0, 100);
  return `${n}%`;
}
