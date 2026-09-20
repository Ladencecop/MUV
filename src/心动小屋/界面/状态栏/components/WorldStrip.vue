<template>
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-satellite-dish" />
      <span>节目现场</span>
      <em class="ep">DAY {{ world.节目天数 }} / 21</em>
    </header>

    <dl class="facts">
      <div>
        <dt>日期</dt>
        <dd class="mono">{{ date_part }}</dd>
      </div>
      <div>
        <dt>时刻</dt>
        <dd class="mono accent">{{ time_part }}</dd>
      </div>
      <div>
        <dt>地点</dt>
        <dd>{{ world.当前地点 }}</dd>
      </div>
      <div>
        <dt>当前环节</dt>
        <dd>{{ world.当前环节 }}</dd>
      </div>
    </dl>

    <div class="meters">
      <div class="meter-row">
        <span class="meter-label">直播热度</span>
        <span class="meter-bar">
          <span class="meter-fill heat" :style="{ width: `${clamp(world.直播热度, 0, 100)}%` }" />
        </span>
        <em class="meter-value">{{ world.直播热度 }}</em>
      </div>
      <div class="meter-row">
        <span class="meter-label">舆论风向</span>
        <span class="opinion" :class="`opinion-${opinion_key}`">{{ world.舆论风向 }}</span>
        <em class="meter-value">{{ opinion_hint }}</em>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { clamp } from '../utils';
import { computed } from 'vue';
import type { Schema } from '../../../schema';

const props = defineProps<{ world: Schema['世界'] }>();
const world = computed(() => props.world);

const OPINION_HINT: Record<Schema['世界']['舆论风向'], string> = {
  祝福: '支持你与她',
  中立: '无人特别关注',
  争议: '出现质疑与起哄',
  围攻: '你成了靶心',
};

const OPINION_KEY: Record<Schema['世界']['舆论风向'], string> = {
  祝福: 'good',
  中立: 'idle',
  争议: 'warn',
  围攻: 'bad',
};

const opinion_hint = computed(() => OPINION_HINT[world.value.舆论风向] ?? '');
const opinion_key = computed(() => OPINION_KEY[world.value.舆论风向] ?? 'idle');

// 格式为 YYYY/MM/DD-HH:MM，拆成日期与时刻
const time_parts = computed(() => {
  const raw = String(world.value.当前时间 ?? '');
  const [date, time] = raw.split('-');
  return { date: date || raw, time: time || '' };
});
const date_part = computed(() => time_parts.value.date);
const time_part = computed(() => time_parts.value.time);
</script>

<style lang="scss" scoped>
.block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.block-head {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.block-head .ep {
  margin-left: auto;
  font-size: 9px;
  font-style: normal;
  font-variant-numeric: tabular-nums;
}

.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 5px 10px;
  margin: 0;
}

.facts > div {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.facts dt {
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.facts dd {
  margin: 0;
  font-size: 11px;
}

.mono {
  font-variant-numeric: tabular-nums;
}

.accent {
  color: var(--c-affection);
}

.meters {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 2px;
  border-top: 1px solid var(--c-border);
}

.meter-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meter-label {
  flex: none;
  width: 52px;
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.meter-bar {
  position: relative;
  flex: 1 1 auto;
  height: 4px;
  background: var(--c-border);
}

.meter-fill {
  position: absolute;
  inset: 0 auto 0 0;
  transition: width 200ms;
}

.meter-fill.heat {
  background: var(--c-affection);
}

.is-live .meter-fill.heat {
  background: var(--c-danger);
}

.meter-value {
  flex: none;
  min-width: 72px;
  color: var(--c-text-muted);
  font-size: 10px;
  font-style: normal;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.opinion {
  flex: 1 1 auto;
  font-size: 11px;
}

.opinion-good {
  color: var(--c-affection);
}

.opinion-idle {
  color: var(--c-primary);
}

.opinion-warn {
  color: var(--c-warning);
}

.opinion-bad {
  color: var(--c-danger);
}
</style>
