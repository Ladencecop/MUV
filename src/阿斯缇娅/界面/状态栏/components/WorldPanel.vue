<script setup lang="ts">
import { computed } from 'vue';
import { radiationBand } from '../constants';
import Gauge from './Gauge.vue';

/**
 * 世界面板：时间、时段、区域、天气与辐射读数，加近期事务。
 *
 * 辐射分档的文案抄自变量更新规则.yaml，只作展示，不参与前端判定。
 */
const props = defineProps<{
  time: string;
  period: string;
  region: string;
  weather: string;
  radiation: number;
  affairs: string[];
}>();

/** 时间串格式为 YYYY/MM/DD-HH:MM，拆成日期与时刻两段显示 */
const parts = computed(() => {
  const raw = String(props.time ?? '');
  const [date, clock] = raw.split('-');
  return { date: date || raw, clock: clock || '' };
});

const band = computed(() => radiationBand(props.radiation));
</script>

<template>
  <div class="panel">
    <!-- ── 时空读数 ── -->
    <section class="block">
      <header class="block-head">
        <i class="fa-solid fa-compass" />
        <span class="stencil">环境</span>
        <em class="head-note">{{ region }}</em>
      </header>

      <dl class="readouts">
        <div>
          <dt>日期</dt>
          <dd class="mono">{{ parts.date }}</dd>
        </div>
        <div>
          <dt>时刻</dt>
          <dd class="mono gold">{{ parts.clock }}</dd>
        </div>
        <div>
          <dt>时段</dt>
          <dd>{{ period }}</dd>
        </div>
        <div>
          <dt>天气</dt>
          <dd>{{ weather }}</dd>
        </div>
      </dl>

      <div class="gauges">
        <Gauge label="辐射读数" :value="radiation" tone="rust" :threshold="50" :lower="false" />
      </div>
      <p class="band" :style="{ color: band.color }">{{ band.label }}</p>
    </section>

    <!-- ── 近期事务 ── -->
    <section class="block">
      <header class="block-head">
        <i class="fa-solid fa-clipboard-list" />
        <span class="stencil">近期事务</span>
        <em class="head-note">{{ affairs.length }} 条</em>
      </header>

      <ul v-if="affairs.length" class="ledger">
        <li v-for="(a, i) in affairs" :key="i">
          <span class="no">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="text">{{ a }}</span>
        </li>
      </ul>
      <p v-else class="empty">没有未结的事务。</p>
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
  color: var(--c-primary);
  font-size: 10px;
  font-style: normal;
  letter-spacing: 0.04em;
}

.readouts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(84px, 1fr));
  gap: 6px 10px;
  margin: 0;
  padding: 8px 9px;
  background: var(--c-surface-raised);
  border-left: 2px solid var(--c-border-hot);
}

.readouts > div {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.readouts dt {
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.readouts dd {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
}

.mono {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.gold {
  color: var(--c-amber-text);
}

.gauges {
  padding: 8px 9px;
  background: var(--c-surface-raised);
  border-left: 2px solid var(--c-border-hot);
}

.band {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.04em;
}

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
</style>
