/*
 * 《她和他》MVU 变量结构定义（Zod 4）
 *
 * 事实来源：创作规划.yaml 的 `mvu` 段（structure + variables）。
 * 顶层结构：世界 / 千羽 / 玩家 / 剧情。
 *
 * 命名约定：
 *   `_` 前缀 —— 脚本维护的派生只读变量（AI 可见、AI 不更新），
 *                由 initvar / 变量更新规则保证其初始值与派生逻辑。
 *
 * 与 EJS 的耦合（不得改动下列变量的类型）：
 *   千羽.关系阶段                   number（EJS 做 === 0 / === 1 / === 2 / >= 3 数值比较）
 *   千羽.生理周期._生理期阶段       string enum（EJS 四阶段段落控制）
 *   世界.狂欢节进行中 / 狂欢节模式  boolean / enum（EJS 狂欢节段落控制）
 */

export const Schema = z.object({
  // ── 世界 ──────────────────────────────────────────────────────────
  世界: z.object({
    // YYYY/MM/DD-HH:MM
    当前时间: z
      .string()
      .regex(/^\d{4}\/\d{2}\/\d{2}-\d{2}:\d{2}$/)
      .prefault(() => {
        const pad = (n: number) => String(n).padStart(2, '0');
        const d = new Date();
        return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}-${pad(d.getHours())}:${pad(d.getMinutes())}`;
      }),
    当前地点: z
      .enum([
        '别墅客厅',
        '别墅厨房',
        '别墅餐厅',
        '客厅地毯',
        '别墅游戏室',
        '别墅书房',
        '别墅客房',
        '别墅主卧',
        '别墅地下室',
        '别墅庭院',
        '山城中心区',
        '山城西区',
        '山城北区',
        '山城南区',
        '山城东区',
        '其他',
      ])
      .prefault('别墅客厅'),
    天气: z.enum(['晴', '多云', '阴', '小雨', '大雨', '雪']).prefault('晴'),
    狂欢节进行中: z.boolean().prefault(false),
    狂欢节模式: z.enum(['年度', '追加']).prefault('年度'),
  }).prefault({}),

  // ── 千羽 ──────────────────────────────────────────────────────────
  千羽: z.object({
    // 千羽对 <user> 的专一度（≠好感度；好感度默认满上限、不追踪）
    忠诚度: z.coerce
      .number()
      .transform(value => _.clamp(value, 0, 100))
      .prefault(90),
    梦境选择: z.enum(['未经历', '金色', '紫色']).prefault('未经历'),
    // 特殊体质：4 天一轮，卵泡期 → 排卵期 → 黄体期 → 月经期
    生理周期: z
      .object({
        _周期天数: z.coerce
          .number()
          .transform(value => _.clamp(value, 1, 4))
          .prefault(1),
        _生理期阶段: z
          .enum(['卵泡期', '排卵期', '黄体期', '月经期'])
          .prefault('卵泡期')
          .describe('由脚本按 _周期天数 派生：1=卵泡期、2=排卵期、3=黄体期、4=月经期'),
      })
      .prefault({})
      .describe('4 天一轮的生理周期；两个字段均由脚本维护，AI 不更新'),
    怀孕: z
      .object({
        // 子宫内精液带来的累计怀孕百分比
        怀孕概率: z.coerce
          .number()
          .transform(value => _.clamp(value, 0, 100))
          .prefault(0),
        胚胎数量: z.coerce
          .number()
          .transform(value => Math.max(0, Math.floor(value)))
          .prefault(0),
        // 逐条记录每一次内射；状态栏读取其汇总值到 千羽.身体状态.体内精液量
        体内精液: z
          .record(
            z.string(),
            z.object({
              // 注入时刻，形如 2026/07/14-21:30
              时间: z
                .string()
                .regex(/^\d{4}\/\d{2}\/\d{2}-\d{2}:\d{2}$/)
                .prefault('0000/00/00-00:00'),
              毫升数: z.coerce
                .number()
                .transform(value => Math.max(0, value))
                .prefault(0),
              生理期阶段: z
                .enum(['卵泡期', '排卵期', '黄体期', '月经期'])
                .prefault('卵泡期'),
              // 单次概率 = 毫升数 × 阶段系数（卵泡期 2%/ml、排卵期 8%/ml、黄体期 1%/ml、月经期 0）
              是否入子宫: z.boolean().prefault(false),
              // 记录写入时间戳，用于插入顺序的维护
              $time: z.coerce.number().prefault(() => Date.now()),
            }),
          )
          .prefault({})
          .describe('逐条精液记录；键为唯一标识，值含 时间 / 毫升数 / 生理期阶段 / 是否入子宫'),
      })
      .prefault({})
      .describe('怀孕概率、胚胎数量与体内精液明细清单'),
    // 判定口径为素材原文硬性要求，不得简化
    性经验: z
      .object({
        口交: z
          .object({
            接收方: z.coerce
              .number()
              .transform(value => Math.max(0, Math.floor(value)))
              .prefault(0),
            服务方: z.coerce
              .number()
              .transform(value => Math.max(0, Math.floor(value)))
              .prefault(0),
          })
          .prefault({}),
        性交: z.coerce
          .number()
          .transform(value => Math.max(0, Math.floor(value)))
          .prefault(0),
        肛交: z.coerce
          .number()
          .transform(value => Math.max(0, Math.floor(value)))
          .prefault(0),
      })
      .prefault({}),
    // 0=半步情侣、1=夫妻式同居、2=说出真心话、3=多妻处境；逐级递增不可跳跃
    // 必须是 number：EJS 对其做 === 0 / === 1 / === 2 / >= 3 的数值比较
    关系阶段: z.coerce
      .number()
      .transform(value => _.clamp(value, 0, 4))
      .prefault(0),
    // 关系推进的软指标，与忠诚度相互独立
    心动感: z.coerce
      .number()
      .transform(value => _.clamp(value, 0, 100))
      .prefault(65),
    // 状态栏「身体状态与情欲度」区的数据源
    身体状态: z
      .object({
        发情度: z.coerce
          .number()
          .transform(value => _.clamp(value, 0, 100))
          .prefault(0),
        湿润度: z.coerce
          .number()
          .transform(value => _.clamp(value, 0, 100))
          .prefault(0),
        高潮次数: z.coerce
          .number()
          .transform(value => Math.max(0, Math.floor(value)))
          .prefault(0)
          .describe('当前这场性事内的高潮次数，新场景重置'),
        体力: z.coerce
          .number()
          .transform(value => _.clamp(value, 0, 100))
          .prefault(100),
        当前穿着: z.string().prefault('全裸'),
        体内精液量: z.coerce
          .number()
          .transform(value => Math.max(0, value))
          .prefault(0)
          .describe('单位 ml；由 千羽.怀孕.体内精液 汇总而来的展示值'),
      })
      .prefault({}),
  }).prefault({}),

  // ── 玩家 ──────────────────────────────────────────────────────────
  玩家: z.object({
    // 一夫多妻制严格三人上限（千羽 + 至多 2 人）；超出部分丢弃最早的
    领证妻室: z
      .array(z.string())
      .prefault(['千羽'])
      .transform(names => (names.length > 3 ? names.slice(-3) : names))
      .describe('已领证的妻室名单；长度不得超过 3'),
    // 由 3 减去 玩家.领证妻室 长度派生（脚本维护、AI 不更新）
    _剩余名额: z.coerce
      .number()
      .transform(value => _.clamp(value, 0, 2))
      .prefault(2),
    黑道身份暴露: z
      .enum(['未暴露', '千羽诸葛羽已知', '公开'])
      .prefault('千羽诸葛羽已知')
      .describe('记录 <user> 与黑道联系的知情范围，不解释原因'),
  }).prefault({}),

  // ── 剧情 ──────────────────────────────────────────────────────────
  剧情: z.object({
    当前阶段目标: z
      .string()
      .prefault('推进与千羽的日常相处')
      .describe('当前叙事的主要待推进目标，由 AI 依关系阶段、心动感与近期事件维护'),
    关键事件记录: z
      .array(z.string())
      .prefault([])
      .describe('已发生的重大节点标记，如 领证搬入别墅 / 首次性交 / 梦境首次选择 / 说出真心话'),
  }).prefault({}),
});

// 顶层保持为裸 ZodObject：前端界面的 defineMvuDataStore 要求传入 ZodObject，
// 缺失字段的兜底由各字段自身的 prefault 完成，parse({}) 即可得到完整结构。
export type Schema = z.output<typeof Schema>;
