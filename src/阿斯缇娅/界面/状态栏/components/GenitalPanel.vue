<script setup lang="ts">
import { computed } from 'vue';
import { pct } from '../constants';
import MeterRow from './MeterRow.vue';

/**
 * 她的小穴面板。露骨直白：外形、颜色、状态照读数如实显示。
 *
 * 三条文字描述来自 MVU 变量（由 AI 依当前情节重写），界面不加工、不委婉化。
 * `inactive` 由 App 传入（低电量时她不会进入这种状态），只压暗，不隐藏。
 */
const props = defineProps<{
  shape: string;
  color: string;
  state: string;
  wetness: number;
  climaxCount: number;
  semen: { 时间: string; 毫升数: number; 是否入子宫: boolean }[];
  total: number;
  inactive: boolean;
}>();

/** 精液明细按时间倒序，最近一次在最上 */
const rows = computed(() => _.orderBy(props.semen, ['时间'], ['desc']).slice(0, 8));
</script>

<template>
  <section class="block" :class="{ inactive }">
    <header class="block-head">
      <i class="fa-solid fa-droplet" />
      <span>她的小穴</span>
      <em class="hint">即时读数</em>
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

    <div class="meters">
      <MeterRow label="湿润度" :value="wetness" tone="var(--c-warm)" />
      <div class="counts">
        <span class="count">
          <i class="fa-solid fa-wave-square" />
          高潮次数
          <em :class="{ marked: climaxCount > 0 }">{{ climaxCount }}</em>
        </span>
        <span class="count">
          <i class="fa-solid fa-flask" />
          体内精液
          <em :class="{ marked: total > 0 }">{{ total }} ml</em>
        </span>
      </div>
    </div>

    <div class="deposits">
      <div class="deposits-head">
        <i class="fa-solid fa-list-ul" />
        <span>体内精液明细</span>
        <em>{{ semen.length }} 条</em>
      </div>
      <ul v-if="rows.length" class="deposit-list">
        <li v-for="(d, i) in rows" :key="i">
          <span class="d-time">{{ d.时间 }}</span>
          <span class="d-amount">{{ d.毫升数 }} ml</span>
          <span class="d-uterus" :class="{ yes: d.是否入子宫 }">{{ d.是否入子宫 ? '已入子宫' : '仅留阴道' }}</span>
        </li>
      </ul>
      <p v-else class="empty">还没有留在她体内的记录。</p>
    </div>
  </section>
</template>

<style scoped>
.block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: opacity var(--t-hatch);
}

/* 低电量时压暗：她不会在这种状态下进入情事 */
.inactive {
  opacity: 0.42;
}

.block-head {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.block-head i {
  color: var(--c-warm);
}

.hint {
  margin-left: auto;
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.02em;
  opacity: 0.7;
}

.facts {
  display: flex;
  flex-direction: column;
  gap: 5px;
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
  border-left: 2px solid var(--c-warm);
  font-size: 11px;
  line-height: 1.55;
}

.meters {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 8px 9px;
  background: var(--c-surface-raised);
}

.counts {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 6px;
  border-top: 1px solid var(--c-border);
}

.count {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.04em;
}

.count i {
  font-size: 9px;
  color: var(--c-warm);
}

.count em {
  font-family: var(--font-mono);
  font-size: 12px;
  font-style: normal;
  font-variant-numeric: tabular-nums;
}

.count em.marked {
  color: var(--c-warm-text);
}

.deposits {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 9px;
  background: rgba(0, 0, 0, 0.22);
  border-top: 1px solid var(--c-border);
}

.deposits-head {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-warm-text);
  font-size: 10px;
  letter-spacing: 0.1em;
}

.deposits-head em {
  margin-left: auto;
  color: var(--c-text-muted);
  font-size: 9px;
  font-style: normal;
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
  grid-template-columns: 1fr auto auto;
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

.d-uterus {
  color: var(--c-text-muted);
  font-family: var(--font-body);
}

.d-uterus.yes {
  color: var(--c-amber-text);
}

.empty {
  margin: 0;
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.5;
}
</style>
