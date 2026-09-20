<script setup lang="ts">
import { computed } from 'vue';
import { ENERGY_BANDS, FACILITIES, THRESHOLDS, pct } from '../constants';
import Gauge from './Gauge.vue';

/**
 * 基地车面板：能源、设施、停靠位置、车体状态、物资存量、改装记录。
 *
 * 能源是全卡唯一的资源数值，基地车运转与她充电共用同一池，
 * 所以这里把「维持这个家」与「让她保持战力」的争抢写成一句常驻提示。
 */
const props = defineProps<{
  energy: number;
  facilities: string[];
  location: string;
  bodyState: string;
  supplies: string[];
  records: string[];
}>();

const energyAlert = computed(() => props.energy < THRESHOLDS.energy);
const unlocked = computed(() => props.facilities.filter((f) => (FACILITIES as readonly string[]).includes(f)));
const progress = computed(() => pct((unlocked.value.length / FACILITIES.length) * 100));
</script>

<template>
  <div class="panel">
    <!-- ── 能源与设施 ── -->
    <section class="block">
      <header class="block-head">
        <i class="fa-solid fa-bolt" />
        <span class="stencil">能源</span>
        <em class="head-note" :class="{ alarm: energyAlert }">{{ energyAlert ? '见底' : '运转中' }}</em>
      </header>

      <div class="gauges">
        <Gauge label="能源储备" :value="energy" tone="power" :threshold="15" :lower="true" :bands="ENERGY_BANDS" />
      </div>

      <div class="progress">
        <span class="row-label stencil">设施解锁</span>
        <span class="track">
          <span class="fill" :style="{ width: `${progress}%` }" />
        </span>
        <em class="count">{{ unlocked.length }} / {{ FACILITIES.length }}</em>
      </div>

      <ol class="chips">
        <li
          v-for="f in FACILITIES"
          :key="f"
          class="chip"
          :class="{ on: facilities.includes(f), off: !facilities.includes(f) }"
        >
          <i :class="facilities.includes(f) ? 'fa-solid fa-check' : 'fa-solid fa-xmark'" />
          {{ f }}
        </li>
      </ol>

      <p class="rule">基地车运转与她充电共用同一池能源。能源紧时，给她充电就得停掉净水或温室。</p>
    </section>

    <!-- ── 位置与车况 ── -->
    <section class="block">
      <header class="block-head">
        <i class="fa-solid fa-location-crosshairs" />
        <span class="stencil">车身</span>
      </header>

      <dl class="facts">
        <div>
          <dt>停靠位置</dt>
          <dd class="mono">{{ location }}</dd>
        </div>
        <div>
          <dt>车体状态</dt>
          <dd>{{ bodyState }}</dd>
        </div>
      </dl>
    </section>

    <!-- ── 物资存量 ── -->
    <section class="block">
      <header class="block-head">
        <i class="fa-solid fa-boxes-stacked" />
        <span class="stencil">物资存量</span>
        <em class="head-note">{{ supplies.length }} 项</em>
      </header>

      <ul v-if="supplies.length" class="ledger">
        <li v-for="(s, i) in supplies" :key="i">
          <span class="no">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="text">{{ s }}</span>
        </li>
      </ul>
      <p v-else class="empty">车上什么都不剩了。</p>
      <p class="rule">物资不做数值。紧张与充裕只看这里的措辞。</p>
    </section>

    <!-- ── 改装与维修 ── -->
    <section class="block">
      <header class="block-head">
        <i class="fa-solid fa-screwdriver-wrench" />
        <span class="stencil">改装与维修</span>
        <em class="head-note">{{ records.length }} 条</em>
      </header>

      <ul v-if="records.length" class="ledger">
        <li v-for="(r, i) in records" :key="i">
          <span class="no">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="text">{{ r }}</span>
        </li>
      </ul>
      <p v-else class="empty">还没有动过手。工坊的台面上落着一层灰。</p>
      <p class="rule">这是「把基地车养成移动家园」与「修好她」两条长期目标的进度账。</p>
    </section>
  </div>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.block-head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--c-border);
  color: var(--c-text-muted);
  font-size: 10px;
}

.block-head i {
  font-size: 9px;
  color: var(--c-border-hot);
}

.head-note {
  margin-left: auto;
  color: var(--c-text-muted);
  font-size: 10px;
  font-style: normal;
  font-variant-numeric: tabular-nums;
}

.head-note.alarm {
  color: var(--c-danger-text);
  animation: pulse-danger var(--t-warn) infinite;
}

.gauges {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 8px 9px;
  background: var(--c-surface-raised);
  border-left: 2px solid var(--c-border-hot);
}

/* ── 设施进度 ── */
.progress {
  display: flex;
  align-items: center;
  gap: 7px;
}

.row-label {
  flex: none;
  color: var(--c-text-muted);
  font-size: 9px;
}

.track {
  position: relative;
  flex: 1 1 auto;
  height: 7px;
  background: var(--c-surface-sunken);
  border: 1px solid var(--c-border);
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
  font-size: 11px;
  font-style: normal;
  font-variant-numeric: tabular-nums;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.04em;
  border: 1px solid var(--c-border);
  background: var(--c-surface-sunken);
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
  background: color-mix(in srgb, var(--c-power) 12%, var(--c-surface-sunken));
}

.chip.off {
  opacity: 0.6;
  border-style: dashed;
}

/* ── 键值组 ── */
.facts {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
}

.facts > div {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.facts dt {
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.facts dd {
  margin: 0;
  padding-left: 7px;
  border-left: 2px solid var(--c-rust);
  font-size: 11px;
  line-height: 1.55;
}

.facts dd.mono {
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
}

/* ── 清单 ── */
.ledger {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ledger li {
  display: flex;
  align-items: baseline;
  gap: 7px;
}

.no {
  flex: none;
  color: var(--c-border-hot);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
}

.text {
  font-size: 11px;
  line-height: 1.55;
}

.empty {
  margin: 0;
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.5;
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
