<script setup lang="ts">
import { computed } from 'vue';
import { DEPTHS, WOMB_STATES } from '../constants';
import MeterRow from './MeterRow.vue';

/**
 * 她的子宫面板。人造子宫是本作的核心设定之一，因此与 小穴 分开成块，
 * 把「未激活 → 待着床 → 已着床 → 孕育中」这条线单独画出来。
 *
 * `inactive` 由 App 传入（低电量时压暗）。
 */
const props = defineProps<{
  state: string;
  chance: number;
  embryos: number;
  depth: string;
  inside: number;
  inactive: boolean;
}>();

const stateIndex = computed(() => {
  const i = (WOMB_STATES as readonly string[]).indexOf(props.state);
  return i < 0 ? 0 : i;
});

const active = computed(() => stateIndex.value > 0);
</script>

<template>
  <section class="block" :class="{ inactive }">
    <header class="block-head">
      <i class="fa-solid fa-egg" />
      <span>她的子宫</span>
      <em class="hint">人造子宫</em>
    </header>

    <ol class="ladder">
      <li v-for="(s, i) in WOMB_STATES" :key="s" class="rung" :class="{ reached: i <= stateIndex, current: i === stateIndex }">
        <span class="pip" :style="{ background: i <= stateIndex ? 'var(--c-warm)' : 'var(--c-border)' }" />
        <span class="rung-name">{{ s }}</span>
      </li>
    </ol>

    <div class="meters">
      <MeterRow label="受孕概率" :value="chance" unit="%" tone="var(--c-warm)" />
    </div>

    <dl class="facts">
      <div>
        <dt>胚胎数量</dt>
        <dd :class="{ marked: embryos > 0 }">{{ embryos }}</dd>
      </div>
      <div>
        <dt>着床深度</dt>
        <dd :class="{ marked: depth !== DEPTHS[0] }">{{ depth }}</dd>
      </div>
      <div>
        <dt>宫内精液</dt>
        <dd :class="{ marked: inside > 0 }">{{ inside }} ml</dd>
      </div>
    </dl>

    <p v-if="!active" class="note">机体处于封存后的低活跃状态，不具备受孕条件。</p>
  </section>
</template>

<style scoped>
.block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: opacity var(--t-hatch);
}

.inactive {
  opacity: 0.42;
}

.block-head {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-text-muted);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.block-head i {
  color: var(--c-warm);
}

.hint {
  margin-left: auto;
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.02em;
  opacity: 0.7;
}

.ladder {
  display: flex;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.rung {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1 1 0;
  padding: 3px 5px;
  background: var(--c-surface-raised);
  opacity: 0.45;
  transition: opacity var(--t-hatch);
}

.rung.reached {
  opacity: 1;
}

.rung.current {
  outline: 1px solid var(--c-warm);
  outline-offset: -1px;
}

.pip {
  flex: none;
  width: 5px;
  height: 5px;
  transition: background var(--t-hatch);
}

.rung-name {
  font-size: 10px;
  letter-spacing: 0.02em;
}

.meters {
  padding: 8px 9px;
  background: var(--c-surface-raised);
}

.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(84px, 1fr));
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
  font-family: var(--font-mono);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.facts dd.marked {
  color: var(--c-warm-text);
}

.note {
  margin: 0;
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.5;
}
</style>
