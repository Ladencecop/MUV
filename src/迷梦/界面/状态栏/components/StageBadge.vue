<template>
  <span class="badge">
    <span class="seal" :style="{ '--stage': color, '--stage-ink': ink }">
      <em v-for="ch in chars" :key="ch">{{ ch }}</em>
    </span>
    <em v-if="doomed" class="doom" title="失控度 ≥ 80：她的梦开始出现「她已经不打算醒过来」的形态">
      <i class="fa-solid fa-ghost" />
    </em>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { STAGE_COLORS, STAGE_NAMES, STAGE_TEXT_COLORS } from '../constants';

const props = defineProps<{ stage: number; doomed: boolean }>();

const name = computed(() => STAGE_NAMES[props.stage] ?? STAGE_NAMES[0]);
/** 印章底色用深色版（靠面积），文字与描边用亮色版（靠对比度） */
const color = computed(() => STAGE_COLORS[props.stage] ?? STAGE_COLORS[0]);
const ink = computed(() => STAGE_TEXT_COLORS[props.stage] ?? STAGE_TEXT_COLORS[0]);
const chars = computed(() => [...name.value]);
</script>

<style lang="scss" scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  flex: none;
}

/* 篆印式方章：两字竖排，边框取阶段色阶 */
.seal {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 2px 4px;
  font-family: var(--font-serif);
  font-size: 11px;
  line-height: 1.05;
  letter-spacing: 0;
  color: var(--stage-ink);
  border: 1px solid var(--stage-ink);
  /* 支持 color-mix 时渗出一点阶段色，不支持则退回木饰面底色 */
  background: var(--c-surface-raised);
  background: color-mix(in srgb, var(--stage) 18%, var(--c-surface));
  transition:
    color var(--t-dream),
    border-color var(--t-dream);
}

.seal em {
  font-style: normal;
}

.doom {
  font-size: 10px;
  line-height: 1;
  color: var(--c-hate-text);
}
</style>
