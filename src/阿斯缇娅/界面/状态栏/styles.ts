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

/**
 * 把传入值收敛成合法令牌。
 *
 * 存在的理由：色相类名是拼出来的（`fill-${tone}`），一旦传入非法值（例如误写成
 * `var(--c-power)`），拼出的类名不存在，浏览器只会安静地不画背景色 —— 不报错、不留痕，
 * 极难发现。这里做一次兜底，非法值退回 `muted` 并在控制台留一条 warn。
 */
export function resolveTone(tone: unknown, fallback: Tone = 'muted'): Tone {
  const t = String(tone ?? '');
  if ((TONES as readonly string[]).includes(t)) return t as Tone;
  console.warn(`[阿斯缇娅 状态栏] 非法色相令牌 "${t}"，已回退为 "${fallback}"`);
  return fallback;
}

/** 生成一个读数条的类名串 */
export function toneClass(prefix: string, tone: Tone): string {
  return `${prefix}-${tone}`;
}

/** 进度条宽度：夹到 0~100 并取整，只用于 width 百分比 */
export function widthPct(value: unknown): string {
  const n = _.clamp(Math.round(Number(value) || 0), 0, 100);
  return `${n}%`;
}
