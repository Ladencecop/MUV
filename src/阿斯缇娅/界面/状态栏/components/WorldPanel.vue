<script setup lang="ts">
import { computed } from 'vue';
import { radiationBand } from '../constants';

/**
 * 世界面板：时间、区域、天气与辐射读数，加近期事务列表。
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
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-location-crosshairs" />
      <span>世界</span>
      <em class="hint">{{ region }}</em>
    </header>

    <dl class="facts">
      <div>
        <dt>时间</dt>
        <dd class="mono">
          {{ parts.date }}
          <span class="clock">{{ parts.clock }}</span>
        </dd>
      </div>
      <div>
        <dt>时段</dt>
        <dd>{{ period }}</dd>
      </div>
      <div>
        <dt>天气</dt>
        <dd>{{ weather }}</dd>
      </div>
      <div>
        <dt>辐射读数</dt>
        <dd class="mono" :style="{ color: band.color }">{{ radiation }}</dd>
      </div>
      <div class="wide">
        <dt>辐射分档</dt>
        <dd :style="{ color: band.color }">{{ band.label }}</dd>
      </div>
    </dl>

    <div class="affairs">
      <div class="affairs-head">
        <i class="fa-solid fa-clipboard-list" />
        <span>近期事务</span>
        <em>{{ affairs.length }} 条</em>
      </div>
      <ul v-if="affairs.length" class="affairs-list">
        <li v-for="(a, i) in affairs" :key="i">
          <span class="no">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="text">{{ a }}</span>
        </li>
      </ul>
      <p v-else class="empty">没有未结的事务。</p>
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
  color: var(--c-primary);
  font-size: 10px;
  font-style: normal;
  letter-spacing: 0.04em;
}

.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
  gap: 5px 10px;
  margin: 0;
  padding: 8px 9px;
  background: var(--c-surface-raised);
}

.facts > div {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.facts .wide {
  grid-column: 1 / -1;
}

.facts dt {
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.facts dd {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
}

.mono {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.clock {
  margin-left: 5px;
  color: var(--c-amber-text);
}

.affairs {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 6px;
  border-top: 1px solid var(--c-border);
}

.affairs-head {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.affairs-head em {
  margin-left: auto;
  font-style: normal;
  font-variant-numeric: tabular-nums;
}

.affairs-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.affairs-list li {
  display: flex;
  align-items: baseline;
  gap: 7px;
}

.no {
  flex: none;
  color: var(--c-text-muted);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.04em;
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
