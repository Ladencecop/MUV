<template>
  <div class="statusbar" :class="theme_class">
    <!-- 情境层：贴在标题栏上方，只在阈值命中时出现 -->
    <Transition name="band">
      <div v-if="festival_on" class="band band-festival">
        <i class="fa-solid fa-bullhorn" />
        <span class="band-title">狂欢节进行中 · {{ data.世界.狂欢节模式 }}</span>
        <span class="band-note">全市不得穿着衣物 · 触碰不可拒绝 · 邀约不可干涉</span>
      </div>
    </Transition>

    <Transition name="band">
      <div v-if="conception_alert" class="band band-conception">
        <i class="fa-solid fa-egg" />
        <span class="band-title">宫内记录</span>
        <span class="band-note">怀孕概率 {{ data.千羽.怀孕.怀孕概率 }}% · 胚胎 {{ data.千羽.怀孕.胚胎数量 }}</span>
      </div>
    </Transition>

    <Transition name="band">
      <div v-if="loyalty_open" class="band band-loyalty">
        <i class="fa-solid fa-exclamation-triangle" />
        <span class="band-title">忠诚度 {{ data.千羽.忠诚度 }}</span>
        <span class="band-note">{{ band.title }} · {{ band.detail }}</span>
      </div>
    </Transition>

    <!-- 标题栏：始终可见 -->
    <button class="header" type="button" @click="expanded = !expanded">
      <span class="badge">
        <i class="fa-solid fa-feather" />
      </span>

      <span class="subject">
        <strong class="subject-name">{{ SUBJECT_NAME }}</strong>
        <span class="subject-stage" :style="{ color: stage_color }">{{ stage_name }}</span>
      </span>

      <span class="loyalty">
        <em class="stat-label"><i class="fa-solid fa-shield-alt" /> 忠诚度</em>
        <strong class="stat-value" :style="{ color: band.color }">{{ data.千羽.忠诚度 }}</strong>
        <LoyaltyRuler class="loyalty-ruler" :loyalty="data.千羽.忠诚度" />
      </span>

      <span class="heart">
        <em class="stat-label"><i class="fa-solid fa-heartbeat" /> 心动感</em>
        <strong class="stat-value heart-value">{{ data.千羽.心动感 }}</strong>
      </span>

      <span class="clock">
        <em class="stat-label"><i class="fa-solid fa-clock" /> 时间与地点</em>
        <strong class="clock-date">{{ time_parts.date }}</strong>
        <span class="clock-line">{{ time_parts.time }} · {{ data.世界.当前地点 }}</span>
      </span>

      <i class="fa-solid fa-chevron-down caret" :class="{ up: expanded }" />
    </button>

    <!-- 展开区 -->
    <Transition name="panel">
      <div v-if="expanded" class="body">
        <div class="grid">
          <StageLadder :stage="data.千羽.关系阶段" :goal="data.剧情.当前阶段目标" />
          <BodyPanel :body="data.千羽.身体状态" />
        </div>

        <div class="grid">
          <CycleWheel :cycle="data.千羽.生理周期" :pregnancy="data.千羽.怀孕" />
          <div class="stack">
            <div class="sb-block">
              <header class="sb-head">
                <i class="fa-solid fa-shield-alt" />
                <span>忠诚度 · 接受范围</span>
                <em class="sb-note">档位决定她对陌生人的边界</em>
              </header>
              <LoyaltyRuler :loyalty="data.千羽.忠诚度" detailed />
            </div>
            <DreamChoice :dream="data.千羽.梦境选择" />
          </div>
        </div>

        <div class="grid">
          <ExperienceLedger :experience="data.千羽.性经验" />
          <HouseholdPanel
            :spouses="data.玩家.领证妻室"
            :remaining="data.玩家._剩余名额"
            :exposure="data.玩家.黑道身份暴露"
          />
        </div>

        <WorldStrip :weather="data.世界.天气" :events="data.剧情.关键事件记录" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BodyPanel from './components/BodyPanel.vue';
import CycleWheel from './components/CycleWheel.vue';
import DreamChoice from './components/DreamChoice.vue';
import ExperienceLedger from './components/ExperienceLedger.vue';
import HouseholdPanel from './components/HouseholdPanel.vue';
import LoyaltyRuler from './components/LoyaltyRuler.vue';
import StageLadder from './components/StageLadder.vue';
import WorldStrip from './components/WorldStrip.vue';
import { STAGE_COLORS, STAGE_DISPLAY_MAX, STAGE_LADDER, SUBJECT_NAME, loyalty_band_of } from './constants';
import { useDataStore } from './store';

const store = useDataStore();
const data = computed(() => store.data);

const expanded = useLocalStorage('她和他:status_bar:expanded', true);

const loyalty = computed(() => Number(data.value.千羽.忠诚度) || 0);
const band = computed(() => loyalty_band_of(loyalty.value));

const display_stage = computed(() => _.clamp(Math.round(data.value.千羽.关系阶段), 0, STAGE_DISPLAY_MAX));
const stage_name = computed(() => STAGE_LADDER[display_stage.value].name);
const stage_color = computed(() => STAGE_COLORS[display_stage.value]);

const festival_on = computed(() => data.value.世界.狂欢节进行中 === true);
const conception_alert = computed(
  () => Number(data.value.千羽.怀孕.怀孕概率) > 0 || Number(data.value.千羽.怀孕.胚胎数量) > 0,
);
/** 忠诚度跌破 85 之后，第一档接受范围就已经放开，值得单独提出来说一句。 */
const loyalty_open = computed(() => loyalty.value < 85);

/** 时间格式固定为 YYYY/MM/DD-HH:MM，拆成日期与时刻两段。 */
const time_parts = computed(() => {
  const raw = String(data.value.世界.当前时间 ?? '');
  const [date, time] = raw.split('-');
  return { date: date || raw, time: time || '' };
});

/** 交互人格：关系阶段 2 起色调转暖，硬切转渐显；逾越阈值时状态栏整体换边。 */
const theme_class = computed(() => ({
  'is-festival': festival_on.value,
  'is-thawed': display_stage.value >= 2,
  'is-climaxing': Number(data.value.千羽.身体状态.高潮次数) > 0,
  'is-open': loyalty_open.value,
}));
</script>

<style scoped>
.statusbar {
  position: relative;
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  overflow: hidden;
  transition:
    border-color 500ms ease,
    box-shadow 500ms ease;
}

.statusbar.is-open {
  border-color: rgb(217 164 65 / 45%);
}

.statusbar.is-climaxing {
  box-shadow: inset 0 0 26px rgb(210 86 143 / 12%);
}

.statusbar.is-festival {
  border-color: var(--c-festival);
  box-shadow: inset 0 0 34px rgb(192 108 240 / 16%);
}

/* ── 情境横带 ───────────────────────────────────────────────── */

.band {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 14px;
  font-size: 11px;
  letter-spacing: 0.03em;
  border-bottom: 1px solid currentcolor;
}

.band i {
  flex: none;
  font-size: 10px;
}

.band-title {
  flex: none;
}

.band-note {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.85;
}

.band-festival {
  background: rgb(192 108 240 / 14%);
  color: var(--c-festival);
}

.band-conception {
  background: rgb(217 164 65 / 12%);
  color: var(--c-warning);
}

.band-loyalty {
  background: rgb(224 84 95 / 12%);
  color: var(--c-danger);
}

/* ── 标题栏 ─────────────────────────────────────────────────── */

.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  width: 100%;
  padding: 10px 14px;
  background: transparent;
  border: 0;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.header:hover {
  background: rgb(211 219 228 / 3%);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 30px;
  height: 30px;
  border: 1px solid var(--c-border);
  color: var(--c-accent);
  font-size: 12px;
}

.subject {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: none;
  min-width: 88px;
}

.subject-name {
  font-size: 15px;
  letter-spacing: 0.08em;
}

.subject-stage {
  font-size: 11px;
  letter-spacing: 0.04em;
  transition: color 500ms ease;
}

.loyalty {
  display: grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  gap: 0 6px;
  flex: 1 1 150px;
  min-width: 140px;
}

.loyalty-ruler {
  grid-column: 1 / -1;
}

.stat-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--c-text-muted);
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.08em;
}

.stat-label i {
  font-size: 8px;
}

.stat-value {
  font-size: 16px;
  font-variant-numeric: tabular-nums;
  transition: color 400ms ease;
}

.heart {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: none;
}

.heart-value {
  color: var(--c-accent);
}

.clock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0;
  flex: none;
  min-width: 140px;
  font-variant-numeric: tabular-nums;
}

.clock-date {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.clock-line {
  color: var(--c-accent);
  font-size: 11px;
  letter-spacing: 0.03em;
}

.caret {
  flex: none;
  margin-left: auto;
  color: var(--c-text-muted);
  font-size: 11px;
  transition: transform 200ms ease;
}

.caret.up {
  transform: rotate(180deg);
}

/* ── 展开区 ─────────────────────────────────────────────────── */

.body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 14px 14px;
  border-top: 1px solid var(--c-border);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(268px, 1fr));
  gap: 12px 16px;
  align-items: start;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

/* ── 过渡 ───────────────────────────────────────────────────── */

.band-enter-active,
.band-leave-active {
  transition: opacity 200ms ease;
}

.band-enter-from,
.band-leave-to {
  opacity: 0;
}

.panel-enter-active,
.panel-leave-active {
  transition: opacity 120ms linear;
}

.is-thawed .panel-enter-active,
.is-thawed .panel-leave-active {
  transition: opacity 320ms ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}
</style>
