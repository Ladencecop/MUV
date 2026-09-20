import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

/**
 * 状态栏唯一的数据源。
 *
 * 界面只读不写：所有变量由 AI 按「变量更新规则」维护，
 * store 的 2s 轮询负责把楼层 stat_data 的改动同步进来。
 */
export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: getCurrentMessageId() });
