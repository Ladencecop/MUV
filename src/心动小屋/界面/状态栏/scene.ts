import { computed } from 'vue';
import { useDataStore } from './store';
import { clampInt } from './utils';

/**
 * 会话级的场景状态推断。
 *
 * 「她是否动情」「是否刚经历过亲密」在当前 MVU 变量结构里没有对应字段，
 * 而它们只影响状态栏的显示措辞、不参与任何叙事判定，所以用 localStorage 做会话内跟踪。
 *
 * 判定原则（吸取的教训）：
 * 1. 只在**当前楼层**的正文里找证据，绝不继承上一楼的状态。
 *    上一版把状态持久化后会导致误判永久粘住——开局她坐在帐篷里等，却被判成动情。
 * 2. 关键词必须是**明确的身体反应或性行为**，像「吻」「颤」「抖」这种日常描写里随处出现的词一律不用。
 * 3. 没有证据时默认常态，宁可漏判也不要误判。
 */

export type Arousal = 'idle' | 'excited';
export type Intimacy = 'none' | 'done' | 'after';

// 带版本号，避免旧版本留下的错误状态被读到
const KEY = '心动小屋:status_bar:scene:v2';

type SceneState = {
  arousal: Arousal;
  intimacy: Intimacy;
  message_id: number;
};

const DEFAULT: SceneState = { arousal: 'idle', intimacy: 'none', message_id: -1 };

/**
 * 动情证据：只收明确指向性兴奋的词。
 * 刻意排除：吻、颤、抖、紧张、脸红、心跳、靠近、抱——这些在擦边与日常描写里都会出现。
 */
const AROUSAL_HINTS = [
  '湿了',
  '湿透',
  '泥泞',
  '潮湿得',
  '动情',
  '发情',
  '勃起',
  '硬得',
  '硬了',
  '挺立',
  '立起来',
  '呻吟',
  '娇喘',
  '喘息',
  '高潮',
  '绝顶',
  '欲液',
  '爱液',
  '淫水',
  '乳头硬',
  '乳尖硬',
  '夹紧腿',
  '双腿发软',
];

/** 明确的性行为 */
const INTIMACY_HINTS = ['做爱', '性交', '交合', '插入', '进入她体内', '射精', '射在', '口交', '骑乘', '结合在一起'];

/** 事后 */
const AFTER_HINTS = ['事后', '余韵', '高潮后', '清理过', '第二天醒来'];

function read_state(): SceneState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    const parsed = JSON.parse(raw) as Partial<SceneState>;
    return { ...DEFAULT, ...parsed };
  } catch {
    return { ...DEFAULT };
  }
}

function write_state(state: SceneState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* localStorage 不可用时静默降级 */
  }
}

/** 供外部（如手动切换）改写场景状态 */
export function set_scene(patch: Partial<Pick<SceneState, 'arousal' | 'intimacy'>>) {
  write_state({ ...read_state(), ...patch, message_id: getCurrentMessageId() });
}

export function useSceneState() {
  const message_id = getCurrentMessageId();

  const raw_text = computed(() => {
    try {
      const messages = getChatMessages(message_id);
      return String(messages?.[0]?.message ?? '');
    } catch {
      return '';
    }
  });

  const store = useDataStore();
  const events = computed<string[]>(() => store.data?.剧情?.关键事件记录 ?? []);
  const relationship = computed(() => clampInt(store.data?.裴泫雅?.关系状态 ?? 0, 0, 4));

  const state = computed<SceneState>(() => {
    const prev = read_state();
    // 同一楼层且已判定过，直接复用
    if (prev.message_id === message_id) return prev;

    const text = raw_text.value;
    const has_intimacy_event = events.value.some(e => /性行为|做爱|亲密/.test(e));
    const intimacy_from_text = INTIMACY_HINTS.some(k => text.includes(k));
    const after = AFTER_HINTS.some(k => text.includes(k));

    let intimacy: Intimacy = 'none';
    if (after && (has_intimacy_event || prev.intimacy !== 'none')) intimacy = 'after';
    else if (has_intimacy_event || intimacy_from_text) intimacy = 'done';

    // 动情只看当前楼层的明确证据；没有证据就是常态
    const arousal: Arousal = intimacy === 'done' || AROUSAL_HINTS.some(k => text.includes(k)) ? 'excited' : 'idle';

    const next: SceneState = { arousal, intimacy, message_id };
    write_state(next);
    return next;
  });

  return {
    state,
    arousal: computed(() => state.value.arousal),
    intimacy: computed(() => state.value.intimacy),
    relationship,
  };
}
