<script setup lang="ts">
import { computed } from 'vue';
import { ENERGY_BANDS, THRESHOLDS, bandOf, pct } from '../constants';
import MeterRow from './MeterRow.vue';

/**
 * 基地车面板：能源储备 + 设施解锁进度。
 *
 * 能源是全卡唯一的资源数值，基地车运转与她充电共用同一池，
 * 所以这里把「维持这个家」与「让她保持战力」的争抢写成一句常驻提示。
 */
const props = defineProps<{
  energy: number;
  facilities: string[];
  allFacilities: readonly string[];
}>();

const alert = computed(() => props.energy < THRESHOLDS.energy);
const unlocked = computed(() => props.facilities.filter((f) => (props.allFacilities as readonly string[]).includes(f)));
const progress = computed(() => pct((unlocked.value.length / props.allFacilities.length) * 100));
</script>

<template>
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-car-side" />
      <span>基地车</span>
      <em class="hint" :class="{ alert }">{{ alert ? '能源见底' : '运转中' }}</em>
    </header>

    <div class="meters">
      <MeterRow
        label="能源储备"
        :value="energy"
        tone="var(--c-power)"
        :alert="alert"
        :hint="bandOf(ENERGY_BANDS, energy).label"
      />
    </div>

    <div class="progress">
      <span class="label">设施解锁</span>
      <span class="track">
        <span class="fill" :style="{ width: `${progress}%` }" />
      </span>
      <em class="count">{{ unlocked.length }} / {{ allFacilities.length }}</em>
    </div>

    <p class="rule">基地车运转与她充电共用同一池能源。能源紧时，给她充电就得停掉净水或温室。</p>
  </section>
</template>

<style scoped>
.block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.block-head {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.hint {
  margin-left: auto;
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.04em;
  opacity: 0.75;
}

.hint.alert {
  color: var(--c-danger-text);
  opacity: 1;
  animation: pulse-danger var(--t-warn) infinite;
}

.meters {
  padding: 8px 9px;
  background: var(--c-surface-raised);
}

.progress {
  display: flex;
  align-items: center;
  gap: 7px;
}

.label {
  flex: none;
  color: var(--c-text-muted);
  font-size: 9px;
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
  background: var(--c-power);
  transition: width var(--t-hatch);
}

.count {
  flex: none;
  color: var(--c-power-text);
  font-family: var(--font-mono);
  font-size: 10px;
  font-style: normal;
  font-variant-numeric: tabular-nums;
}

.rule {
  margin: 0;
  padding-top: 6px;
  border-top: 1px solid var(--c-border);
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.5;
}
</style>
