<script setup lang="ts">
import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { FACILITIES, STAGE_COLORS, STAGE_GATES, STAGE_TEXT_COLORS, THRESHOLDS, pct } from './constants';
import { useDataStore } from './store';
import BodyPanel from './components/BodyPanel.vue';
import GenitalPanel from './components/GenitalPanel.vue';
import RelationPanel from './components/RelationPanel.vue';
import VehiclePanel from './components/VehiclePanel.vue';
import WombPanel from './components/WombPanel.vue';

/**
 * 《阿斯缇娅》状态栏。
 *
 * 结构：警戒带（情境可见）+ 标题栏（始终可见，点击折叠）+ 展开区（网格）。
 * 视觉基调、语义配色、组件树草图的依据见 cards/阿斯缇娅/design-spec.md 的「UI 设计」段。
 *
 * 本界面只读，不写回 MVU 变量。
 */
const store = useDataStore();
const data = computed(() => store.data);

/** 折叠状态存本地，切楼层也保持玩家的选择 */
const expanded = useLocalStorage('阿斯缇娅:status_bar:expanded', true);

const stage = computed(() => String(data.value.阿斯缇娅.关系阶段));
const stageIndex = computed(() => {
  const i = (STAGE_GATES as readonly { name: string }[]).findIndex((s) => s.name === stage.value);
  return i < 0 ? 0 : i;
});
const stageColor = computed(() => STAGE_COLORS[stageIndex.value]);
const stageTextColor = computed(() => STAGE_TEXT_COLORS[stageIndex.value]);

const power = computed(() => Number(data.value.阿斯缇娅.机体.电量) || 0);
const wear = computed(() => Number(data.value.阿斯缇娅.机体.机体损耗) || 0);
const affection = computed(() => Number(data.value.阿斯缇娅.好感度) || 0);
const energy = computed(() => Number(data.value.基地车.能源储备) || 0);

const powerAlert = computed(() => power.value < THRESHOLDS.power);
const wearAlert = computed(() => wear.value > THRESHOLDS.wear);
const energyAlert = computed(() => energy.value < THRESHOLDS.energy);

/** 低电量时她不会进入情事，因此亲密相关的两块压暗 */
const bodyInactive = computed(() => powerAlert.value);

/** 时间串 YYYY/MM/DD-HH:MM 拆成日期与时刻 */
const clock = computed(() => {
  const raw = String(data.value.世界.当前时间 ?? '');
  const [date, time] = raw.split('-');
  return { date: date || raw, time: time || '' };
});

const alerts = computed(() =>
  [
    powerAlert.value && { icon: 'fa-battery-quarter', text: `电量 ${power.value}`, note: '低于 30，动作与反应都会变钝' },
    wearAlert.value && { icon: 'fa-screwdriver-wrench', text: `机体损耗 ${wear.value}`, note: '高于 60，需要一次维护' },
    energyAlert.value && { icon: 'fa-bolt', text: `能源储备 ${energy.value}`, note: '低于 15，给她充电就得停掉净水或温室' },
  ].filter(Boolean) as { icon: string; text: string; note: string }[],
);
</script>

<template>
  <div class="statusbar" :class="{ 'is-alert': alerts.length > 0 }">
    <!-- 警戒带：只在阈值命中时出现，三条互不相关，可并存 -->
    <TransitionGroup name="band" tag="div" class="bands">
      <div v-for="a in alerts" :key="a.text" class="band">
        <i class="fa-solid" :class="a.icon" />
        <span class="band-title">{{ a.text }}</span>
        <span class="band-note">{{ a.note }}</span>
      </div>
    </TransitionGroup>

    <!-- 标题栏：始终可见 -->
    <button class="header" type="button" @click="expanded = !expanded">
      <span class="badge" :style="{ borderColor: stageColor, color: stageTextColor }">
        <i class="fa-solid fa-gear" />
      </span>

      <span class="ident">
        <strong class="ident-name">阿斯缇娅</strong>
        <span class="ident-stage" :style="{ color: stageTextColor }">{{ stage }}</span>
      </span>

      <span class="stat">
        <em class="stat-label"><i class="fa-solid fa-battery-half" /> 电量</em>
        <strong class="stat-value mono" :class="{ bad: powerAlert }">{{ power }}</strong>
        <span class="stat-track">
          <span
            class="stat-fill"
            :class="{ bad: powerAlert }"
            :style="{ width: `${pct(power)}%`, background: powerAlert ? 'var(--c-danger)' : 'var(--c-power)' }"
          />
        </span>
      </span>

      <span class="stat">
        <em class="stat-label"><i class="fa-solid fa-heart" /> 好感度</em>
        <strong class="stat-value mono" :style="{ color: 'var(--c-amber-text)' }">{{ affection }}</strong>
        <span class="stat-track">
          <span class="stat-fill" :style="{ width: `${pct(affection)}%`, background: 'var(--c-amber)' }" />
        </span>
      </span>

      <span class="clock">
        <em class="stat-label"><i class="fa-solid fa-clock" /> 时间与区域</em>
        <strong class="clock-date mono">{{ clock.date }}</strong>
        <span class="clock-sub mono">{{ clock.time }} · {{ data.世界.当前区域 }}</span>
      </span>

      <i class="fa-solid fa-chevron-down caret" :class="{ up: expanded }" />
    </button>

    <!-- 展开区 -->
    <Transition name="panel">
      <div v-if="expanded" class="body">
        <div class="grid">
          <RelationPanel
            :stage="stage"
            :affection="affection"
            :trust="Number(data.阿斯缇娅.信任度) || 0"
            :intimacy="Number(data.阿斯缇娅.亲密度) || 0"
            :intimacy-state="String(data.阿斯缇娅.亲密状态)"
          />
          <BodyPanel
            :power="power"
            :wear="wear"
            :body-state="String(data.阿斯缇娅.生理状态.当前状态)"
            :facilities="data.基地车.已解锁设施"
            :all-facilities="FACILITIES"
          />
        </div>

        <div class="grid">
          <GenitalPanel
            :shape="String(data.阿斯缇娅.生理状态.小穴.外形)"
            :color="String(data.阿斯缇娅.生理状态.小穴.颜色)"
            :state="String(data.阿斯缇娅.生理状态.小穴.状态)"
            :wetness="Number(data.阿斯缇娅.生理状态.小穴.湿润度) || 0"
            :climax-count="Number(data.阿斯缇娅.生理状态.小穴.高潮次数) || 0"
            :semen="data.阿斯缇娅.生理状态.小穴.体内精液"
            :total="Number(data.阿斯缇娅.生理状态.小穴._含量) || 0"
            :inactive="bodyInactive"
          />
          <div class="stack">
            <WombPanel
              :state="String(data.阿斯缇娅.生理状态.子宫.状态)"
              :chance="Number(data.阿斯缇娅.生理状态.子宫.受孕概率) || 0"
              :embryos="Number(data.阿斯缇娅.生理状态.子宫.胚胎数量) || 0"
              :depth="String(data.阿斯缇娅.生理状态.子宫.着床深度)"
              :inside="Number(data.阿斯缇娅.生理状态.子宫.宫内精液) || 0"
              :inactive="bodyInactive"
            />
            <VehiclePanel
              :energy="energy"
              :facilities="data.基地车.已解锁设施"
              :all-facilities="FACILITIES"
            />
          </div>
        </div>

        <WorldPanel
          :time="String(data.世界.当前时间)"
          :period="String(data.世界.时间段)"
          :region="String(data.世界.当前区域)"
          :weather="String(data.世界.天气与辐射.weather)"
          :radiation="Number(data.世界.天气与辐射.radiation) || 0"
          :affairs="data.世界.近期事务"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.statusbar {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  overflow: hidden;
  transition: border-color var(--t-hatch);
}

.is-alert {
  border-color: color-mix(in srgb, var(--c-danger) 55%, var(--c-border));
  animation: rattle 3.4s ease-in-out infinite;
}

/* ── 警戒带 ── */
.bands {
  display: flex;
  flex-direction: column;
}

.band {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 12px;
  background: rgba(184, 69, 63, 0.14);
  border-bottom: 1px solid rgba(184, 69, 63, 0.38);
  color: var(--c-danger-text);
  font-size: 11px;
  line-height: 1.5;
}

.band i {
  flex: none;
  font-size: 10px;
  animation: pulse-danger var(--t-warn) infinite;
}

.band-title {
  flex: none;
  letter-spacing: 0.04em;
}

.band-note {
  color: var(--c-text-muted);
  font-size: 10px;
}

.band-enter-active,
.band-leave-active {
  transition: opacity var(--t-hatch);
}

.band-enter-from,
.band-leave-to {
  opacity: 0;
}

/* ── 标题栏 ── */
.header {
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

.header:hover {
  background: rgba(201, 198, 189, 0.03);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 22px;
  height: 22px;
  font-size: 11px;
  border: 1px solid;
  transition:
    color var(--t-hatch),
    border-color var(--t-hatch);
}

.ident {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
}

.ident-name {
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0.16em;
  color: var(--c-amber-text);
}

.ident-stage {
  font-size: 10px;
  letter-spacing: 0.06em;
  transition: color var(--t-hatch);
}

.stat {
  display: grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  gap: 0 6px;
  flex: none;
}

.stat-label {
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
}

.stat-value.bad {
  color: var(--c-danger-text);
  animation: pulse-danger var(--t-warn) infinite;
}

.stat-track {
  grid-column: 1 / -1;
  position: relative;
  display: block;
  width: 68px;
  height: 3px;
  background: var(--c-border);
}

.stat-fill {
  position: absolute;
  inset: 0 auto 0 0;
  transition: width var(--t-hatch);
}

.stat-fill.bad {
  animation: pulse-danger var(--t-warn) infinite;
}

.clock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: none;
  font-variant-numeric: tabular-nums;
}

.clock-date {
  font-size: 11px;
  font-weight: 400;
  color: var(--c-primary);
  letter-spacing: 0.02em;
}

.clock-sub {
  color: var(--c-amber-text);
  font-size: 10px;
  letter-spacing: 0.02em;
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

.mono {
  font-family: var(--font-mono);
}

/* ── 展开区 ── */
.body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border-top: 1px solid var(--c-border);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(248px, 1fr));
  gap: 12px;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-enter-active,
.panel-leave-active {
  transition: opacity var(--t-hatch);
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}
</style>
