<template>
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-water" />
      <span>局势</span>
      <em class="hint">{{ world.当前地点 }}</em>
    </header>

    <dl class="facts">
      <div>
        <dt>时间</dt>
        <dd class="mono">{{ parts.date }}<span v-if="parts.time" class="time">{{ parts.time }}</span></dd>
      </div>
      <div>
        <dt>地点</dt>
        <dd>{{ world.当前地点 }}</dd>
      </div>
      <div class="wide">
        <dt>当前事件</dt>
        <dd>{{ world.当前事件 }}</dd>
      </div>
    </dl>

    <!--
      竞标周期：氛围刻度，不是倒计时。
      呈现为 90 天刻度尺上的一个位置，数字用小号弱化色，且**不出现「仅剩」「剩余」字样、不做红色警示**。
    -->
    <div class="bid" :class="{ near: is_near }">
      <div class="bid-head">
        <span class="bid-label">竞标周期</span>
        <em class="bid-days">{{ days }} 天</em>
      </div>
      <span class="ruler">
        <span class="ruler-mark" :style="{ left: `${progress}%` }" />
      </span>
      <p class="bid-note">那张牌照悬在头顶，只作氛围——不催你、不逼剧情。</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Schema } from '../../../schema';
import { BID_WINDOW_DAYS } from '../constants';
import { clamp, split_time } from '../utils';

const props = defineProps<{ world: Schema['世界'] }>();

const parts = computed(() => split_time(props.world.当前时间));

const days = computed(() => Math.round(clamp(props.world.距竞标天数, 0, BID_WINDOW_DAYS)));

/** 90 天走完 → 标记走到右端；只标位置，不表达紧迫。 */
const progress = computed(() => ((BID_WINDOW_DAYS - days.value) / BID_WINDOW_DAYS) * 100);

/** 末段转金以示「周期临近」，仅此而已。 */
const is_near = computed(() => days.value <= 10);
</script>

<style lang="scss" scoped>
.block {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.block-head {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.12em;

  .hint {
    margin-left: auto;
    font-size: 9px;
    font-style: normal;
    letter-spacing: 0.02em;
    opacity: 0.7;
  }
}

.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 5px 10px;
  margin: 0;

  > div {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .wide {
    grid-column: 1 / -1;
  }

  dt {
    color: var(--c-text-muted);
    font-size: 9px;
    letter-spacing: 0.06em;
  }

  dd {
    margin: 0;
    font-size: 11px;
    line-height: 1.5;
  }
}

.mono {
  font-variant-numeric: tabular-nums;
}

.time {
  margin-left: 5px;
  color: var(--c-gold);
}

.bid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 5px;
  border-top: 1px solid var(--c-border);
}

.bid-head {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.bid-label {
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.bid-days {
  margin-left: auto;
  color: var(--c-text-muted);
  font-size: 10px;
  font-style: normal;
  font-variant-numeric: tabular-nums;
}

.bid.near .bid-days {
  color: var(--c-gold);
}

/* 90 天刻度尺：一条静态的尺，不是进度条 */
.ruler {
  position: relative;
  display: block;
  height: 3px;
  background: var(--c-border);
}

.ruler-mark {
  position: absolute;
  top: -3px;
  bottom: -3px;
  width: 2px;
  margin-left: -1px;
  background: var(--c-text-muted);
  transition: left var(--t-dream);
}

.bid.near .ruler-mark {
  background: var(--c-gold);
}

.bid-note {
  margin: 0;
  color: var(--c-text-muted);
  font-size: 9px;
  line-height: 1.5;
}
</style>
