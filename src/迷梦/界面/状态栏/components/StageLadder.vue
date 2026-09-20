<template>
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-layer-group" />
      <span>关系阶段</span>
      <em class="hint">逐级推进 · 不可跳跃 · 不可回退</em>
    </header>

    <ol class="ladder">
      <li
        v-for="(rung, i) in STAGE_GATES"
        :key="rung.name"
        class="rung"
        :class="{ reached: i <= stage, current: i === stage }"
      >
        <span class="pip" :style="i <= stage ? { background: STAGE_COLORS[i] } : undefined" />
        <span class="rung-body">
          <span class="rung-top">
            <span class="rung-name">{{ rung.name }}</span>
            <span class="rung-index">{{ i }}</span>
          </span>
          <span class="rung-gate">{{ rung.gate }}</span>
        </span>
      </li>
    </ol>

    <p class="note">{{ STAGE_GATES[stage].note }}</p>
  </section>
</template>

<script setup lang="ts">
import { STAGE_COLORS, STAGE_GATES } from '../constants';

defineProps<{ stage: number }>();
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

.ladder {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.rung {
  display: flex;
  gap: 8px;
  padding: 4px 0 4px 2px;
  /* 未抵达的阶段压暗：她还没走到那一步（0.4 会掉到读不清，取 0.5） */
  opacity: 0.5;
  transition: opacity var(--t-hard);

  &.reached {
    opacity: 1;
  }

  &.current {
    background: rgb(213 209 200 / 5%);
  }
}

.pip {
  flex: none;
  width: 6px;
  height: 6px;
  margin-top: 6px;
  background: var(--c-border);
  transition: background var(--t-dream);
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
}

.rung-name {
  font-family: var(--font-serif);
  font-size: 12px;
  letter-spacing: 0.04em;
}

.rung-index {
  color: var(--c-text-muted);
  font-size: 9px;
  font-variant-numeric: tabular-nums;
}

.rung-gate {
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.02em;
}

.note {
  margin: 0;
  color: var(--c-primary);
  font-size: 11px;
  line-height: 1.5;
  opacity: 0.85;
}
</style>
