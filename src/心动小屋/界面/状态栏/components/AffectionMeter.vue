<template>
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-heart-pulse" />
      <span>好感度</span>
      <em class="range">-20 ~ 120</em>
    </header>

    <div class="meter">
      <span class="zero" :style="{ left: zero_percent }" />
      <span class="fill" :class="{ negative: affection < 0 }" :style="fill_style" />
      <span class="marker" :style="{ left: value_percent }" />
    </div>

    <div class="scale">
      <span>-20</span>
      <span class="scale-zero" :style="{ left: zero_percent }">0</span>
      <span>120</span>
    </div>

    <dl class="facts">
      <div>
        <dt>当日累计</dt>
        <dd :class="{ capped }">+{{ today_gain }}<em v-if="capped"> / 已达上限</em></dd>
      </div>
      <div>
        <dt>单次变化</dt>
        <dd>-2 ~ +2</dd>
      </div>
      <div>
        <dt>今日剩余</dt>
        <dd :class="{ capped }">{{ capped ? '只能持平或下降' : `还可 +${remaining}` }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { clamp } from '../utils';
import { computed } from 'vue';

const props = defineProps<{
  affection: number;
  todayGain: number;
  capped: boolean;
}>();

const MIN = -20;
const MAX = 120;
const DAILY_CAP = 10;

const percent_of = (value: number) => clamp(((value - MIN) / (MAX - MIN)) * 100, 0, 100);

const value_percent = computed(() => `${percent_of(props.affection).toFixed(2)}%`);
const zero_percent = computed(() => `${percent_of(0).toFixed(2)}%`);

const fill_style = computed(() => {
  const value = percent_of(props.affection);
  const zero = percent_of(0);
  return value >= zero
    ? { left: `${zero}%`, width: `${value - zero}%` }
    : { left: `${value}%`, width: `${zero - value}%` };
});

// todayGain 在首次渲染时可能尚未确定基线，此时按 0 处理，避免出现 NaN
const safe_gain = computed(() => (Number.isFinite(props.todayGain) ? clamp(props.todayGain, 0, DAILY_CAP) : 0));
const today_gain = computed(() => safe_gain.value);
const remaining = computed(() => Math.max(0, DAILY_CAP - safe_gain.value));
const capped = computed(() => props.capped || safe_gain.value >= DAILY_CAP);
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

.block-head .range {
  margin-left: auto;
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.04em;
}

.meter {
  position: relative;
  height: 8px;
  background: var(--c-border);
  overflow: hidden;
}

.zero {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--c-text-muted);
  opacity: 0.8;
  z-index: 2;
}

.fill {
  position: absolute;
  top: 0;
  bottom: 0;
  background: var(--c-affection);
  transition: all 200ms;
}

.fill.negative {
  background: var(--c-warning);
}

.is-thawed .fill {
  transition: all 620ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.marker {
  position: absolute;
  top: -2px;
  bottom: -2px;
  width: 2px;
  background: var(--c-primary);
  transform: translateX(-1px);
  z-index: 3;
}

.scale {
  position: relative;
  height: 11px;
  color: var(--c-text-muted);
  font-size: 9px;
  font-variant-numeric: tabular-nums;
}

.scale span:first-child {
  float: left;
}

.scale span:last-child {
  float: right;
}

.scale-zero {
  position: absolute;
  transform: translateX(-50%);
}

.facts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin: 0;
}

.facts > div {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.facts dt {
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.facts dd {
  margin: 0;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}

.facts dd.capped {
  color: var(--c-warning);
}

.facts dd em {
  font-size: 9px;
  font-style: normal;
  opacity: 0.8;
}
</style>
