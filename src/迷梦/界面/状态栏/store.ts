import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

/**
 * 状态栏只读《迷梦》所在楼层的 MVU 变量，不写回。
 *
 * 本界面刻意不提供任何写回入口：
 * - 关系阶段由叙事推进（逐级、不可跳跃、不可回退），玩家点不出来；
 * - NTR 三方向默认存在、不设开关，界面上没有可切换的东西；
 * - 剩余变量（时间、地点、事件、恨意、欲望、信任度、失控度、共梦、筹码与情报）全部由 AI 依剧情更新。
 * 因此这里只暴露 store，不导出 setter。
 */
export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: getCurrentMessageId() });
