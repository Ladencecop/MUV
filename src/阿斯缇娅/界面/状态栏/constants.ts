/**
 * 《阿斯缇娅》状态栏的展示常量。
 *
 * 这里只放「全卡字面必须一致」或「界面展示用」的映射，不放业务判定：
 * 变量读写在 store.ts，阈值判定在 App.vue 与各组件内联。
 */

/**
 * 关系阶段名：陌生期 / 熟悉期 / 依赖期 / 深爱期。
 *
 * **字面必须与 schema.ts、EJS 条件、变量更新规则完全一致，勿改字。**
 * `阿斯缇娅.关系阶段` 是字符串枚举，世界书里靠 === 比较它做段落控制。
 */
export const STAGE_NAMES = ['陌生期', '熟悉期', '依赖期', '深爱期'] as const;

/** 阶段色阶：暗铁 → 冷灰 → 琥珀 → 亮金。明度本身就是解冻进度 */
export const STAGE_COLORS = [
  'var(--c-stage-0)',
  'var(--c-stage-1)',
  'var(--c-stage-2)',
  'var(--c-stage-3)',
] as const;

/** 阶段文字色阶。深色版在近黑底上当文字读不清，文字一律走这一组 */
export const STAGE_TEXT_COLORS = [
  'var(--c-stage-0-text)',
  'var(--c-stage-1-text)',
  'var(--c-stage-2-text)',
  'var(--c-stage-3-text)',
] as const;

/**
 * 阶段阶梯（展开区展示用）。
 *
 * `gate` 抄自 schema.ts 与变量更新规则.yaml 的推进条件，只作展示，
 * **不参与任何前端判定** —— 阶段推进与否由 AI 依剧情决定，界面不许自己算。
 */
export const STAGE_GATES = [
  { name: '陌生期', gate: '故事起点', note: '把你当需要评估的对象，先观察后开口。' },
  { name: '熟悉期', gate: '好感度 ≥ 20 · 信任度 ≥ 15', note: '把你算进「需要负责的对象」里。' },
  { name: '依赖期', gate: '好感度 ≥ 50 · 信任度 ≥ 40', note: '主动开口要过至少一次：电、陪伴或同行。' },
  { name: '深爱期', gate: '好感度 ≥ 80 · 信任度 ≥ 70', note: '已发生明确的关系确认。' },
] as const;

/** 亲密状态三档。字面与 schema.ts 一致 */
export const INTIMACY_STATES = ['尚未越界', '已有身体接触', '亲密关系'] as const;

/** 亲密状态的门槛说明，抄自 schema.ts，只作展示 */
export const INTIMACY_GATES: Record<string, string> = {
  尚未越界: '没有任何超过必要的身体接触',
  已有身体接触: '需亲密度 ≥ 20',
  亲密关系: '需亲密度 ≥ 50',
};

/** 生理状态。字面与 schema.ts 一致 */
export const BODY_STATES = ['常态', '力竭', '发热', '受孕中', '孕期'] as const;

/** 子宫状态四档。字面与 schema.ts 一致，逐级不可跳 */
export const WOMB_STATES = ['未激活', '待着床', '已着床', '孕育中'] as const;

/** 着床深度。字面与 schema.ts 一致 */
export const DEPTHS = ['无', '浅', '中', '深'] as const;

/** 四个可解锁模块。字面与 schema.ts 的「已解锁设施」说明一致 */
export const FACILITIES = ['净水', '温室', '工坊', '医疗舱'] as const;

/** 当前区域，顺序与 schema.ts 的枚举一致 */
export const REGIONS = ['灰烬带', '锈流带', '苍白区', '中转站', '基地车内部'] as const;

/** 各区域的常态辐射基数，抄自变量更新规则.yaml，只作读数分档展示 */
export const RADIATION_BANDS = [
  { max: 20, label: '可长时间停留', color: 'var(--c-power-text)' },
  { max: 50, label: '需要限时', color: 'var(--c-amber-text)' },
  { max: 100, label: '必须防护或尽快撤离', color: 'var(--c-danger-text)' },
] as const;

/** 电量分档。30 是 schema.ts 写死的阈值，低于它她会明显变钝 */
export const POWER_BANDS = [
  { min: 30, label: '行动与情绪稳定' },
  { min: 0, label: '动作变慢、反应变钝、更倔' },
] as const;

/** 机体损耗分档。60 是变量更新规则里的维护需求触发线 */
export const WEAR_BANDS = [
  { min: 60, label: '有可听的机械声，她开始回避战斗' },
  { min: 30, label: '一侧肩膀的动作幅度变小' },
  { min: 0, label: '动作无声，外壳没有痕迹' },
] as const;

/** 能源储备分档。15 是「给她充电就得停掉净水或温室」的取舍线 */
export const ENERGY_BANDS = [
  { min: 50, label: '宽裕，可支持改装与长时间外出' },
  { min: 15, label: '能维持净水与温室的日常运转' },
  { min: 0, label: '只够基础照明与她的最低供能' },
] as const;

/** 警戒阈值，与 design-spec.md 的 UI 设计段一致 */
export const THRESHOLDS = {
  /** 电量低于此值转锈红，指示点呼吸 */
  power: 30,
  /** 机体损耗高于此值转锈红 */
  wear: 60,
  /** 能源储备低于此值转锈红 */
  energy: 15,
} as const;

/** 取分档标签 */
export function bandOf<T extends { min: number; label: string }>(bands: readonly T[], value: number): T {
  return bands.find((b) => value >= b.min) ?? bands[bands.length - 1];
}

/** 辐射读数分档 */
export function radiationBand(value: number) {
  return RADIATION_BANDS.find((b) => value <= b.max) ?? RADIATION_BANDS[RADIATION_BANDS.length - 1];
}

/** 夹取并取整，前端展示用（不写回变量） */
export function pct(value: unknown): number {
  return _.clamp(Math.round(Number(value) || 0), 0, 100);
}
