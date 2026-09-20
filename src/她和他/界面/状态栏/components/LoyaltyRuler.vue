<template>
  <div class="ruler-wrap">
    <div class="ruler" role="img" :aria-label="`忠诚度 ${loyalty}，当前档位 ${current.title}`">
      <span
        v-for="band in ruler_bands"
        :key="band.min"
        class="seg"
        :class="{ active: band.min === current.min }"
        :style="{ flexGrow: band.weight, '--seg': band.color }"
      />
    </div>

    <div v-if="detailed" class="scale">
      <span class="s0">0</span>
      <span class="s50">50</span>
      <span class="s70">70</span>
      <span class="s85">85</span>
      <span class="s100">100</span>
    </div>

    <ul v-if="detailed" class="bands">
      <li
        v-for="band in LOYALTY_BANDS"
        :key="band.min"
        class="band"
        :class="{ active: band.min === current.min }"
        :style="{ '--seg': band.color }"
      >
        <span class="band-range">{{ band.min }}~{{ band.max }}</span>
        <span class="band-body">
          <span class="band-title">{{ band.title }}</span>
          <span class="band-detail">{{ band.detail }}</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { LOYALTY_BANDS, loyalty_band_of } from '../constants';

const props = defineProps<{
  /** 千羽.忠诚度 */
  loyalty: number;
  /** 标题栏用紧凑版，展开区用带四档明细的详版 */
  detailed?: boolean;
}>();

const current = computed(() => loyalty_band_of(props.loyalty));

/** 刻度尺按 0→100 的自然轴向排布；四档明细列表保持 85~100 在上的读法。 */
const ruler_bands = computed(() => [...LOYALTY_BANDS].reverse());
</script>

<style scoped>
.ruler-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.ruler {
  display: flex;
  gap: 2px;
  width: 100%;
  height: 5px;
}

.seg {
  background: var(--c-border);
  transition: background 400ms ease;
}

.seg.active {
  background: var(--seg);
}

.scale {
  position: relative;
  height: 10px;
  color: var(--c-text-muted);
  font-size: 9px;
  font-variant-numeric: tabular-nums;
}

.scale span {
  position: absolute;
  transform: translateX(-50%);
}

/* 位置按各档位的区间权重换算：0 / 50 / 70 / 85 / 100 */
.s0 {
  left: 0;
}

.s50 {
  left: 49.5%;
}

.s70 {
  left: 69.3%;
}

.s85 {
  left: 84.2%;
}

.s100 {
  left: 100%;
}

.bands {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 2px 0 0;
  padding: 0;
  list-style: none;
}

.band {
  display: flex;
  gap: 8px;
  padding: 4px 6px 4px 2px;
  opacity: 0.42;
  transition: opacity 300ms ease;
}

.band.active {
  opacity: 1;
  background: rgb(143 176 216 / 8%);
  box-shadow: inset 2px 0 0 var(--seg);
}

.band-range {
  flex: none;
  width: 46px;
  color: var(--c-text-muted);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}

.band.active .band-range {
  color: var(--seg);
}

.band-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.band-title {
  font-size: 11px;
  letter-spacing: 0.03em;
}

.band.active .band-title {
  color: var(--seg);
}

.band-detail {
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.35;
}
</style>
