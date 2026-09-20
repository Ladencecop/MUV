<template>
  <div class="viewfinder" :class="theme_class">
    <!-- 取景框四角对焦标记 -->
    <span class="focus-corner tl" />
    <span class="focus-corner tr" />
    <span class="focus-corner bl" />
    <span class="focus-corner br" />

    <!-- 定格：始终可见 -->
    <button class="header" type="button" @click="expanded = !expanded">
      <span class="rec" :class="{ live: ntr_on }">
        <i class="fa-solid fa-circle" />
        <em>{{ ntr_on ? 'LIVE' : 'REC' }}</em>
      </span>

      <span class="subject">
        <em class="subject-label">SUBJECT</em>
        <strong class="subject-name">{{ SUBJECT_NAME }}</strong>
        <span class="subject-stage" :style="{ color: stage_color }">{{ stage_name }}</span>
      </span>

      <span class="heat">
        <em class="heat-label">直播热度</em>
        <strong class="heat-value">{{ data.世界.直播热度 }}</strong>
        <span class="heat-track">
          <span class="heat-fill" :style="{ width: `${clamp(data.世界.直播热度, 0, 100)}%` }" />
        </span>
      </span>

      <span class="clock">
        <em class="clock-day">DAY {{ data.世界.节目天数 }}/21</em>
        <strong class="clock-date">{{ date_part }}</strong>
        <span class="clock-time">{{ time_part }}</span>
      </span>

      <i class="fa-solid fa-chevron-down caret" :class="{ up: expanded }" />
    </button>

    <!-- 开关与翻面 -->
    <div class="tools">
      <button
        class="ntr-switch"
        :class="{ on: ntr_on }"
        type="button"
        :aria-pressed="ntr_on"
        :title="ntr_on ? 'NTR 开关：on（点击关闭）' : 'NTR 开关：off（点击开启）'"
        @click.stop="request_toggle"
      >
        <i class="fa-solid fa-video" />
        <em>{{ ntr_on ? 'ON' : 'OFF' }}</em>
      </button>

      <button
        class="flip-btn"
        type="button"
        :title="showing_back ? '返回正面' : '翻到背面'"
        @click.stop="showing_back = !showing_back"
      >
        <i class="fa-solid fa-rotate" />
        <em>{{ showing_back ? '正面' : '背面' }}</em>
      </button>
    </div>

    <!-- 开关确认：有后果的操作先问一次 -->
    <Transition name="ntr">
      <div v-if="confirming" class="ntr-confirm">
        <span class="confirm-text">
          <template v-if="ntr_on">
            关闭后其他男嘉宾停止主动攻势，节目组不再安排 NSFW 环节与随机组队。确认关闭？
          </template>
          <template v-else>
            开启后其他男嘉宾会转为主动攻势，节目组将解禁 NSFW 环节且组队随机。确认开启？
          </template>
        </span>
        <button class="confirm-btn primary" :class="{ danger: !ntr_on }" type="button" @click.stop="apply_toggle">
          确认{{ ntr_on ? '关闭' : '开启' }}
        </button>
        <button class="confirm-btn" type="button" @click.stop="confirming = false">取消</button>
      </div>
    </Transition>

    <!-- 情境覆盖：开关打开（背面不重复提示） -->
    <Transition name="ntr">
      <div v-if="ntr_on && !showing_back" class="ntr-band">
        <i class="fa-solid fa-tower-broadcast" />
        <span>众矢之的 · 节目组环节向他人倾斜 · 组队随机</span>
      </div>
    </Transition>

    <!-- 展开区 -->
    <Transition name="panel">
      <div v-if="expanded" class="body">
        <template v-if="showing_back">
          <BackPanel />
        </template>

        <template v-else>
          <StageLadder :stage="data.裴泫雅.关系状态" />
          <AffectionMeter :affection="data.裴泫雅.好感度" :today-gain="today_gain" :capped="affection_capped" />

          <div class="grid">
            <RelationshipGrid :relations="{ 温典溪: data.温典溪, 千羽: data.千羽 }" />
            <PlayerPanel :player="data.玩家" />
          </div>

          <DanmakuPanel />

          <WorldStrip :world="data.世界" />
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { clamp } from './utils';
import { computed, ref, watch } from 'vue';
import AffectionMeter from './components/AffectionMeter.vue';
import BackPanel from './components/BackPanel.vue';
import DanmakuPanel from './components/DanmakuPanel.vue';
import PlayerPanel from './components/PlayerPanel.vue';
import RelationshipGrid from './components/RelationshipGrid.vue';
import StageLadder from './components/StageLadder.vue';
import WorldStrip from './components/WorldStrip.vue';
import { set_ntr_switch, useDataStore } from './store';

const SUBJECT_NAME = '裴泫雅';
const AFFECTION_MIN = -20;
const AFFECTION_MAX = 120;
const DAILY_GAIN_CAP = 10;

const STAGE_NAMES = ['戒备与疏离', '好奇和友谊', '暧昧和拉扯', '爱恋和自省', '亲密和坦白'] as const;
const STAGE_COLORS = ['var(--c-stage-0)', 'var(--c-stage-1)', 'var(--c-stage-2)', 'var(--c-stage-3)', 'var(--c-stage-4)'];

const store = useDataStore();
const data = computed(() => store.data);

const expanded = useLocalStorage('心动小屋:status_bar:expanded', true);
const showing_back = useLocalStorage('心动小屋:status_bar:back', false);

const ntr_on = computed(() => data.value.世界.NTR开关 === 'on');
const stage_index = computed(() => clamp(Math.round(data.value.裴泫雅.关系状态), 0, 4));
const stage_name = computed(() => STAGE_NAMES[stage_index.value]);
const stage_color = computed(() => STAGE_COLORS[stage_index.value]);

// 标题栏常驻的时间：格式为 YYYY/MM/DD-HH:MM，拆成日期与时刻两段展示
const time_parts = computed(() => {
  const raw = String(data.value.世界.当前时间 ?? '');
  const [date, time] = raw.split('-');
  return { date: date || raw, time: time || '' };
});
const date_part = computed(() => time_parts.value.date);
const time_part = computed(() => time_parts.value.time);

// 界面自身不写回 MVU：今日涨幅以本日基线为参照，跨日自动重置
const baseline = useLocalStorage('心动小屋:status_bar:affection_baseline', { day: -1, value: 0 });
watch(
  () => [data.value.世界.节目天数, data.value.裴泫雅.好感度] as const,
  ([day, affection]) => {
    if (baseline.value.day !== day) {
      baseline.value = { day, value: affection };
    }
  },
  { immediate: true },
);

const today_gain = computed(() => {
  const base = baseline.value;
  if (!base || base.day !== data.value.世界.节目天数 || !Number.isFinite(base.value)) return 0;
  const gain = data.value.裴泫雅.好感度 - base.value;
  return Number.isFinite(gain) ? Math.max(0, gain) : 0;
});
const affection_capped = computed(() => today_gain.value >= DAILY_GAIN_CAP);

// 交互人格：状态 0–2 硬切，状态 3 起短渐显
const theme_class = computed(() => ({
  'is-thawed': stage_index.value >= 3,
  'is-live': ntr_on.value,
}));

// NTR 开关：界面为玩家提供直接操作入口，先确认再写回 MVU
const confirming = ref(false);

function request_toggle() {
  confirming.value = true;
}

function apply_toggle() {
  const next = ntr_on.value ? 'off' : 'on';
  set_ntr_switch(next);
  confirming.value = false;
  toastr.info(next === 'on' ? 'NTR 模式已开启' : 'NTR 模式已关闭');
}
</script>

<style lang="scss" scoped>
.viewfinder {
  position: relative;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  overflow: hidden;
}

/* 霜面裂痕层：状态 3 起出现，状态 4 最强 */
.viewfinder::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background:
    linear-gradient(115deg, transparent 42%, rgb(232 213 196 / 10%) 43%, transparent 44%),
    linear-gradient(63deg, transparent 61%, rgb(232 213 196 / 8%) 62%, transparent 63%),
    linear-gradient(151deg, transparent 24%, rgb(232 213 196 / 6%) 25%, transparent 26%);
  transition: opacity 600ms ease;
}

.viewfinder.is-thawed::after {
  opacity: 1;
}

.viewfinder.is-live {
  border-color: var(--c-danger);
}

.focus-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid var(--c-primary);
  opacity: 0.5;
  pointer-events: none;
  transition: opacity 200ms;
}

.viewfinder.is-live .focus-corner {
  border-color: var(--c-danger);
  opacity: 0.9;
}

.focus-corner.tl {
  top: 5px;
  left: 5px;
  border-right: 0;
  border-bottom: 0;
}

.focus-corner.tr {
  top: 5px;
  right: 5px;
  border-left: 0;
  border-bottom: 0;
}

.focus-corner.bl {
  bottom: 5px;
  left: 5px;
  border-right: 0;
  border-top: 0;
}

.focus-corner.br {
  bottom: 5px;
  right: 5px;
  border-left: 0;
  border-top: 0;
}

.header {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px 6px;
  background: transparent;
  border: 0;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.header:hover {
  background: rgb(205 214 224 / 4%);
}

.rec {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  color: var(--c-danger);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.rec em {
  font-style: normal;
}

.rec i {
  font-size: 7px;
}

.rec.live i {
  animation: blink 900ms steps(2, end) infinite;
}

@keyframes blink {
  50% {
    opacity: 0.15;
  }
}

.subject {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1 1 auto;
  min-width: 0;
}

.subject-label {
  color: var(--c-text-muted);
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.14em;
}

.subject-name {
  font-size: 15px;
  letter-spacing: 0.06em;
}

.subject-stage {
  font-size: 11px;
  letter-spacing: 0.04em;
  transition: color 400ms ease;
}

.heat {
  display: grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  gap: 0 6px;
  flex: none;
}

.heat-label {
  color: var(--c-text-muted);
  font-size: 10px;
  font-style: normal;
}

.heat-value {
  color: var(--c-affection);
  font-size: 17px;
  font-variant-numeric: tabular-nums;
}

.heat-track {
  grid-column: 1 / -1;
  position: relative;
  display: block;
  width: 86px;
  height: 3px;
  background: var(--c-border);
}

.heat-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--c-affection);
  transition: width 200ms;
}

.is-live .heat-fill {
  background: var(--c-danger);
}

.is-thawed .heat-fill {
  transition: width 600ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.clock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0;
  flex: none;
  font-variant-numeric: tabular-nums;
}

.clock-day {
  color: var(--c-text-muted);
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.1em;
}

.clock-date {
  color: var(--c-primary);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.clock-time {
  color: var(--c-affection);
  font-size: 13px;
  letter-spacing: 0.04em;
}

.caret {
  flex: none;
  color: var(--c-text-muted);
  font-size: 11px;
  transition: transform 200ms;
}

.caret.up {
  transform: rotate(180deg);
}

.tools {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  padding: 0 14px 7px;
}

.ntr-switch,
.flip-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: transparent;
  border: 1px solid var(--c-border);
  color: var(--c-text-muted);
  font: inherit;
  font-size: 10px;
  letter-spacing: 0.08em;
  cursor: pointer;
}

.ntr-switch em,
.flip-btn em {
  font-style: normal;
}

.ntr-switch:hover,
.flip-btn:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
}

.ntr-switch.on {
  border-color: var(--c-danger);
  background: rgb(229 72 77 / 14%);
  color: var(--c-danger);
}

.flip-btn {
  border-color: var(--c-thaw);
  color: var(--c-thaw);
}

.ntr-confirm {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  background: rgb(229 72 77 / 10%);
  border-top: 1px solid rgb(229 72 77 / 35%);
  font-size: 11px;
}

.confirm-text {
  flex: 1 1 auto;
  color: var(--c-primary);
  line-height: 1.4;
}

.confirm-btn {
  flex: none;
  padding: 3px 9px;
  background: transparent;
  border: 1px solid var(--c-border);
  color: var(--c-text-muted);
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.confirm-btn:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
}

.confirm-btn.primary {
  border-color: var(--c-affection);
  color: var(--c-affection);
}

.confirm-btn.primary:hover {
  background: rgb(143 184 216 / 16%);
}

.confirm-btn.primary.danger {
  border-color: var(--c-danger);
  color: var(--c-danger);
}

.confirm-btn.primary.danger:hover {
  background: rgb(229 72 77 / 18%);
}

.ntr-band {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 14px;
  background: rgb(229 72 77 / 12%);
  border-top: 1px solid rgb(229 72 77 / 35%);
  color: var(--c-danger);
  font-size: 11px;
  letter-spacing: 0.03em;
}

.body {
  padding: 12px 14px 14px;
  border-top: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

/* 情境切换：开关打开时红灯闪烁 */
.ntr-enter-active,
.ntr-leave-active {
  transition: opacity 200ms;
}

.ntr-enter-from,
.ntr-leave-to {
  opacity: 0;
}

/* 交互人格：硬切为主，解冻后转短渐显 */
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
