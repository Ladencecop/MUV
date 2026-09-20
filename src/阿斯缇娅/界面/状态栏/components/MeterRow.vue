<script setup lang="ts">
import { computed } from 'vue';

/**
 * 一条读数轨道。面板里所有 0~100 的数值都走这里，保证仪表读数长得一致。
 *
 * `tone` 决定轨道与读数的色相（能源冷蓝 / 她的琥珀 / 生理暖色 / 亲密血色 / 警戒锈红），
 * `alert` 由调用方按阈值判定后传入 —— 组件本身不做任何阈值判断。
 */
const props = withDefaults(
  defineProps<{
    label: string;
    value: number;
    max?: number;
    tone?: string;
    alert?: boolean;
    unit?: string;
    hint?: string;
  }>(),
  { max: 100, tone: 'var(--c-power)', alert: false, unit: '', hint: '' },
);

const ratio = computed(() => _.clamp(props.value / props.max, 0, 1));
const text = computed(() => `${props.value}${props.unit}`);
</script>

<template>
  <div class="meter" :class="{ alert }">
    <div class="meter-row">
      <span class="label">{{ label }}</span>
      <span class="track">
        <span class="fill" :style="{ width: `${ratio * 100}%`, background: alert ? 'var(--c-danger)' : tone }" />
      </span>
      <em class="value" :style="{ color: alert ? 'var(--c-danger-text)' : tone }">{{ text }}</em>
    </div>
    <p v-if="hint" class="hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.meter {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meter-row {
  display: flex;
  align-items: center;
  gap: 7px;
}

.label {
  flex: none;
  width: 48px;
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.06em;
}

.track {
  position: relative;
  flex: 1 1 auto;
  height: 4px;
  background: var(--c-border);
}

.fill {
  position: absolute;
  inset: 0 auto 0 0;
  transition: width var(--t-hatch);
}

.value {
  flex: none;
  min-width: 30px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-style: normal;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.hint {
  margin: 0;
  padding-left: 55px;
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.45;
}

.alert .track {
  border-left: 1px solid var(--c-danger);
}
</style>
