<template>
  <div class="sb-block">
    <header class="sb-head">
      <i class="fa-solid fa-tachometer-alt" />
      <span>身体状态与情欲度</span>
      <em class="sb-note">当前这场性事的计数</em>
    </header>

    <div class="meters">
      <div class="meter-row">
        <span class="meter-label">发情度</span>
        <span class="sb-bar">
          <span
            class="fill-arousal"
            :class="{ pulsing: climax > 0 }"
            :style="{ width: percent_of(body.发情度) }"
          />
        </span>
        <em class="meter-value">{{ body.发情度 }}</em>
      </div>

      <div class="meter-row">
        <span class="meter-label">湿润度</span>
        <span class="sb-bar">
          <span class="fill-arousal" :style="{ width: percent_of(body.湿润度) }" />
        </span>
        <em class="meter-value">{{ body.湿润度 }}</em>
      </div>

      <div class="meter-row">
        <span class="meter-label">体力</span>
        <span class="sb-bar">
          <span class="fill-stamina" :style="{ width: percent_of(body.体力) }" />
        </span>
        <em class="meter-value">{{ body.体力 }}</em>
      </div>
    </div>

    <dl class="sb-facts">
      <div>
        <dt>高潮次数</dt>
        <dd :class="{ marked: climax > 0 }">{{ body.高潮次数 }}</dd>
      </div>
      <div>
        <dt>体内精液量</dt>
        <dd :class="{ marked: body.体内精液量 > 0 }">{{ body.体内精液量 }} ml</dd>
      </div>
      <div class="wide">
        <dt>当前穿着</dt>
        <dd>{{ body.当前穿着 }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Schema } from '../../../schema';
import { percent_of } from '../constants';

const props = defineProps<{
  /** 千羽.身体状态 */
  body: Schema['千羽']['身体状态'];
}>();

const climax = computed(() => Number(props.body.高潮次数) || 0);
</script>

<style scoped>
.meters {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meter-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meter-label {
  flex: none;
  width: 46px;
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.fill-arousal {
  background: var(--c-arousal);
}

.fill-stamina {
  background: var(--c-accent);
}

.meter-value {
  flex: none;
  min-width: 30px;
  color: var(--c-primary);
  font-size: 11px;
  font-style: normal;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.sb-facts .wide {
  grid-column: 1 / -1;
}

.marked {
  color: var(--c-arousal);
}

/* 高潮计数不为零时，情欲度条进入脉动 */
.pulsing {
  animation: arousal-pulse 1100ms ease-in-out infinite;
}

@keyframes arousal-pulse {
  50% {
    opacity: 0.45;
  }
}
</style>
