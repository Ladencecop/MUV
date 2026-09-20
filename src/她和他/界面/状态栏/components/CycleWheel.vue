<template>
  <div class="sb-block">
    <header class="sb-head">
      <i class="fa-solid fa-egg" />
      <span>生理周期与怀孕</span>
      <em class="sb-note">4 天一轮</em>
    </header>

    <div class="wheel-row">
      <!-- 环形轨道用 conic-gradient 绘制：不依赖 SVG，任何渲染环境都能画出来 -->
      <div class="ring" role="img" :aria-label="`第 ${phase.day} 天，${phase.key}`">
        <span class="ring-layer ring-all" :style="{ background: ring_all }" />
        <span class="ring-layer ring-active" :style="{ background: ring_active }" />
        <span class="ring-hole">
          <span class="ring-day">第 {{ phase.day }} 天</span>
          <span class="ring-phase" :style="{ color: phase.color }">{{ phase.key }}</span>
        </span>
      </div>

      <ul class="legend">
        <li
          v-for="item in PHASES"
          :key="item.key"
          :class="{ on: item.key === phase.key }"
          :style="{ '--seg': item.color }"
        >
          <span class="tick" />
          <span class="legend-name">{{ item.day }} {{ item.key }}</span>
        </li>
      </ul>
    </div>

    <p class="phase-note">{{ phase.note }}</p>

    <div class="conception-row">
      <span class="conception-label">怀孕概率</span>
      <span class="sb-bar">
        <span class="fill-conception" :style="{ width: percent_of(pregnancy.怀孕概率) }" />
      </span>
      <em class="conception-value" :class="{ marked: pregnancy.怀孕概率 > 0 }">{{ pregnancy.怀孕概率 }}%</em>
    </div>

    <dl class="sb-facts">
      <div>
        <dt>胚胎数量</dt>
        <dd :class="{ conceived: pregnancy.胚胎数量 > 0 }">{{ pregnancy.胚胎数量 }}</dd>
      </div>
      <div>
        <dt>本阶段系数</dt>
        <dd>每 ml {{ phase.coefficient }}</dd>
      </div>
      <div>
        <dt>判定时刻</dt>
        <dd>8:00 / 10:00 / 14:00 / 16:00 / 20:00</dd>
      </div>
    </dl>

    <div class="deposits">
      <span class="deposits-head">
        <i class="fa-solid fa-tint" />
        体内精液记录
        <em>共 {{ deposits.length }} 条</em>
      </span>
      <ul v-if="deposits.length" class="deposit-list">
        <li v-for="item in deposits" :key="item.key">
          <span class="d-time">{{ item.时间 }}</span>
          <span class="d-amount">{{ item.毫升数 }} ml</span>
          <span class="d-phase" :style="{ color: phase_meta_of(item.生理期阶段).color }">{{ item.生理期阶段 }}</span>
          <span class="d-uterus" :class="{ yes: item.是否入子宫 }">{{ item.是否入子宫 ? '已入子宫' : '未入子宫' }}</span>
        </li>
      </ul>
      <p v-else class="sb-empty">还没有记录到内射。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Schema } from '../../../schema';
import { PHASES, percent_of, phase_meta_of } from '../constants';

const props = defineProps<{
  /** 千羽.生理周期 */
  cycle: Schema['千羽']['生理周期'];
  /** 千羽.怀孕 */
  pregnancy: Schema['千羽']['怀孕'];
}>();

/** 每段弧之间留出的空隙（度） */
const SEGMENT_GAP = 5;

const phase = computed(() => phase_meta_of(props.cycle._生理期阶段));

/** 把四天一轮画成一个从 12 点方向起、顺时针铺满 360 度的环形渐变。 */
function conic_gradient(pick: (index: number) => string | null): string {
  const stops: string[] = [];
  PHASES.forEach((_, index) => {
    const start = index * 90;
    const end = start + 90 - SEGMENT_GAP;
    const color = pick(index);
    stops.push(color ? `${color} ${start}deg ${end}deg` : `transparent ${start}deg ${end}deg`);
    stops.push(`transparent ${end}deg ${start + 90}deg`);
  });
  return `conic-gradient(from -90deg, ${stops.join(', ')})`;
}

/** 底色层：四段都上各自的阶段色，整体压低透明度当轨道 */
const ring_all = computed(() => conic_gradient(index => PHASES[index].color));

/** 高亮层：只画当前阶段那一段 */
const ring_active = computed(() => {
  const current = PHASES.findIndex(item => item.key === phase.value.key);
  return conic_gradient(index => (index === current ? PHASES[index].color : null));
});

/** 精液明细按注入顺序倒序展示，界面最多列 8 条。 */
const deposits = computed(() =>
  _(props.pregnancy.体内精液)
    .toPairs()
    .map(([key, value]) => ({ key, ...value }))
    .orderBy(item => item.$time, 'desc')
    .take(8)
    .value(),
);
</script>

<style scoped>
.wheel-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ring {
  position: relative;
  flex: none;
  width: 92px;
  height: 92px;
  border-radius: 50%;
}

.ring-layer {
  position: absolute;
  inset: 0;
  border-radius: 50%;
}

.ring-all {
  opacity: 0.32;
}

.ring-active {
  opacity: 1;
}

.ring-hole {
  position: absolute;
  inset: 11px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--c-surface);
}

.ring-day {
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.08em;
}

.ring-phase {
  font-size: 13px;
  letter-spacing: 0.04em;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.legend li {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.42;
  transition: opacity 300ms ease;
}

.legend li.on {
  opacity: 1;
}

.tick {
  width: 10px;
  height: 3px;
  background: var(--seg);
}

.legend-name {
  color: var(--c-text-muted);
  font-size: 10px;
}

.legend li.on .legend-name {
  color: var(--seg);
}

.phase-note {
  margin: 0;
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.4;
}

.conception-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 4px;
  border-top: 1px solid var(--c-border);
}

.conception-label {
  flex: none;
  width: 52px;
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.fill-conception {
  background: var(--c-warning);
}

.conception-value {
  flex: none;
  min-width: 46px;
  font-size: 11px;
  font-style: normal;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.marked {
  color: var(--c-warning);
}

.conceived {
  color: var(--c-danger);
}

.deposits {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 5px;
  border-top: 1px solid var(--c-border);
}

.deposits-head {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.08em;
}

.deposits-head em {
  margin-left: auto;
  font-style: normal;
  opacity: 0.8;
}

.deposit-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.deposit-list li {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 8px;
  align-items: baseline;
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}

.d-time {
  color: var(--c-text-muted);
}

.d-amount {
  color: var(--c-arousal);
}

.d-uterus {
  color: var(--c-text-muted);
}

.d-uterus.yes {
  color: var(--c-warning);
}
</style>
