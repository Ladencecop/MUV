<template>
  <div class="sb-block">
    <header class="sb-head">
      <i class="fa-solid fa-ring" />
      <span>领证妻室</span>
      <em class="sb-note">名额 {{ SPOUSE_LIMIT }} · 剩余 {{ remaining }}</em>
    </header>

    <ul class="slots">
      <li v-for="name in spouses" :key="`filled-${name}`" class="slot filled">
        <i class="fa-solid fa-ring" />
        <span>{{ name }}</span>
      </li>
      <li v-for="index in vacant_slots" :key="`vacant-${index}`" class="slot vacant">
        <span class="dot" />
        <span>空缺</span>
      </li>
    </ul>

    <div class="quota">
      <span class="sb-bar">
        <span class="fill-quota" :style="{ width: quota_percent }" />
      </span>
      <em class="quota-value">{{ spouses.length }} / {{ SPOUSE_LIMIT }}</em>
    </div>

    <p class="rule">领证上限三人，超出名额的领证不成立。实际关系不设名单，领证名额不可超。</p>

    <dl class="sb-facts">
      <div class="wide">
        <dt>黑道身份知情范围</dt>
        <dd :style="{ color: exposure_meta.color }">{{ exposure_meta.label }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Schema } from '../../../schema';
import { EXPOSURES, SPOUSE_LIMIT, percent_of } from '../constants';

const props = defineProps<{
  /** 玩家.领证妻室 */
  spouses: string[];
  /** 玩家._剩余名额 */
  remaining: number;
  /** 玩家.黑道身份暴露 */
  exposure: Schema['玩家']['黑道身份暴露'];
}>();

const vacant_slots = computed(() => Math.max(0, SPOUSE_LIMIT - props.spouses.length));
const quota_percent = computed(() => percent_of(props.spouses.length, SPOUSE_LIMIT));
const exposure_meta = computed(() => EXPOSURES[props.exposure] ?? EXPOSURES.未暴露);
</script>

<style scoped>
.slots {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.slot {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-left: 2px solid var(--c-border);
  background: var(--c-surface-raised);
  font-size: 11px;
  letter-spacing: 0.04em;
}

.slot i {
  font-size: 9px;
}

.slot.filled {
  border-left-color: var(--c-accent);
  color: var(--c-accent);
}

.slot.vacant {
  color: var(--c-text-muted);
  border-left-style: dashed;
}

.dot {
  width: 6px;
  height: 6px;
  border: 1px solid var(--c-text-muted);
  border-radius: 50%;
}

.quota {
  display: flex;
  align-items: center;
  gap: 6px;
}

.fill-quota {
  background: var(--c-accent);
}

.quota-value {
  flex: none;
  min-width: 34px;
  color: var(--c-text-muted);
  font-size: 10px;
  font-style: normal;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.rule {
  margin: 0;
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.4;
}

.sb-facts .wide {
  grid-column: 1 / -1;
}
</style>
