<template>
  <div class="ledger" :class="theme">
    <!-- 标题栏：常驻，点击折叠/展开。做成一条极窄的票据，而不是通用的进度条卡片 -->
    <button class="rail" type="button" :aria-expanded="expanded" @click="expanded = !expanded">
      <StageBadge :stage="stage" :doomed="doomed" />

      <span class="ident">
        <strong class="ident-name">诸葛砜</strong>
        <span class="ident-where">{{ data.世界.当前地点 }}</span>
      </span>

      <span class="dream-flag" :class="{ lit: dreaming }">
        <i class="fa-solid fa-moon" />
        <em>{{ dreaming ? '共梦' : '无梦' }}</em>
      </span>

      <span class="gauge">
        <em class="gauge-label">失控度</em>
        <strong class="gauge-value">{{ reckless }}</strong>
        <span class="gauge-track">
          <span class="gauge-fill" :style="{ width: `${reckless}%` }" />
        </span>
      </span>

      <span class="stamp">
        <strong class="stamp-date">{{ time_parts.date }}</strong>
        <span class="stamp-time">{{ time_parts.time }}</span>
      </span>

      <i class="fa-solid fa-chevron-down caret" :class="{ up: expanded }" />
    </button>

    <!-- 情境条带：只在特定变量状态下出现 -->
    <div v-if="nightmare" class="band band-nightmare">
      <i class="fa-solid fa-bed-pulse" />
      <span>噩梦 · 她跟别人睡了的那一夜：梦里窒息、被围观、重复、挣脱不掉。</span>
    </div>

    <div v-if="active_ntr.length" class="band band-ntr">
      <i class="fa-solid fa-people-arrows" />
      <span>NTR 已激活：{{ active_ntr.map(d => `${d.code} ${d.name}`).join(' · ') }}</span>
    </div>

    <div v-if="doomed" class="band band-doomed">
      <i class="fa-solid fa-ghost" />
      <span>失控度 ≥ {{ DOOMED_THRESHOLD }}：她的梦开始出现「她已经不打算醒过来」的形态。</span>
    </div>

    <Transition name="panel">
      <div v-if="expanded" class="body">
        <HateDesireAxis :hate="hate" :desire="desire" />

        <div class="meters">
          <MeterRow
            label="信任度"
            :value="data.诸葛砜.信任度"
            color="var(--c-trust)"
            hint="决定她愿意让你知道多少、允许你靠近到哪一步，也是关系阶段的门槛之一。"
          />
          <MeterRow
            label="失控度"
            :value="data.诸葛砜.失控度"
            color="var(--c-reckless)"
            text-color="var(--c-reckless-text)"
            hint="自毁性决策 +5~10；噩梦（她当晚与别人发生关系）+10~15，且不受单次上限约束。"
          />
        </div>

        <StageLadder :stage="stage" />

        <DreamPanel :dream="data.共梦" />

        <NtrPanel :ntr="data.NTR" />

        <div class="grid">
          <WorldStrip :world="data.世界" />
          <PlayerPanel :player="data.玩家" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';
import DreamPanel from './components/DreamPanel.vue';
import HateDesireAxis from './components/HateDesireAxis.vue';
import MeterRow from './components/MeterRow.vue';
import NtrPanel from './components/NtrPanel.vue';
import PlayerPanel from './components/PlayerPanel.vue';
import StageBadge from './components/StageBadge.vue';
import StageLadder from './components/StageLadder.vue';
import WorldStrip from './components/WorldStrip.vue';
import { DOOMED_THRESHOLD, NTR_DIRECTIONS } from './constants';
import { useDataStore } from './store';
import { clamp, percent, split_time } from './utils';

const store = useDataStore();
const data = computed(() => store.data);

/**
 * 默认展开。
 *
 * 本卡对状态栏的硬要求是「每次回复都生成、置于对话最下方、内容露骨完整」，
 * 因此不允许把内容默认藏在折叠体里；玩家手动收起后由 localStorage 记住，
 * 换楼层、翻历史都不会自己弹回来。
 */
const expanded = useLocalStorage('迷梦:status_bar:expanded', true);

const stage = computed(() => clamp(Math.round(Number(data.value.诸葛砜.关系阶段)), 0, 3));
const hate = computed(() => percent(data.value.诸葛砜.恨意));
const desire = computed(() => percent(data.value.诸葛砜.欲望));
const reckless = computed(() => percent(data.value.诸葛砜.失控度));

const dreaming = computed(() => data.value.共梦.是否共梦 === true);
const nightmare = computed(() => dreaming.value && data.value.共梦.梦的色调 === '失控');
const doomed = computed(() => reckless.value >= DOOMED_THRESHOLD);

const active_ntr = computed(() => NTR_DIRECTIONS.filter(d => data.value.NTR[d.name] !== 'none'));

const time_parts = computed(() => split_time(data.value.世界.当前时间));

/**
 * 双线切换：明线（无梦的白天）与暗线（共梦后的那一天）用同一套结构，
 * 只换强调色与过渡曲线 —— 配色与节奏在 CSS 里，判在这里。
 */
const theme = computed(() => ({
  'is-dreaming': dreaming.value,
  'is-nightmare': nightmare.value,
  'is-doomed': doomed.value,
}));
</script>

<style lang="scss" scoped>
.ledger {
  position: relative;
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  overflow: hidden;
  transition: border-color var(--t-dream);
}

.is-nightmare {
  border-color: color-mix(in srgb, var(--c-hate) 55%, var(--c-border));
}

/* 暗线接管：共梦发生的那一天，整张卡渗出水汽；噩梦那一夜换成血色的 */
.ledger::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--t-dream);
  background:
    radial-gradient(120% 80% at 12% 0%, rgb(107 116 168 / 12%), transparent 60%),
    radial-gradient(100% 90% at 92% 100%, rgb(107 116 168 / 9%), transparent 62%);
}

.is-dreaming::after {
  opacity: 1;
}

.is-nightmare::after {
  background:
    radial-gradient(120% 80% at 12% 0%, rgb(142 43 48 / 17%), transparent 60%),
    radial-gradient(100% 90% at 92% 100%, rgb(142 43 48 / 12%), transparent 62%);
}

/* ── 标题栏 ─────────────────────────────────────────────────── */
.rail {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px 8px;
  background: transparent;
  border: 0;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.rail:hover {
  background: rgb(213 209 200 / 3%);
}

.ident {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
}

/* 衬线体标题：老钱、碑铭那种字体 */
.ident-name {
  font-family: var(--font-serif);
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0.16em;
  color: var(--c-gold);
}

.ident-where {
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.04em;
}

.dream-flag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.06em;
  transition: color var(--t-dream);
}

.dream-flag i {
  font-size: 10px;
}

.dream-flag em {
  font-style: normal;
}

.dream-flag.lit {
  color: var(--c-dream-text);
}

.is-nightmare .dream-flag.lit {
  color: var(--c-hate-text);
}

.gauge {
  display: grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  gap: 0 6px;
  flex: none;
}

.gauge-label {
  color: var(--c-text-muted);
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.08em;
}

.gauge-value {
  color: var(--c-reckless-text);
  font-size: 16px;
  font-variant-numeric: tabular-nums;
}

.gauge-track {
  grid-column: 1 / -1;
  position: relative;
  display: block;
  width: 74px;
  height: 3px;
  background: var(--c-border);
}

.gauge-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--c-reckless);
  transition: width var(--t-dream);
}

.is-doomed .gauge-value {
  color: var(--c-hate-text);
}

.is-doomed .gauge-fill {
  background: var(--c-hate);
}

.stamp {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: none;
  font-variant-numeric: tabular-nums;
}

.stamp-date {
  color: var(--c-primary);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.stamp-time {
  color: var(--c-gold);
  font-size: 12px;
  letter-spacing: 0.04em;
}

.caret {
  flex: none;
  color: var(--c-text-muted);
  font-size: 11px;
  transition: transform var(--t-hard);
}

.caret.up {
  transform: rotate(180deg);
}

/* ── 情境条带 ───────────────────────────────────────────────── */
.band {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  padding: 5px 12px;
  font-size: 11px;
  line-height: 1.5;
  border-top: 1px solid var(--c-border);
}

.band i {
  flex: none;
  margin-top: 2px;
  font-size: 10px;
}

.band-nightmare {
  background: rgb(142 43 48 / 15%);
  border-top-color: rgb(142 43 48 / 42%);
  color: var(--c-hate-text);
}

.band-ntr {
  background: rgb(180 98 42 / 12%);
  border-top-color: rgb(180 98 42 / 38%);
  color: var(--c-reckless-text);
}

.band-doomed {
  background: rgb(142 43 48 / 9%);
  border-top-color: rgb(142 43 48 / 30%);
  color: var(--c-hate-text);
}

.band-doomed i {
  animation: fade-ghost 2.6s ease-in-out infinite;
}

@keyframes fade-ghost {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

@media (prefers-reduced-motion: reduce) {
  .band-doomed i {
    animation: none;
  }
}

/* ── 展开区 ─────────────────────────────────────────────────── */
.body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 12px 13px;
  border-top: 1px solid var(--c-border);
}

.meters {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 10px;
  background: var(--c-surface-raised);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

/* 交互人格：明线硬切（她不会给你过渡），暗线延迟渐显（梦的滞后） */
.panel-enter-active,
.panel-leave-active {
  transition: opacity var(--t-hard);
}

.is-dreaming .panel-enter-active,
.is-dreaming .panel-leave-active {
  transition: opacity var(--t-dream);
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}
</style>
