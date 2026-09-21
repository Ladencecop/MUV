/**
 * 《阿斯缇娅》状态栏的展示常量。
 *
 * 这里只放「全卡字面必须一致」或「界面展示用」的映射，不放业务判定：
 * 变量读写在 store.ts，阈值判定在 App.vue 与各组件内联。
 */

/** 关系阶段名。字面必须与 schema.ts、EJS 条件、变量更新规则完全一致，勿改字 */
export const STAGE_NAMES = ['陌生期', '熟悉期', '依赖期', '深爱期'] as const;

/**
 * 阶段色阶后缀：冷铁 → 灰铜 → 锈金 → 亮金。明度本身就是解冻进度。
 *
 * 存的是**类名后缀**而不是 CSS 字符串 —— 组件一律 `stage-${后缀}` 上色，
 * 避免模板里出现 `var(--…)` 字符串触发 Vue 的同名简写解析。
 */
export const STAGE_KEYS = ['iron', 'brass', 'rustgold', 'gold'] as const;

/**
 * 阶段阶梯。`gate` 抄自 schema.ts 与变量更新规则.yaml 的推进条件，只作展示，
 * 不参与任何前端判定——阶段推进与否由 AI 依剧情决定，界面不许自己算。
 */
export const STAGE_GATES = [
  { name: '陌生期', gate: '故事起点', note: '把你当需要评估的对象，先观察后开口。' },
  { name: '熟悉期', gate: '好感度 ≥ 20 · 信任度 ≥ 15', note: '把你算进「需要负责的对象」里。' },
  { name: '依赖期', gate: '好感度 ≥ 50 · 信任度 ≥ 40', note: '主动开口要过至少一次：电、陪伴或同行。' },
  { name: '深爱期', gate: '好感度 ≥ 80 · 信任度 ≥ 70', note: '已发生明确的关系确认。' },
] as const;

/** 身体边界三档。字面与 schema.ts 的 亲密.状态 一致 */
export const INTIMACY_STATES = ['尚未越界', '已有身体接触', '亲密关系'] as const;

/** 身体边界的可读释义，用在界面上替掉第三个重复刻度 */
export const INTIMACY_BOUNDARIES: Record<string, string> = {
  尚未越界: '只允许必要的接触。递东西时她会避开手指，护理前后都要先问一句。',
  已有身体接触: '可以抱，可以靠，充电时手可以留在她肩上。她不会推开，也不会承认自己没推。',
  亲密关系: '已经没有需要问的了。她仍然嘴硬，但身体不再设防。',
};

/**
 * 誓约两档。字面与 schema.ts 的 阿斯缇娅.誓约.状态 一致 —— 只有两档，
 * 因为誓约在她的理解里是一次性的事：没戴上，和戴上了。
 */
export const OATH_STATES = ['未缔结', '已缔结'] as const;

/** 誓约状态的可读释义，显示在素戒旁边 */
export const OATH_NOTES: Record<string, string> = {
  未缔结: '素戒还空着。她会认出戒指是什么，然后先问你一句。',
  已缔结: '你的标识刻在她的底层代码里。这件事不可逆，也不可复制。',
};

/** 生理状态。字面与 schema.ts 的 身体.生理状态 一致（怀孕只写在子宫下） */
export const BODY_STATES = ['常态', '休眠', '性爱', '力竭'] as const;
/** 生理状态的释义，界面上给出一句可读说明 */
export const BODY_STATE_NOTES: Record<string, string> = {
  常态: '清醒，一切正常。',
  休眠: '睡眠中，或电量归零后的停机保护。此时她不省人事。',
  性爱: '正在性事中，或处在余韵里。机体温度升高，反应变敏感。',
  力竭: '电量或机体损耗触发的虚弱。动作与反应明显迟缓。',
};

/** 子宫状态四档。字面与 schema.ts 一致，逐级不可跳 */
export const WOMB_STATES = ['未激活', '待着床', '已着床', '孕育中'] as const;

/** 着床深度。字面与 schema.ts 一致 */
export const DEPTHS = ['无', '浅', '中', '深'] as const;

/** 四个可解锁模块。字面与 schema.ts 的 已解锁设施 说明一致 */
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
  { min: 15, label: '反应变钝，会自己找活干来掩饰想充电' },
  { min: 0, label: '力竭：动作与反应明显迟缓' },
] as const;

/** 机体损耗分档。60 是变量更新规则里的维护需求触发线 */
export const WEAR_BANDS = [
  { min: 60, label: '出现可听的机械声，握力下降，她开始回避战斗' },
  { min: 30, label: '一侧肩膀的动作幅度变小' },
  { min: 0, label: '动作无声，外壳没有痕迹' },
] as const;

/** 能源储备分档。15 是「给她充电就得停掉净水或温室」的取舍线 */
export const ENERGY_BANDS = [
  { min: 50, label: '宽裕，可支持改装与长时间外出' },
  { min: 15, label: '能维持净水与温室的日常运转' },
  { min: 0, label: '只够基础照明与她的最低供能' },
] as const;

/** 警戒阈值，与 cards/阿斯缇娅/ui-design.md 一致 */
export const THRESHOLDS = {
  /** 电量低于此值转红灯、指示点呼吸 */
  power: 30,
  /** 机体损耗高于此值转红灯 */
  wear: 60,
  /** 能源储备低于此值转红灯 */
  energy: 15,
  /** 辐射读数高于此值转红灯 */
  radiation: 50,
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
