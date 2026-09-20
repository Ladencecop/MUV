import { computed } from 'vue';

/**
 * 精选弹幕的解析。
 *
 * 约定（写在世界书「节目与规则」的〈精选弹幕〉一节里）：AI 每回合在正文末尾输出三行：
 *
 *   <danmaku>
 *   祝福磕糖｜……
 *   吐槽犀利｜……
 *   色情露骨｜……
 *   </danmaku>
 *
 * 前端从当前楼层正文里解析这三行并展示。三条的顺序与风格固定，内容由 AI 按当场剧情生成。
 */

export type DanmakuKind = 'bless' | 'snark' | 'lewd';

export type Danmaku = { kind: DanmakuKind; label: string; text: string };

const BLOCK_RE = /<danmaku>([\s\S]*?)<\/danmaku>/i;

const STYLE_MAP: { key: DanmakuKind; label: string; aliases: string[] }[] = [
  { key: 'bless', label: '祝福磕糖', aliases: ['祝福磕糖', '祝福', '磕糖'] },
  { key: 'snark', label: '吐槽犀利', aliases: ['吐槽犀利', '吐槽', '犀利'] },
  { key: 'lewd', label: '色情露骨', aliases: ['色情露骨', '色情', '露骨'] },
];

function match_style(line: string): { kind: DanmakuKind; label: string; rest: string } | null {
  for (const style of STYLE_MAP) {
    for (const alias of style.aliases) {
      // 支持「标签｜内容」「标签: 内容」「【标签】内容」三种写法
      const pattern = new RegExp(`^\\s*[【\\[]?${alias}[】\\]]?\\s*[｜|:：]\\s*(.+)$`);
      const hit = line.match(pattern);
      if (hit) return { kind: style.key, label: style.label, rest: hit[1].trim() };
    }
  }
  return null;
}

export function parse_danmaku(raw: string): Danmaku[] {
  if (!raw) return [];
  const block = raw.match(BLOCK_RE);
  const body = block ? block[1] : '';
  if (!body) return [];

  const found = new Map<DanmakuKind, Danmaku>();
  for (const line of body.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const hit = match_style(line);
    if (hit && hit.rest && !found.has(hit.kind)) {
      found.set(hit.kind, { kind: hit.kind, label: hit.label, text: hit.rest });
    }
  }

  // 按固定顺序返回，缺失的风格留空占位
  return STYLE_MAP.map(s => found.get(s.key) ?? { kind: s.key, label: s.label, text: '' });
}

export function useDanmaku() {
  const raw_text = computed(() => {
    try {
      const messages = getChatMessages(getCurrentMessageId());
      return String(messages?.[0]?.message ?? '');
    } catch {
      return '';
    }
  });

  const danmaku = computed(() => parse_danmaku(raw_text.value));
  const has_any = computed(() => danmaku.value.some(d => d.text));

  return { danmaku, has_any };
}
