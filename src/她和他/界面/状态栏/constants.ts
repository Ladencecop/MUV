import type { Schema } from '../../schema';

/** 状态栏主体，固定为千羽一人。 */
export const SUBJECT_NAME = '千羽';

/** 关系阶段色阶：人格不变色，变的是关系身份的颜色。 */
export const STAGE_COLORS = [
  'var(--c-stage-0)',
  'var(--c-stage-1)',
  'var(--c-stage-2)',
  'var(--c-stage-3)',
  'var(--c-stage-4)',
] as const;

export interface StageRung {
  name: string;
  condition: string;
}

/**
 * 关系阶段阶梯。
 *
 * 索引即 千羽.关系阶段 的取值；schema 允许到 4，调色盘把 3 及以上统一按「多妻处境」处理，
 * 因此第 5 格与第 4 格内容一致，作为越界兜底。
 */
export const STAGE_LADDER: readonly StageRung[] = [
  { name: '半步情侣', condition: '起点。两人互知心意，谁都不肯先把那句话说出来' },
  { name: '夫妻式同居', condition: '两人真正开始以夫妻身份过日子' },
  { name: '说出真心话', condition: '那句「我喜欢你」出口' },
  { name: '多妻处境', condition: '一夫多妻规则实际启用，妻室名单增加成员' },
  { name: '多妻处境', condition: '一夫多妻规则实际启用，妻室名单增加成员' },
] as const;

/** 关系阶段的可显示上限（阶梯只画前四格）。 */
export const STAGE_DISPLAY_MAX = 3;

export interface LoyaltyBand {
  /** 区间下界（含） */
  min: number;
  /** 区间上界（含） */
  max: number;
  /** 条带宽度权重，按区间跨度取值 */
  weight: number;
  title: string;
  detail: string;
  /** 该档位的强调色变量 */
  color: string;
}

/**
 * 忠诚度四档接受范围。
 *
 * 数值本身不代表好坏：档位才是「她愿意接受到哪一步」的边界。
 * 色值只随档位下移而变得更刺眼，用于提示边界已经放开。
 */
export const LOYALTY_BANDS: readonly LoyaltyBand[] = [
  {
    min: 85,
    max: 100,
    weight: 16,
    title: '只接受你',
    detail: '对陌生人保持距离',
    color: 'var(--c-loyalty)',
  },
  {
    min: 70,
    max: 84,
    weight: 15,
    title: '第一档放开',
    detail: '接受与陌生人的口交、乳交、手交、素股',
    color: 'var(--c-warning)',
  },
  {
    min: 50,
    max: 69,
    weight: 20,
    title: '第二档放开',
    detail: '在前一档基础上追加与陌生人的戴套性交',
    color: 'var(--c-danger)',
  },
  {
    min: 0,
    max: 49,
    weight: 50,
    title: '第三档放开',
    detail: '在前两档基础上追加与陌生人的无套性交与肛交',
    color: 'var(--c-danger)',
  },
] as const;

/** 取当前忠诚度所在的档位。 */
export function loyalty_band_of(loyalty: number): LoyaltyBand {
  return LOYALTY_BANDS.find(band => loyalty >= band.min) ?? LOYALTY_BANDS[LOYALTY_BANDS.length - 1];
}

export interface PhaseMeta {
  key: Schema['千羽']['生理周期']['_生理期阶段'];
  /** 在 4 天一轮里的第几天 */
  day: number;
  color: string;
  note: string;
  /** 每 1ml 子宫内精液提供的怀孕系数 */
  coefficient: string;
}

/** 生理周期四天一轮：卵泡期 → 排卵期 → 黄体期 → 月经期。 */
export const PHASES: readonly PhaseMeta[] = [
  {
    key: '卵泡期',
    day: 1,
    color: 'var(--c-phase-follicular)',
    note: '精力充沛，性欲较低，身体各项机能处在最佳状态。',
    coefficient: '2%',
  },
  {
    key: '排卵期',
    day: 2,
    color: 'var(--c-phase-ovulation)',
    note: '性欲基数与增速同时提高，极易发情，淫水分泌旺盛。',
    coefficient: '8%',
  },
  {
    key: '黄体期',
    day: 3,
    color: 'var(--c-phase-luteal)',
    note: '更容易疲惫，性欲极低，心情相对容易低落。',
    coefficient: '1%',
  },
  {
    key: '月经期',
    day: 4,
    color: 'var(--c-phase-menstrual)',
    note: '除流出月经外，情绪更易生气，也更黏人。',
    coefficient: '0',
  },
] as const;

/** 取生理期阶段的元数据；阶段值缺失时按卵泡期兜底。 */
export function phase_meta_of(phase: string): PhaseMeta {
  return PHASES.find(item => item.key === phase) ?? PHASES[0];
}

export interface DreamMeta {
  label: string;
  color: string;
  note: string;
}

/** 梦境选球：每次性交后重做一次，系数即时切换。 */
export const DREAMS: Record<Schema['千羽']['梦境选择'], DreamMeta> = {
  未经历: {
    label: '未经历',
    color: 'var(--c-text-muted)',
    note: '她还没有进过那个梦。系数按 1 比 1 结算。',
  },
  金色: {
    label: '金色球体',
    color: 'var(--c-dream-gold)',
    note: '忠诚度减少值减半、增加值翻倍。',
  },
  紫色: {
    label: '紫色球体',
    color: 'var(--c-dream-violet)',
    note: '忠诚度减少值翻倍、增加值减半。',
  },
};

export interface ExposureMeta {
  label: string;
  color: string;
}

/** 黑道身份的知情范围：只记录范围，不给原因。 */
export const EXPOSURES: Record<Schema['玩家']['黑道身份暴露'], ExposureMeta> = {
  未暴露: { label: '未暴露', color: 'var(--c-text-muted)' },
  千羽诸葛羽已知: { label: '千羽、诸葛羽已知', color: 'var(--c-warning)' },
  公开: { label: '已公开', color: 'var(--c-danger)' },
};

/** 一夫多妻制的领证硬上限。 */
export const SPOUSE_LIMIT = 3;

/** 性经验账本的条目定义，口径取自变量更新规则。 */
export const EXPERIENCE_ROWS = [
  { key: '接收方', label: '口交 · 接收方', hint: '她作为被口交的一方' },
  { key: '服务方', label: '口交 · 服务方', hint: '她为对方口交' },
] as const;

/** 将 0~100 的数值夹到合法区间，供进度条宽度使用。 */
export function percent_of(value: number, max = 100): string {
  return `${_.clamp(Number(value) || 0, 0, max).toFixed(1)}%`;
}
