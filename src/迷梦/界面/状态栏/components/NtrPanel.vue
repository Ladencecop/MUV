<template>
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-people-arrows" />
      <span>NTR</span>
      <em class="hint">默认存在 · 不设开关</em>
    </header>

    <ul class="directions">
      <li v-for="direction in NTR_DIRECTIONS" :key="direction.code" class="direction" :class="{ on: is_on(direction.name) }">
        <span class="dir-top">
          <span class="code">{{ direction.code }}</span>
          <span class="name">{{ direction.name }}</span>
          <em class="state">{{ is_on(direction.name) ? '已激活' : '未启动' }}</em>
        </span>
        <span class="meaning">{{ direction.meaning }}</span>
        <span v-if="is_on(direction.name)" class="while-active">{{ direction.while_active }}</span>
      </li>
    </ul>

    <p class="note">三个方向不会因为你不选就不存在：她可以自己拿去当筹码，你也可以亲手把她推出去。</p>
  </section>
</template>

<script setup lang="ts">
import type { Schema } from '../../../schema';
import { NTR_DIRECTIONS } from '../constants';

const props = defineProps<{ ntr: Schema['NTR'] }>();

type DirectionName = (typeof NTR_DIRECTIONS)[number]['name'];

/** `none` 表示该方向当前未激活；界面只读这个状态，不提供任何切换控件。 */
function is_on(name: DirectionName): boolean {
  return props.ntr[name] !== 'none';
}
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

.directions {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.direction {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 9px;
  background: var(--c-surface-raised);
  border-left: 2px solid var(--c-border);
  opacity: 0.62;
  transition:
    border-color var(--t-hard),
    opacity var(--t-hard);

  /* 已激活：与失控度同色 —— NTR 生效的每一个夜晚都直接推高失控度，两者同源 */
  &.on {
    border-left-color: var(--c-reckless);
    opacity: 1;
  }
}

.dir-top {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.code {
  flex: none;
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.08em;
}

.direction.on .code {
  color: var(--c-reckless-text);
}

.name {
  font-size: 12px;
  letter-spacing: 0.03em;
}

.state {
  margin-left: auto;
  padding: 0 5px;
  color: var(--c-text-muted);
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.06em;
  border: 1px solid var(--c-border);
}

.direction.on .state {
  color: var(--c-reckless-text);
  border-color: var(--c-reckless-text);
}

.meaning {
  color: var(--c-primary);
  font-size: 10px;
  line-height: 1.5;
  opacity: 0.8;
}

.while-active {
  color: var(--c-reckless-text);
  font-size: 10px;
  line-height: 1.5;
  opacity: 0.9;
}

.note {
  margin: 0;
  color: var(--c-text-muted);
  font-size: 9px;
  line-height: 1.5;
}
</style>
