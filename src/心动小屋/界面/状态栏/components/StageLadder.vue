<template>
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-layer-group" />
      <span>关系状态</span>
      <em class="hint">逐级递增不可跳跃</em>
    </header>

    <ol class="ladder">
      <li v-for="(step, index) in STEPS" :key="step.name" class="rung" :class="{ reached: index <= stage, current: index === stage }">
        <span class="pip" />
        <span class="rung-body">
          <span class="rung-name">{{ step.name }}</span>
          <span class="rung-cond">{{ step.condition }}</span>
        </span>
      </li>
    </ol>

    <p class="note">{{ STEPS[stage].note }}</p>
  </section>
</template>

<script setup lang="ts">
import { clamp } from '../utils';
import { computed } from 'vue';

const props = defineProps<{ stage: number }>();

const STEPS = [
  {
    name: '戒备与疏离',
    condition: '初始状态',
    note: '她把你与记忆里那个人逐条比对，从不说出口。',
  },
  {
    name: '好奇和友谊',
    condition: '好感度 ≥ 20，且明确表现出接受与不反感',
    note: '比较结束。她开始记得你说过的细节，并在别处用上。',
  },
  {
    name: '暧昧和拉扯',
    condition: '好感度 ≥ 50，且发生明确的暧昧对话或行为',
    note: '她主动制造独处，并为此找一个功能性借口。自此阶段起，存在发生性行为的可能性。',
  },
  {
    name: '爱恋和自省',
    condition: '好感度 ≥ 75，且关系被明确确立',
    note: '她开始允许自己留下。发生性行为本身不足以推进到这一档。',
  },
  {
    name: '亲密和坦白',
    condition: '好感度 ≥ 100，且在恋人关系中受到极大情感触动',
    note: '她第一次主动承认舒服与在意，且不追加任何否认。',
  },
];

const stage = computed(() => clamp(Math.round(props.stage), 0, 4));
</script>

<style lang="scss" scoped>
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

.block-head .hint {
  margin-left: auto;
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.02em;
  opacity: 0.7;
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
  opacity: 0.42;
  transition: opacity 300ms;
}

.rung.reached {
  opacity: 1;
}

.rung.current {
  background: rgb(143 184 216 / 8%);
}

.pip {
  flex: none;
  width: 6px;
  height: 6px;
  margin-top: 6px;
  background: var(--c-border);
}

.rung.reached .pip {
  background: var(--c-stage-2);
}

.rung:nth-child(2).reached .pip {
  background: var(--c-stage-1);
}

.rung:nth-child(4).reached .pip {
  background: var(--c-stage-3);
}

.rung:nth-child(5).reached .pip {
  background: var(--c-stage-4);
}

.rung.current .pip {
  box-shadow: 0 0 0 2px rgb(143 184 216 / 25%);
}

.rung-body {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
}

.rung-name {
  font-size: 12px;
  letter-spacing: 0.03em;
}

.rung-cond {
  color: var(--c-text-muted);
  font-size: 10px;
}

.note {
  margin: 0;
  padding-top: 2px;
  color: var(--c-primary);
  font-size: 11px;
  opacity: 0.85;
}
</style>
