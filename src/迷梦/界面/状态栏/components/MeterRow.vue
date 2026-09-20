<template>
  <div class="meter">
    <div class="meter-row">
      <span class="meter-label">{{ label }}</span>
      <span class="meter-track">
        <span class="meter-fill" :style="{ width: `${pct}%`, background: color }" />
      </span>
      <em class="meter-value" :style="{ color: value_color }">{{ shown }}</em>
    </div>
    <p v-if="hint" class="meter-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { percent } from '../utils';

const props = defineProps<{
  label: string;
  value: number;
  /** 填充条的语义色，传 `var(--c-*)` 而不是色值字面量 */
  color: string;
  /** 数值文字的语义色；深色填充色当文字用对比度不够时，在这里传亮色版 */
  textColor?: string;
  hint?: string;
}>();

const pct = computed(() => percent(props.value));
const shown = computed(() => Math.round(pct.value));
const value_color = computed(() => props.textColor || props.color);
</script>

<style lang="scss" scoped>
.meter {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.meter-row {
  display: flex;
  align-items: center;
  gap: 7px;
}

.meter-label {
  flex: none;
  width: 40px;
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.06em;
}

/* 细长条：4px 高，不带圆角，像账本上划的一道 */
.meter-track {
  position: relative;
  flex: 1 1 auto;
  height: 4px;
  background: var(--c-border);
}

.meter-fill {
  position: absolute;
  inset: 0 auto 0 0;
  transition: width var(--t-hard);
}

.meter-value {
  flex: none;
  min-width: 26px;
  font-size: 11px;
  font-style: normal;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.meter-hint {
  margin: 0;
  padding-left: 47px;
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.45;
}
</style>
