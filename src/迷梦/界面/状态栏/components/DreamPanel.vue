<template>
  <section class="block dream" :class="{ lit: dreaming, nightmare: is_nightmare }">
    <header class="block-head">
      <i class="fa-solid fa-moon" />
      <span>共梦</span>
      <em class="tone" :class="tone_class">{{ tone_label }}</em>
    </header>

    <dl v-if="dreaming" class="facts">
      <div class="wide">
        <dt>梦境舞台</dt>
        <dd>{{ dream.梦境舞台 || '梦里没有具体的地方。' }}</dd>
      </div>
    </dl>

    <p v-else class="quiet">
      昨夜无梦。没有性关系的夜晚不会共梦——所以到此刻为止，这还只是两个仇人之间的事。
    </p>

    <!--
      醒后留痕：全卡唯一会被第三方看见的东西。
      因此只要字段非空就一定展示，**不受「是否共梦」影响**（变量偶发不一致时也不能把它藏起来），
      也绝不截断、不加省略号、不做限高滚动 —— 展示层没有资格精简它。
    -->
    <div v-if="evidence.length" class="evidence">
      <header class="evidence-head">
        <i class="fa-solid fa-fingerprint" />
        <span>醒后留痕</span>
        <em>{{ evidence.length }} 处</em>
      </header>

      <ol class="evidence-list">
        <li v-for="(item, index) in evidence" :key="index">
          <span class="no">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="text">{{ item }}</span>
        </li>
      </ol>

      <p class="witness">第三人看得见这些痕迹，却无法记录、也无法证明共梦这件事本身。</p>
    </div>

    <p v-else-if="dreaming" class="quiet">梦里交换的东西没有留在身体上。</p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Schema } from '../../../schema';
import { split_evidence } from '../utils';

const props = defineProps<{ dream: Schema['共梦'] }>();

const dreaming = computed(() => props.dream.是否共梦 === true);
const is_nightmare = computed(() => dreaming.value && props.dream.梦的色调 === '失控');
const evidence = computed(() => split_evidence(props.dream.醒后留痕));

const tone_label = computed(() => {
  if (!dreaming.value) return '未成梦';
  return props.dream.梦的色调 || '无色调';
});

const tone_class = computed(() => {
  if (!dreaming.value) return 'tone-none';
  if (props.dream.梦的色调 === '失控') return 'tone-lost';
  if (props.dream.梦的色调 === '沉沦') return 'tone-sink';
  return 'tone-none';
});
</script>

<style lang="scss" scoped>
.block {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 9px 10px;
  background: var(--c-surface-raised);
  border-left: 2px solid var(--c-border);
  /* 明线：梦没发生时不打扰你 */
  transition:
    border-color var(--t-dream),
    background var(--t-dream);
}

/* 暗线接管：共梦发生的那一天，整块渗出来 */
.dream.lit {
  border-left-color: var(--c-dream);
  background: color-mix(in srgb, var(--c-dream) 8%, var(--c-surface-raised));
}

.dream.nightmare {
  border-left-color: var(--c-hate);
  background: color-mix(in srgb, var(--c-hate) 10%, var(--c-surface-raised));
}

.block-head {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.12em;

  i {
    transition: color var(--t-dream);
  }
}

.dream.lit .block-head i {
  color: var(--c-dream-text);
}

.dream.nightmare .block-head i {
  color: var(--c-hate-text);
}

.tone {
  margin-left: auto;
  padding: 1px 6px;
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.08em;
  border: 1px solid var(--c-border);
  transition:
    color var(--t-dream),
    border-color var(--t-dream);
}

.tone-sink {
  color: var(--c-dream-text);
  border-color: var(--c-dream-text);
}

.tone-lost {
  color: var(--c-hate-text);
  border-color: var(--c-hate-text);
}

.tone-none {
  color: var(--c-text-muted);
}

.facts {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;

  > div {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  dt {
    color: var(--c-text-muted);
    font-size: 9px;
    letter-spacing: 0.06em;
  }

  dd {
    margin: 0;
    font-size: 11px;
    line-height: 1.5;
  }
}

.quiet {
  margin: 0;
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.5;
}

/* ── 物证清单 ───────────────────────────────────────────────── */
.evidence {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 9px;
  background: rgb(0 0 0 / 22%);
  border-top: 1px solid var(--c-border);
}

.evidence-head {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-dream-text);
  font-size: 10px;
  letter-spacing: 0.1em;

  em {
    margin-left: auto;
    color: var(--c-text-muted);
    font-size: 9px;
    font-style: normal;
  }
}

.dream.nightmare .evidence-head {
  color: var(--c-hate-text);
}

.evidence-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: baseline;
    gap: 7px;
  }
}

.no {
  flex: none;
  color: var(--c-text-muted);
  font-size: 9px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
}

/* 完整展示，不截断 */
.text {
  font-size: 11px;
  line-height: 1.55;
}

.witness {
  margin: 0;
  color: var(--c-text-muted);
  font-size: 9px;
  line-height: 1.5;
  font-style: italic;
}

/* 失控度高位：留痕开始「不安分」——她已经不打算醒过来了 */
.dream.nightmare .evidence-list {
  animation: unsettle 3.4s ease-in-out infinite;
}

@keyframes unsettle {
  0%,
  100% {
    transform: translateX(0);
  }
  46% {
    transform: translateX(0);
  }
  48% {
    transform: translateX(-0.6px);
  }
  50% {
    transform: translateX(0.6px);
  }
  52% {
    transform: translateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dream.nightmare .evidence-list {
    animation: none;
  }
}
</style>
