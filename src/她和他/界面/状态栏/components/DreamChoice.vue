<template>
  <div class="sb-block">
    <header class="sb-head">
      <i class="fa-solid fa-moon" />
      <span>梦境选球</span>
      <em class="sb-note">每次性交后重做一次</em>
    </header>

    <div class="current">
      <span class="orb" :style="{ background: meta.color }" />
      <span class="current-body">
        <span class="current-label" :style="{ color: meta.color }">{{ meta.label }}</span>
        <span class="current-note">{{ meta.note }}</span>
      </span>
    </div>

    <dl class="sb-facts">
      <div>
        <dt>金色球体</dt>
        <dd class="gold">减少值减半、增加值翻倍</dd>
      </div>
      <div>
        <dt>紫色球体</dt>
        <dd class="violet">减少值翻倍、增加值减半</dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Schema } from '../../../schema';
import { DREAMS } from '../constants';

const props = defineProps<{
  /** 千羽.梦境选择 */
  dream: Schema['千羽']['梦境选择'];
}>();

const meta = computed(() => DREAMS[props.dream] ?? DREAMS.未经历);
</script>

<style scoped>
.current {
  display: flex;
  align-items: center;
  gap: 8px;
}

.orb {
  flex: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentcolor;
}

.current-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.current-label {
  font-size: 12px;
  letter-spacing: 0.04em;
}

.current-note {
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.35;
}

.gold {
  color: var(--c-dream-gold);
}

.violet {
  color: var(--c-dream-violet);
}
</style>
