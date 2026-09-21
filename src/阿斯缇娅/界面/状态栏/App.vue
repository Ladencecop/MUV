<script setup lang="ts">
import { computed } from 'vue';
import { STAGE_GATES, STAGE_KEYS, THRESHOLDS } from './constants';
import { useDataStore } from './store';
import { widthPct } from './styles';
import Hatch from './components/Hatch.vue';
import HerPanel from './components/HerPanel.vue';
import VehiclePanel from './components/VehiclePanel.vue';
import WorldPanel from './components/WorldPanel.vue';

/**
 * 《阿斯缇娅》状态栏。
 *
 * 结构：铭牌（常驻）+ 警戒带（情境可见）+ 三个父折叠（阿斯缇娅 / 基地车 / 世界）。
 * 父折叠默认收起，各自记住开合状态 —— 一屏只看到铭牌与三个舱盖手柄。
 *
 * 视觉与阈值的依据见 cards/阿斯缇娅/ui-design.md。
 * 本界面只读，不写回 MVU 变量。
 */
const store = useDataStore();
const data = computed(() => store.data);

const her = computed(() => data.value.阿斯缇娅);
const car = computed(() => data.value.基地车);
const world = computed(() => data.value.世界);

/* ── 誓约 ── */
const stage = computed(() => String(her.value.关系阶段));
const stageIndex = computed(() => {
  const i = (STAGE_GATES as readonly { name: string }[]).findIndex((s) => s.name === stage.value);
  return i < 0 ? 0 : i;
});
const stageKey = computed(() => STAGE_KEYS[stageIndex.value]);

/* ── 读数 ── */
const power = computed(() => Number(her.value.机体.电量) || 0);
const wear = computed(() => Number(her.value.机体.机体损耗) || 0);
const affection = computed(() => Number(her.value.好感度) || 0);
const trust = computed(() => Number(her.value.信任度) || 0);
const energy = computed(() => Number(car.value.能源储备) || 0);
const intimacy = computed(() => Number(her.value.亲密.数值) || 0);
const intimacyState = computed(() => String(her.value.亲密.状态));
const bodyState = computed(() => String(her.value.身体.生理状态));
/* 誓约两档 + 缔结日期。旧存档没有这个字段时退回未缔结，界面不报错 */
const oathState = computed(() => String(her.value.誓约?.状态 ?? '未缔结'));
const oathDate = computed(() => String(her.value.誓约?.日期 ?? ''));

const powerAlert = computed(() => power.value < THRESHOLDS.power);
const wearAlert = computed(() => wear.value > THRESHOLDS.wear);
const energyAlert = computed(() => energy.value < THRESHOLDS.energy);
/** 低电量时她不会进入情事，机体说明整体压暗 */
const dimBody = computed(() => powerAlert.value);

/* ── 时间串 YYYY/MM/DD-HH:MM 拆成日期与时刻 ── */
const clock = computed(() => {
  const raw = String(world.value.当前时间 ?? '');
  const [date, time] = raw.split('-');
  return { date: date || raw, time: time || '' };
});

/* ── 警戒带：四条互不相关，可并存 ── */
const alerts = computed(
  () =>
    [
      powerAlert.value && {
        icon: 'fa-battery-quarter',
        text: `电量 ${power.value}`,
        note: '低于 30，动作与反应都会变钝',
      },
      wearAlert.value && {
        icon: 'fa-screwdriver-wrench',
        text: `机体损耗 ${wear.value}`,
        note: '高于 60，需要一次维护',
      },
      energyAlert.value && {
        icon: 'fa-bolt',
        text: `能源储备 ${energy.value}`,
        note: '低于 15，给她充电就得停掉净水或温室',
      },
      bodyState.value !== '常态' && {
        icon: 'fa-circle-exclamation',
        text: `生理状态 ${bodyState.value}`,
        note: '她此刻不在常态',
      },
    ].filter(Boolean) as { icon: string; text: string; note: string }[],
);

/* ── 父折叠手柄上的短标注 ── */
const herNote = computed(() => `${stage.value} · 亲密 ${intimacy.value}`);
const carNote = computed(() => {
  const list = (car.value.已解锁设施 || []).filter((f) =>
    (['净水', '温室', '工坊', '医疗舱'] as string[]).includes(f),
  );
  return `能源 ${energy.value} · 设施 ${list.length}/4`;
});
const worldNote = computed(
  () => `${String(world.value.当前区域)} · 辐射 ${Number(world.value.天气与辐射.radiation) || 0}`,
);
</script>

<template>
  <div class="statusbar" :class="{ 'is-alert': alerts.length > 0, dim: dimBody }">
    <!-- ══ 铭牌：常驻 ══ -->
    <header class="masthead">
      <span class="plate" :class="`stage-${stageKey}`">
        <i class="fa-solid fa-gear" />
      </span>

      <div class="ident">
        <strong class="ident-name stencil">阿斯缇娅</strong>
        <span class="ident-stage" :class="`stage-${stageKey}`">{{ stage }}</span>
      </div>

      <div class="stat">
        <em class="stat-label stencil"><i class="fa-solid fa-battery-half" /> 电量</em>
        <strong class="stat-value" :class="{ bad: powerAlert }">{{ power }}</strong>
        <span class="stat-track">
          <span class="stat-fill" :class="powerAlert ? 'fill-danger' : 'fill-power'" :style="{ width: widthPct(power) }" />
        </span>
      </div>

      <div class="stat">
        <em class="stat-label stencil"><i class="fa-solid fa-heart" /> 好感度</em>
        <strong class="stat-value amber">{{ affection }}</strong>
        <span class="stat-track">
          <span class="stat-fill fill-amber" :style="{ width: widthPct(affection) }" />
        </span>
      </div>

      <div class="stat">
        <em class="stat-label stencil"><i class="fa-solid fa-bolt" /> 能源</em>
        <strong class="stat-value" :class="{ bad: energyAlert }">{{ energy }}</strong>
        <span class="stat-track">
          <span class="stat-fill" :class="energyAlert ? 'fill-danger' : 'fill-power'" :style="{ width: widthPct(energy) }" />
        </span>
      </div>

      <div class="clock">
        <em class="stat-label stencil"><i class="fa-solid fa-clock" /> 时间与区域</em>
        <strong class="clock-date">{{ clock.date }}</strong>
        <span class="clock-sub">{{ clock.time }} · {{ world.当前区域 }}</span>
      </div>
    </header>

    <!-- ══ 警戒带 ══ -->
    <TransitionGroup name="band" tag="div" class="bands">
      <div v-for="a in alerts" :key="a.text" class="band hazard-stripes">
        <i class="fa-solid" :class="a.icon" />
        <span class="band-title">{{ a.text }}</span>
        <span class="band-note">{{ a.note }}</span>
      </div>
    </TransitionGroup>

    <!-- ══ 三个父折叠 ══ -->
    <div class="hatches">
      <Hatch
        title="阿斯缇娅"
        :note="herNote"
        storage-key="阿斯缇娅:sb:her"
        icon="fa-solid fa-user-astronaut"
        :hazard="powerAlert || wearAlert"
      >
        <HerPanel
          :stage="stage"
          :affection="affection"
          :trust="trust"
          :intimacy="intimacy"
          :intimacy-state="intimacyState"
          :oath-state="oathState"
          :oath-date="oathDate"
          :power="power"
          :wear="wear"
          :body-state="bodyState"
          :shape="String(her.身体.小穴.外形)"
          :color="String(her.身体.小穴.颜色)"
          :state="String(her.身体.小穴.状态)"
          :womb-state="String(her.身体.子宫.状态)"
          :womb-chance="Number(her.身体.子宫.受孕概率) || 0"
          :embryos="Number(her.身体.子宫.胚胎数量) || 0"
          :depth="String(her.身体.子宫.着床深度)"
          :inside="Number(her.身体.子宫.宫内精液) || 0"
          :semen="her.身体.子宫.体内精液"
          :semen-total="Number(her.身体.子宫._总量) || 0"
          :power-alert="powerAlert"
          :wear-alert="wearAlert"
        />
      </Hatch>

      <Hatch
        title="基地车"
        :note="carNote"
        storage-key="阿斯缇娅:sb:car"
        icon="fa-solid fa-truck-monster"
        :hazard="energyAlert"
      >
        <VehiclePanel
          :energy="energy"
          :facilities="car.已解锁设施"
          :location="String(car.停靠位置)"
          :body-state="String(car.车体状态)"
          :supplies="car.物资存量"
          :records="car.改装记录"
        />
      </Hatch>

      <Hatch title="世界" :note="worldNote" storage-key="阿斯缇娅:sb:world" icon="fa-solid fa-compass">
        <WorldPanel
          :time="String(world.当前时间)"
          :period="String(world.时间段)"
          :region="String(world.当前区域)"
          :weather="String(world.天气与辐射.weather)"
          :radiation="Number(world.天气与辐射.radiation) || 0"
          :affairs="world.近期事务"
        />
      </Hatch>
    </div>
  </div>
</template>

<style scoped>
.statusbar {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  overflow: hidden;
  transition: border-color var(--t-hatch);
}

/* 扫描线：极淡的横向条纹，做出旧显示器的味道 */
.statusbar::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    to bottom,
    rgba(205, 195, 173, 0.022) 0 1px,
    rgba(0, 0, 0, 0) 1px 3px
  );
}

.is-alert {
  border-color: color-mix(in srgb, var(--c-danger) 58%, var(--c-border));
  animation: rattle 3.6s ease-in-out infinite;
}

/* ══ 铭牌 ══ */
.masthead {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  background: linear-gradient(180deg, var(--c-surface-raised), var(--c-surface));
  border-bottom: 1px solid var(--c-border);
}

/* 铭牌下方一道铆接压条 */
.masthead::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background-image: repeating-linear-gradient(to right, var(--c-border-hot) 0 2px, rgba(0, 0, 0, 0) 2px 9px);
  opacity: 0.55;
}

/* 阶段色由 stage-<key> 类提供，铭牌边框与阶段名一起换档 */
.stage-iron {
  --stage: var(--c-stage-0);
  --stage-text: var(--c-stage-0-text);
}
.stage-brass {
  --stage: var(--c-stage-1);
  --stage-text: var(--c-stage-1-text);
}
.stage-rustgold {
  --stage: var(--c-stage-2);
  --stage-text: var(--c-stage-2-text);
}
.stage-gold {
  --stage: var(--c-stage-3);
  --stage-text: var(--c-stage-3-text);
}

.plate.stage-iron,
.plate.stage-brass,
.plate.stage-rustgold,
.plate.stage-gold {
  border-color: var(--stage);
}

.plate.stage-iron i,
.plate.stage-brass i,
.plate.stage-rustgold i,
.plate.stage-gold i {
  color: var(--stage-text);
}

.ident-stage.stage-iron,
.ident-stage.stage-brass,
.ident-stage.stage-rustgold,
.ident-stage.stage-gold {
  color: var(--stage-text);
}

.plate {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 24px;
  height: 24px;
  font-size: 11px;
  border: 1px solid;
  background: var(--c-surface-sunken);
  transition: border-color var(--t-hatch);
}

.ident {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
}

.ident-name {
  font-size: 14px;
  font-weight: 400;
  color: var(--c-amber-text);
}

.ident-stage {
  font-size: 10px;
  letter-spacing: 0.08em;
  transition: color var(--t-hatch);
}

.stat {
  display: grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  gap: 0 5px;
  flex: none;
}

.stat-label {
  color: var(--c-text-muted);
  font-size: 8px;
}

.stat-label i {
  font-size: 7px;
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.85);
}

.stat-value.amber {
  color: var(--c-amber-text);
}

.stat-value.bad {
  color: var(--c-danger-text);
  animation: pulse-danger var(--t-warn) infinite;
}

.stat-track {
  grid-column: 1 / -1;
  position: relative;
  display: block;
  width: 62px;
  height: 5px;
  background: var(--c-surface-sunken);
  border: 1px solid var(--c-border);
}

.stat-fill {
  position: absolute;
  inset: 0 auto 0 0;
  transition: width var(--t-hatch);
}

.fill-power {
  background: var(--c-power);
}
.fill-amber {
  background: var(--c-amber);
}
.fill-danger {
  background: var(--c-danger);
}

.clock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: none;
  font-variant-numeric: tabular-nums;
}

.clock-date {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 400;
  color: var(--c-primary);
}

.clock-sub {
  color: var(--c-amber-text);
  font-size: 10px;
}

/* ══ 警戒带 ══ */
.bands {
  display: flex;
  flex-direction: column;
}

.band {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 12px;
  border-bottom: 1px solid color-mix(in srgb, var(--c-rust) 50%, var(--c-border));
  border-left: 3px solid var(--c-danger);
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

/* ══ 折叠组 ══ */
.hatches {
  display: flex;
  flex-direction: column;
}
</style>
