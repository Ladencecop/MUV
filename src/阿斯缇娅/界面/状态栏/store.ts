import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

/**
 * 状态栏只读《阿斯缇娅》所在楼层的 MVU 变量，不写回。
 *
 * 本界面刻意不提供任何写回入口：
 * - 关系阶段由叙事推进（逐级、不可跳跃），玩家点不出来；
 * - 电量、损耗、能源与生理状态全部由 AI 依剧情更新；
 * - 小穴与子宫的字段属于叙事产物，界面只负责如实展示，不提供编辑。
 * 因此这里只暴露 store，不导出 setter。
 */
export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: getCurrentMessageId() });
