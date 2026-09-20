<template>
  <div class="sb-block">
    <header class="sb-head">
      <i class="fa-solid fa-layer-group" />
      <span>关系阶段</span>
      <em class="sb-note" :style="{ color: stage_color }">{{ current_name }}</em>
    </header>

    <ol class="ladder">
      <li
        v-for="(rung, index) in rungs"
        :key="index"
        class="rung"
        :class="{ reached: index <= display_stage, current: index === display_stage }"
      >
        <span class="pip" />
        <span class="rung-body">
          <span class="rung-name">{{ rung.name }}</span>
          <span class="rung-cond">{{ rung.condition }}</span>
        </span>
      </li>
    </ol>

    <p class="goal">
      <i class="fa-solid fa-bullseye" />
      <span>{{ goal }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { STAGE_COLORS, STAGE_DISPLAY_MAX, STAGE_LADDER } from '../constants';

const props = defineProps<{
  /** 千羽.关系阶段 */
  stage: number;
  /** 剧情.当前阶段目标 */
  goal: string;
}>();

/** 阶梯只画前四格；阶段 4 是越界兜底，显示上并入多妻处境。 */
const rungs = computed(() => STAGE_LADDER.slice(0, STAGE_DISPLAY_MAX + 1));
const display_stage = computed(() => _.clamp(Math.round(props.stage), 0, STAGE_DISPLAY_MAX));
const current_name = computed(() => STAGE_LADDER[display_stage.value].name);
const stage_color = computed(() => STAGE_COLORS[display_stage.value]);
</script>

<style scoped>
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
  opacity: 0.42;
  transition: opacity 300ms ease;
}

.rung.reached {
  opacity: 1;
}

.rung.current {
  background: rgb(111 211 180 / 8%);
}

.pip {
  flex: none;
  width: 6px;
  height: 6px;
  margin-top: 6px;
  background: var(--c-border);
}

.rung.reached .pip {
  background: var(--c-stage-1);
}

.rung:nth-child(2).reached .pip {
  background: var(--c-stage-1);
}

.rung:nth-child(3).reached .pip {
  background: var(--c-stage-2);
}

.rung:nth-child(4).reached .pip {
  background: var(--c-stage-3);
}

.rung.current .pip {
  box-shadow: 0 0 0 2px rgb(143 176 216 / 25%);
}

.rung-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.rung-name {
  font-size: 12px;
  letter-spacing: 0.03em;
}

.rung-cond {
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.35;
}

.goal {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 2px 0 0;
  padding-top: 6px;
  border-top: 1px solid var(--c-border);
  font-size: 11px;
}

.goal i {
  flex: none;
  color: var(--c-accent);
  font-size: 10px;
}
</style>
