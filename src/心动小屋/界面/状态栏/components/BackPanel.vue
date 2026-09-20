<template>
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-id-card-clip" />
      <span>她的身体</span>
      <em class="state-flag" :class="{ excited: arousal === 'excited' }">
        {{ arousal === 'excited' ? '动情中' : '常态' }}{{ intimacy === 'after' ? ' · 事后' : '' }}
      </em>
    </header>

    <ul class="parts">
      <li v-for="part in parts" :key="part.name" class="part" :class="{ excited: arousal === 'excited' }">
        <span class="part-name">{{ part.name }}</span>
        <span class="part-note">{{ part.note }}</span>
      </li>
    </ul>

    <div class="sensitive">
      <em class="sensitive-label">敏感点</em>
      <span v-for="spot in SENSITIVE_SPOTS" :key="spot" class="spot">{{ spot }}</span>
    </div>

    <div class="verdict">
      <em class="verdict-label">她对你的一句话</em>
      <p class="verdict-text">{{ verdict }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSceneState, type Arousal, type Intimacy } from '../scene';

const { arousal, intimacy, relationship } = useSceneState();

type BodyPart = { name: string; idle: string; excited: string; after: string };

// 四个部位。描述随当前状态切换，不是固定档案。
// 体色基调与人设一致：冷白皮延续到全身，毛发为浅色（与银白长发同色系）。
const BODY_PARTS: BodyPart[] = [
  {
    name: '小嘴',
    idle: '唇色是淡的，接近透明。闭着的时候唇线平直，说话前先停半拍才开口',
    excited: '自己张开了，换成口呼吸。唇色被血顶上来，从淡粉变成偏红，说一句话要断两次',
    after: '发干，唇纹明显，下唇内侧有一道她自己咬出来的浅齿印，她会不停用舌尖去碰',
  },
  {
    name: '柔乳',
    idle: 'F 杯，软得往下沉，站着不动也会随呼吸晃。乳头是淡粉色，很小，平贴在乳晕上。乳晕颜色比乳头更浅，边缘不清楚',
    excited: '乳头硬起来，从淡粉涨成发红的肉色，翘着顶住布料，隔着卫衣都能看出两个点。乳晕收缩起皱，碰一下她就缩肩',
    after: '乳头还是硬的，涨得发疼，乳晕上留着被吸咬过的红印。她拿手背挡着，被看到就想把衣服拉下来',
  },
  {
    name: '蜜穴',
    idle: '干燥、温暖，什么都没有发生。外阴是浅粉色，比大腿内侧还浅，两片阴唇合得很紧，只留一条细缝。毛发很淡，几乎看不出来',
    excited: '泥泞潮湿，淫水从缝里往外渗，把阴唇泡得发亮，从浅粉涨成深红。阴唇肿起来往外翻，阴蒂从包皮里探出头。坐过的垫子会留下一小片深色',
    after: '还湿着，混着别的气味，阴唇没消下去，还是翻开的状态。她会先冲澡再回房，走路时夹着腿',
  },
  {
    name: '雏菊',
    idle: '干燥、温暖，收得很紧，颜色是比周围更深一点的粉褐。她平时不会想起这个地方',
    excited: '跟着前面的节奏一缩一缩，自己动，她完全没意识到。皮肤绷紧，颜色变浅',
    after: '还留着被撑开过的感觉，站久了发酸，坐着的时候偏着一边坐',
  },
];

const parts = computed(() =>
  BODY_PARTS.map(part => ({
    name: part.name,
    note: pick_note(part, arousal.value, intimacy.value),
  })),
);

function pick_note(part: BodyPart, a: Arousal, i: Intimacy): string {
  if (i === 'after') return part.after;
  return a === 'excited' ? part.excited : part.idle;
}

// 敏感点只标注，不解说
const SENSITIVE_SPOTS = ['耳后', '颈侧', '锁骨', '腰侧', '大腿内侧'];

// 她对你的一句话：语气随关系状态推进，但永远是否认句
const VERDICT_BY_STAGE: string[] = [
  '她不会说出口：你还不如那个记忆里站着的人',
  '她不会说出口：你比我想的多一点',
  '她不会说出口：今天那句话我不是随口说的',
  '她不会说出口：别走',
  '她不会说出口：这句话你记住，我只说一次',
];

const verdict = computed(() => VERDICT_BY_STAGE[relationship.value] ?? VERDICT_BY_STAGE[0]);
</script>

<style lang="scss" scoped>
.block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.block-head {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.state-flag {
  margin-left: auto;
  padding: 1px 6px;
  border: 1px solid var(--c-border);
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.06em;
  transition: color 200ms, border-color 200ms;
}

.state-flag.excited {
  border-color: var(--c-thaw);
  color: var(--c-thaw);
}

.parts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.part {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 7px 9px;
  background: var(--c-surface-raised);
  border-left: 2px solid var(--c-border);
  transition: border-color 300ms;
}

.part.excited {
  border-left-color: var(--c-thaw);
}

.part-name {
  font-size: 12px;
  letter-spacing: 0.06em;
}

.part-note {
  color: var(--c-primary);
  font-size: 10px;
  line-height: 1.5;
  opacity: 0.88;
}

.part.excited .part-note {
  color: var(--c-thaw);
  opacity: 0.95;
}

.sensitive {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  padding-top: 2px;
}

.sensitive-label {
  color: var(--c-text-muted);
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.08em;
}

.spot {
  padding: 1px 6px;
  background: var(--c-border);
  color: var(--c-primary);
  font-size: 10px;
}

.verdict {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 7px 9px;
  background: rgb(232 213 196 / 8%);
  border-left: 2px solid var(--c-thaw);
}

.verdict-label {
  color: var(--c-text-muted);
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.08em;
}

.verdict-text {
  margin: 0;
  color: var(--c-thaw);
  font-size: 11px;
  line-height: 1.5;
}
</style>
