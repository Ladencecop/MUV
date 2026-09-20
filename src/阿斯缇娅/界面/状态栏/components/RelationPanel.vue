<script setup lang="ts">
import { computed } from 'vue';
import { INTIMACY_GATES, INTIMACY_STATES, STAGE_COLORS, STAGE_GATES, STAGE_TEXT_COLORS } from '../constants';
import MeterRow from './MeterRow.vue';

/**
 * 关系面板：好感度 / 信任度 / 亲密度三条互相独立的刻度，加关系阶段阶梯。
 *
 * 阶段推进条件只作展示（`gate` 抄自 schema.ts），界面不自己算阶段。
 */
const props = defineProps<{
  stage: string;
  affection: number;
  trust: number;
  intimacy: number;
  intimacyState: string;
}>();

const stageIndex = computed(() => {
  const i = (STAGE_GATES as readonly { name: string }[]).findIndex((s) => s.name === props.stage);
  return i < 0 ? 0 : i;
});

const stageColor = computed(() => STAGE_COLORS[stageIndex.value]);
const stageTextColor = computed(() => STAGE_TEXT_COLORS[stageIndex.value]);
const intimacyIndex = computed(() => (INTIMACY_STATES as readonly string[]).indexOf(props.intimacyState));
</script>

<template>
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-link" />
      <span>关系</span>
      <em class="stage" :style="{ color: stageTextColor, borderColor: stageTextColor }">{{ stage }}</em>
    </header>

    <div class="meters">
      <MeterRow label="好感度" :value="affection" tone="var(--c-amber)" />
      <MeterRow label="信任度" :value="trust" tone="var(--c-power)" />
      <MeterRow label="亲密度" :value="intimacy" tone="var(--c-intimacy)" />
    </div>

    <ol class="ladder">
      <li
        v-for="(s, i) in STAGE_GATES"
        :key="s.name"
        class="rung"
        :class="{ reached: i <= stageIndex, current: i === stageIndex }"
      >
        <span class="pip" :style="{ background: i <= stageIndex ? STAGE_COLORS[i] : 'var(--c-border)' }" />
        <div class="rung-body">
          <div class="rung-top">
            <span class="rung-name" :style="{ color: i === stageIndex ? stageTextColor : undefined }">{{ s.name }}</span>
            <span class="rung-gate">{{ s.gate }}</span>
          </div>
          <p v-if="i === stageIndex" class="note">{{ s.note }}</p>
        </div>
      </li>
    </ol>

    <div class="intimacy">
      <span class="label">亲密状态</span>
      <ol class="states">
        <li
          v-for="(s, i) in INTIMACY_STATES"
          :key="s"
          class="state"
          :class="{ on: i <= intimacyIndex }"
          :title="INTIMACY_GATES[s]"
        >
          {{ s }}
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.block-head {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.stage {
  margin-left: auto;
  padding: 1px 6px;
  font-size: 10px;
  font-style: normal;
  letter-spacing: 0.1em;
  border: 1px solid;
  transition:
    color var(--t-hatch),
    border-color var(--t-hatch);
}

.meters {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 9px;
  background: var(--c-surface-raised);
}

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
  background: color-mix(in srgb, var(--c-amber) 7%, transparent);
}

.pip {
  flex: none;
  width: 6px;
  height: 6px;
  margin-top: 6px;
  transition: background var(--t-hatch);
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
  letter-spacing: 0.04em;
}

.rung-gate {
  color: var(--c-text-muted);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.02em;
}

.note {
  margin: 1px 0 0;
  color: var(--c-primary);
  font-size: 10px;
  line-height: 1.5;
  opacity: 0.85;
}

.intimacy {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 6px;
  border-top: 1px solid var(--c-border);
}

.label {
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.states {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.state {
  padding: 2px 7px;
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.04em;
  border: 1px solid var(--c-border);
  transition:
    color var(--t-hatch),
    border-color var(--t-hatch);
}

.state.on {
  color: var(--c-intimacy-text);
  border-color: var(--c-intimacy);
}
</style>
