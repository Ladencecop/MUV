<script setup lang="ts">
import { computed } from 'vue';
import { BODY_STATES, POWER_BANDS, THRESHOLDS, WEAR_BANDS, bandOf } from '../constants';
import MeterRow from './MeterRow.vue';

/**
 * 她的机体面板：电量、机体损耗、生理状态，以及基地车的设施解锁。
 *
 * 电量与损耗的读数直接决定她在叙事里还能不能打，因此两块都给出分档说明。
 */
const props = defineProps<{
  power: number;
  wear: number;
  bodyState: string;
  facilities: string[];
  allFacilities: readonly string[];
}>();

const powerAlert = computed(() => props.power < THRESHOLDS.power);
const wearAlert = computed(() => props.wear > THRESHOLDS.wear);

/** 两个格挡共用一个指示条，亮一段代表一档 */
const powerPips = computed(() => (props.power >= THRESHOLDS.power ? 2 : 1));
</script>

<template>
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-microchip" />
      <span>她的机体</span>
      <em class="hint" :class="{ alert: powerAlert || wearAlert }">
        {{ powerAlert ? '电量不足' : wearAlert ? '需要维护' : '运转正常' }}
      </em>
    </header>

    <div class="meters">
      <MeterRow
        label="电量"
        :value="power"
        tone="var(--c-power)"
        :alert="powerAlert"
        :hint="bandOf(POWER_BANDS, power).label"
      />
      <MeterRow
        label="机体损耗"
        :value="wear"
        tone="var(--c-warm)"
        :alert="wearAlert"
        :hint="bandOf(WEAR_BANDS, wear).label"
      />
    </div>

    <div class="power-gauge">
      <span class="gauge-label">供能状态</span>
      <span class="pips">
        <span v-for="i in 2" :key="i" class="pip" :class="{ on: i <= powerPips, bad: powerAlert }" />
      </span>
      <em class="gauge-note">充电 +20（扣等量能源） · 进食 +4</em>
    </div>

    <div class="row">
      <span class="label">生理状态</span>
      <ol class="chips">
        <li v-for="s in BODY_STATES" :key="s" class="chip" :class="{ on: s === bodyState }">{{ s }}</li>
      </ol>
    </div>

    <div class="row">
      <span class="label">已解锁设施</span>
      <ol class="chips">
        <li
          v-for="f in allFacilities"
          :key="f"
          class="chip"
          :class="{ on: facilities.includes(f), off: !facilities.includes(f) }"
        >
          <i :class="facilities.includes(f) ? 'fa-solid fa-check' : 'fa-solid fa-xmark'" />
          {{ f }}
        </li>
      </ol>
    </div>
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
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 8px 9px;
  background: var(--c-surface-raised);
}

.power-gauge {
  display: flex;
  align-items: center;
  gap: 7px;
}

.gauge-label {
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.pips {
  display: inline-flex;
  gap: 3px;
}

.pip {
  width: 12px;
  height: 4px;
  background: var(--c-border);
  transition: background var(--t-hatch);
}

.pip.on {
  background: var(--c-power);
}

.pip.on.bad {
  background: var(--c-danger);
  animation: pulse-danger var(--t-warn) infinite;
}

.gauge-note {
  color: var(--c-text-muted);
  font-family: var(--font-mono);
  font-size: 9px;
  font-style: normal;
}

.row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 6px;
  border-top: 1px solid var(--c-border);
}

.label {
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.04em;
  border: 1px solid var(--c-border);
  transition:
    color var(--t-hatch),
    border-color var(--t-hatch);
}

.chip i {
  font-size: 8px;
}

.chip.on {
  color: var(--c-power-text);
  border-color: var(--c-power);
}

.chip.off {
  opacity: 0.6;
  border-style: dashed;
}
</style>
