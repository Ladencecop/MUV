/** 把任意输入收敛到 [min, max] 的有限数；非法输入返回 min。 */
export function clamp(value: unknown, min: number, max: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : min;
}

/** 0~100 的刻度值，直接当百分比宽度用。 */
export function percent(value: unknown): number {
  return clamp(value, 0, 100);
}

/**
 * 拆「世界.当前时间」。
 *
 * 格式由 schema 约束为 `YYYY/MM/DD-HH:MM`，这里只按第一个 `-` 切成日期与时刻；
 * 格式跑偏时退化为整串当日期，不抛错、不改写原文。
 */
export function split_time(raw: unknown): { date: string; time: string } {
  const text = String(raw ?? '').trim();
  const cut = text.indexOf('-');
  if (cut < 0) {
    return { date: text, time: '' };
  }
  return { date: text.slice(0, cut), time: text.slice(cut + 1) };
}

/**
 * 把「共梦.醒后留痕」拆成物证清单。
 *
 * 只在明确的分隔符（`；` `;` 换行）处拆条，**绝不改写、不截断、不猜测原文** ——
 * 这是全卡唯一会被第三方看见的东西，展示层没有资格精简它。
 * 没有分隔符时返回单条，等价于原文。
 */
export function split_evidence(raw: unknown): string[] {
  return String(raw ?? '')
    .split(/[；;\n]+/)
    .map(line => line.trim())
    .filter(Boolean);
}
