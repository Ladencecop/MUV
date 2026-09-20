<script setup lang="ts">
import { computed } from 'vue';
import { BODY_STATE_NOTES, INTIMACY_BOUNDARIES, INTIMACY_STATES, STAGE_GATES, STAGE_KEYS } from '../constants';
import Gauge from './Gauge.vue';

/**
 * 阿斯缇娅面板：关系与身体。
 *
 * 三块内容，依次是亲密（数值 + 身体边界）、关系阶段阶梯、她的机体。
 * 机体里包含小穴与子宫 —— 它们是她机体状态的一部分，不单独成区。
 */
const props = defineProps<{
  stage: string;
  affection: number;
  trust: number;
  intimacy: number;
  intimacyState: string;
  power: number;
  wear: number;
  bodyState: string;
  shape: string;
  color: string;
  state: string;
  wombState: string;
  wombChance: number;
  embryos: number;
  depth: string;
  inside: number;
  semen: { 时间: string; 毫升数: number }[];
  semenTotal: number;
  powerAlert: boolean;
  wearAlert: boolean;
}>();

const stageIndex = computed(() => {
  const i = (STAGE_GATES as readonly { name: string }[]).findIndex((s) => s.name === props.stage);
  return i < 0 ? 0 : i;
});
const stageKey = computed(() => STAGE_KEYS[stageIndex.value]);

const intimacyIndex = computed(() => (INTIMACY_STATES as readonly string[]).indexOf(props.intimacyState));
const boundary = computed(
  () => INTIMACY_BOUNDARIES[props.intimacyState] ?? '尚无记录。',
);

const wombIndex = computed(() => {
  const order = ['未激活', '待着床', '已着床', '孕育中'];
  const i = order.indexOf(props.wombState);
  return i < 0 ? 0 : i;
});
const pregnant = computed(() => wombIndex.value >= 2);

/** 精液明细按时间倒序，最近一次在最上 */
const semenRows = computed(() => _.orderBy(props.semen, ['时间'], ['desc']).slice(0, 8));

/** 当前生理状态的一句释义 */
const bodyNote = computed(() => BODY_STATE_NOTES[props.bodyState] ?? '');
</script>

<template>
  <div class="panel">
    <!-- ── 亲密 ── -->
    <section class="block">
      <header class="block-head">
        <i class="fa-solid fa-link" />
        <span class="stencil">亲密</span>
        <em class="head-note intimacy-text">{{ intimacyState }}</em>
      </header>

      <Gauge label="亲密度" :value="intimacy" tone="intimacy" />
      <Gauge label="好感度" :value="affection" tone="amber" />
      <Gauge label="信任度" :value="trust" tone="power" />

      <p class="boundary">{{ boundary }}</p>
    </section>

    <!-- ── 关系阶段 ── -->
    <section class="block">
      <header class="block-head">
        <i class="fa-solid fa-layer-group" />
        <span class="stencil">关系阶段</span>
        <em class="head-note">{{ stage }}</em>
      </header>

      <ol class="ladder">
        <li
          v-for="(s, i) in STAGE_GATES"
          :key="s.name"
          class="rung"
          :class="[`stage-${STAGE_KEYS[i]}`, { reached: i <= stageIndex, current: i === stageIndex }]"
        >
          <span class="pip" />
          <div class="rung-body">
            <div class="rung-top">
              <span class="rung-name">{{ s.name }}</span>
              <span class="rung-gate">{{ s.gate }}</span>
            </div>
            <p v-if="i === stageIndex" class="rung-note">{{ s.note }}</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- ── 她的机体 ── -->
    <section class="block">
      <header class="block-head">
        <i class="fa-solid fa-microchip" />
        <span class="stencil">她的机体</span>
        <em class="head-note" :class="{ alarm: powerAlert || wearAlert }">
          {{ powerAlert ? '电量不足' : wearAlert ? '需要维护' : '运转正常' }}
        </em>
      </header>

      <div class="gauges">
        <Gauge label="电量" :value="power" tone="var(--c-power)" :threshold="30" :lower="true" />
        <Gauge label="机体损耗" :value="wear" tone="rust" :threshold="60" :lower="false" />
      </div>

      <div class="row">
        <span class="row-label stencil">生理状态</span>
        <ol class="chips">
          <li v-for="s in ['常态', '休眠', '性爱', '力竭']" :key="s" class="chip" :class="{ on: s === bodyState }">
            {{ s }}
          </li>
        </ol>
      </div>
      <p class="state-note">{{ bodyNote }}</p>
    </section>

    <!-- ── 两处接口 ── -->
    <section class="block">
      <header class="block-head">
        <i class="fa-solid fa-droplet" />
        <span class="stencil">小穴</span>
        <em class="head-note">即时</em>
      </header>
      <dl class="facts">
        <div>
          <dt>外形</dt>
          <dd>{{ shape }}</dd>
        </div>
        <div>
          <dt>颜色</dt>
          <dd>{{ color }}</dd>
        </div>
        <div>
          <dt>状态</dt>
          <dd>{{ state }}</dd>
        </div>
      </dl>
    </section>

    <section class="block">
      <header class="block-head">
        <i class="fa-solid fa-egg" />
        <span class="stencil">子宫</span>
        <em class="head-note" :class="{ pregnant: pregnant }">{{ wombState }}</em>
      </header>

      <ol class="ladder womb-ladder">
        <li
          v-for="(s, i) in ['未激活', '待着床', '已着床', '孕育中']"
          :key="s"
          class="rung womb-rung"
          :class="{ reached: i <= wombIndex, current: i === wombIndex }"
        >
          <span class="pip" :class="{ lit: i <= wombIndex }" />
          <span class="rung-name">{{ s }}</span>
        </li>
      </ol>

      <div class="gauges">
        <Gauge label="受孕概率" :value="wombChance" unit="%" tone="warm" />
      </div>

      <dl class="facts grid-3">
        <div>
          <dt>胚胎数量</dt>
          <dd :class="{ marked: embryos > 0 }">{{ embryos }}</dd>
        </div>
        <div>
          <dt>着床深度</dt>
          <dd :class="{ marked: depth !== '无' }">{{ depth }}</dd>
        </div>
        <div>
          <dt>宫内精液</dt>
          <dd :class="{ marked: inside > 0 }">{{ inside }} ml</dd>
        </div>
      </dl>

      <div class="deposits">
        <div class="deposits-head">
          <i class="fa-solid fa-list-ul" />
          <span class="stencil">体内精液</span>
          <em>{{ semenTotal }} ml · {{ semen.length }} 条</em>
        </div>
        <ul v-if="semenRows.length" class="deposit-list">
          <li v-for="(d, i) in semenRows" :key="i">
            <span class="d-time">{{ d.时间 }}</span>
            <span class="d-amount">{{ d.毫升数 }} ml</span>
          </li>
        </ul>
        <p v-else class="empty">还没有留在她体内的记录。</p>
      </div>

      <p v-if="!pregnant" class="state-note">机体处于封存后的低活跃状态，不具备受孕条件。</p>
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
  font-size: 10px;
  font-style: normal;
  letter-spacing: 0.06em;
}

.head-note.alarm {
  color: var(--c-danger-text);
  animation: pulse-danger var(--t-warn) infinite;
}

.head-note.pregnant {
  color: var(--c-gold-text);
}

.head-note.intimacy-text {
  color: var(--c-intimacy-text);
}

/* ── 读数组 ── */
.gauges {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 8px 9px;
  background: var(--c-surface-raised);
  border-left: 2px solid var(--c-border-hot);
}

/* ── 身体边界那句话 ── */
.boundary {
  margin: 0;
  padding: 7px 9px;
  background: var(--c-surface-sunken);
  border-left: 2px solid var(--c-intimacy);
  color: var(--c-primary);
  font-size: 11px;
  line-height: 1.6;
}

/* ── 阶段阶梯 ── */
.ladder {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

.rung {
  display: flex;
  gap: 8px;
  padding: 3px 0 3px 2px;
  opacity: 0.45;
  transition: opacity var(--t-hatch);
}

.rung.reached {
  opacity: 1;
}

.rung.current {
  background: color-mix(in srgb, var(--c-amber) 8%, transparent);
}

/* 阶段色由整行的 stage-<key> 类级联给 pip 与阶段名 */
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

.pip {
  flex: none;
  width: 6px;
  height: 6px;
  margin-top: 6px;
  background: var(--c-border);
  transition: background var(--t-hatch);
}

/* 关系阶梯：抵达的阶段按色阶亮灯，当前阶段的名字也跟着变色 */
.rung.reached .pip {
  background: var(--stage, var(--c-border-hot));
}
.rung.current .rung-name {
  color: var(--stage-text, var(--c-primary));
}

.rung-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.rung-top {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
}

.rung-name {
  font-size: 12px;
  letter-spacing: 0.03em;
}

.rung-gate {
  color: var(--c-text-muted);
  font-family: var(--font-mono);
  font-size: 9px;
}

.rung-note {
  margin: 1px 0 0;
  color: var(--c-primary);
  font-size: 10px;
  line-height: 1.5;
  opacity: 0.85;
}

/* 子宫阶梯是横向四格 */
.womb-ladder {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}

.womb-rung {
  align-items: center;
  padding: 4px 5px;
  background: var(--c-surface-raised);
  border-left: 2px solid var(--c-border);
}

.womb-rung.current {
  background: color-mix(in srgb, var(--c-warm) 14%, var(--c-surface-raised));
  border-left-color: var(--c-warm);
}

.womb-rung .pip {
  margin-top: 0;
}
.womb-rung .pip.lit {
  background: var(--c-warm);
}

/* ── 键值组 ── */
.facts {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0;
}

.facts.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(84px, 1fr));
  gap: 5px 10px;
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
  border-left: 2px solid var(--c-warm);
  font-size: 11px;
  line-height: 1.55;
}

.facts.grid-3 dd {
  padding-left: 0;
  border-left: 0;
  font-family: var(--font-mono);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.facts dd.marked {
  color: var(--c-warm-text);
}

/* ── 生理状态标签 ── */
.row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.row-label {
  color: var(--c-text-muted);
  font-size: 9px;
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

.chip.on {
  color: var(--c-warm-text);
  border-color: var(--c-warm);
  background: color-mix(in srgb, var(--c-warm) 14%, var(--c-surface-sunken));
}

.state-note {
  margin: 0;
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.5;
}

/* ── 精液明细 ── */
.deposits {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 9px;
  background: var(--c-surface-sunken);
  border-top: 1px solid var(--c-border);
}

.deposits-head {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-warm-text);
  font-size: 10px;
}

.deposits-head em {
  margin-left: auto;
  color: var(--c-text-muted);
  font-size: 9px;
  font-style: normal;
  font-variant-numeric: tabular-nums;
}

.deposit-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.deposit-list li {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: baseline;
  font-family: var(--font-mono);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}

.d-time {
  color: var(--c-text-muted);
}

.d-amount {
  color: var(--c-warm-text);
}

.empty {
  margin: 0;
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.5;
}
</style>
