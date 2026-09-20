<script setup lang="ts">
import { computed } from 'vue';
import { bandOf } from '../constants';
import { type Tone, widthPct } from '../styles';

/**
 * 一条读数。面板里所有 0~100 的数值都走这里，保证仪表读数长得一致。
 *
 * `tone` 是语义令牌名（power / amber / rust / warm / intimacy / danger / gold），
 * 由 CSS 类上色 —— 组件内部不拼 CSS 字符串，避免触发 Vue 的同名简写解析。
 * `alert` 由调用方按阈值判定后传入，或传 threshold 让本组件判定：
 * `lower` 为 true 表示值越低越危险（电量、能源），false 表示值越高越危险（损耗、辐射）。
 */
const props = withDefaults(
  defineProps<{
    label: string;
    value: number;
    tone?: Tone;
    alert?: boolean;
    threshold?: number;
    lower?: boolean;
    unit?: string;
    bands?: readonly { min: number; label: string }[];
    hint?: string;
  }>(),
  { tone: 'power', alert: false, lower: true, unit: '', hint: '' },
);

const isAlert = computed(() => {
  if (props.alert) return true;
  if (props.threshold === undefined) return false;
  return props.lower ? props.value < props.threshold : props.value > props.threshold;
});

const text = computed(() => `${props.value}${props.unit}`);
const note = computed(() => props.hint || (props.bands ? bandOf(props.bands, props.value).label : ''));
/** 告警时统一走 danger，否则用传入的色相 */
const hue = computed<Tone>(() => (isAlert.value ? 'danger' : props.tone));
</script>

<template>
  <div class="gauge">
    <div class="gauge-row">
      <span class="gauge-label stencil">{{ label }}</span>
      <span class="gauge-track">
        <span class="gauge-fill" :class="`fill-${hue}`" :style="{ width: widthPct(value) }" />
        <span class="gauge-ticks" />
      </span>
      <em class="gauge-value" :class="`text-${hue}`">{{ text }}</em>
      <span class="gauge-lamp" :class="[`lamp-${hue}`, { bad: isAlert }]" />
    </div>
    <p v-if="note" class="gauge-note">{{ note }}</p>
  </div>
</template>

<style scoped>
.gauge {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.gauge-row {
  display: flex;
  align-items: center;
  gap: 7px;
}

.gauge-label {
  flex: none;
  width: 62px;
  color: var(--c-text-muted);
  font-size: 9px;
}

.gauge-track {
  position: relative;
  flex: 1 1 auto;
  height: 7px;
  background: var(--c-surface-sunken);
  border: 1px solid var(--c-border);
}

/* 四分之一刻度线，做出仪表盘的味道 */
.gauge-ticks {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(to right, rgba(205, 195, 173, 0.16) 0 1px, rgba(0, 0, 0, 0) 1px 25%);
}

.gauge-fill {
  position: absolute;
  inset: 0 auto 0 0;
  transition: width var(--t-hatch);
}

.gauge-value {
  flex: none;
  min-width: 30px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-style: normal;
  text-align: right;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.8);
}

/* 状态灯：达标亮，告警时呼吸 */
.gauge-lamp {
  flex: none;
  width: 5px;
  height: 5px;
}

.gauge-lamp.bad {
  animation: pulse-danger var(--t-warn) infinite;
}

.gauge-note {
  margin: 0;
  padding-left: 69px;
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.45;
}

/* ── 色相：填充条（深色版） ── */
.fill-power {
  background: var(--c-power);
}
.fill-amber {
  background: var(--c-amber);
}
.fill-rust {
  background: var(--c-rust);
}
.fill-warm {
  background: var(--c-warm);
}
.fill-intimacy {
  background: var(--c-intimacy);
}
.fill-danger {
  background: var(--c-danger);
}
.fill-gold {
  background: var(--c-gold);
}
.fill-muted {
  background: var(--c-border-hot);
}

/* ── 色相：读数只吃 color ── */
.text-power {
  color: var(--c-power-text);
}
.text-amber {
  color: var(--c-amber-text);
}
.text-rust {
  color: var(--c-rust-text);
}
.text-warm {
  color: var(--c-warm-text);
}
.text-intimacy {
  color: var(--c-intimacy-text);
}
.text-danger {
  color: var(--c-danger-text);
}
.text-gold {
  color: var(--c-gold-text);
}
.text-muted {
  color: var(--c-text-muted);
}

/* ── 色相：指示点只吃 background-color ── */
.lamp-power {
  background-color: var(--c-power);
  box-shadow: 0 0 4px var(--c-power);
}
.lamp-amber {
  background-color: var(--c-amber);
  box-shadow: 0 0 4px var(--c-amber);
}
.lamp-rust {
  background-color: var(--c-rust);
  box-shadow: 0 0 4px var(--c-rust);
}
.lamp-warm {
  background-color: var(--c-warm);
  box-shadow: 0 0 4px var(--c-warm);
}
.lamp-intimacy {
  background-color: var(--c-intimacy);
  box-shadow: 0 0 4px var(--c-intimacy);
}
.lamp-danger {
  background-color: var(--c-danger);
  box-shadow: 0 0 4px var(--c-danger);
}
.lamp-gold {
  background-color: var(--c-gold);
  box-shadow: 0 0 4px var(--c-gold);
}
.lamp-muted {
  background-color: var(--c-border-hot);
}
</style>
