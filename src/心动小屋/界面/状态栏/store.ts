import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: getCurrentMessageId() });

/**
 * 切换 NTR 开关。
 *
 * 开关由玩家在界面上直接操作，不设前置条件：写回后 MVU 会把新值同步到楼层变量，
 * 叙事侧依据该值改变环境（其他男嘉宾转为主动攻势、节目组解禁 NSFW 向环节与随机组队）。
 */
export function set_ntr_switch(next: Schema['世界']['NTR开关']) {
  const store = useDataStore();
  store.data.世界.NTR开关 = next;
}
