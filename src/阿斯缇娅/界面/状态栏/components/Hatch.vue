<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';

/**
 * 舱盖：一个可折叠的分区容器。
 *
 * 这是状态栏的骨架件 —— 它自己不管数据，只负责开合与外观。
 * 开合状态存进 localStorage，切楼层也保持玩家的选择。
 * `hazard` 打开时在手柄上显示警示斜纹，用于告警分区。
 */
const props = withDefaults(
  defineProps<{
    /** 标题（蚀刻字） */
    title: string;
    /** 右侧的短标注，如计数或状态 */
    note?: string;
    /** 折叠状态在 localStorage 中的键，需全卡唯一 */
    storageKey: string;
    /** 默认是否展开 */
    defaultOpen?: boolean;
    /** 手柄上的图标（FontAwesome 类名） */
    icon?: string;
    /** 是否显示警示斜纹 */
    hazard?: boolean;
  }>(),
  { note: '', defaultOpen: false, icon: 'fa-solid fa-caret-right', hazard: false },
);

const open = useLocalStorage(props.storageKey, props.defaultOpen);
</script>

<template>
  <section class="hatch" :class="{ open: open, hazard: hazard }">
    <button class="handle" type="button" @click="open = !open">
      <span class="hazard-bar" />
      <i :class="icon" class="handle-icon" />
      <span class="handle-title stencil">{{ title }}</span>
      <em v-if="note" class="handle-note">{{ note }}</em>
      <i class="fa-solid fa-chevron-down caret" :class="{ up: open }" />
    </button>

    <Transition name="bay">
      <div v-if="open" class="bay">
        <slot />
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.hatch {
  border: 1px solid var(--c-border);
  background: var(--c-surface);
}

.handle {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 11px 8px 12px;
  background: var(--c-surface-raised);
  border: 0;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.handle:hover {
  background: color-mix(in srgb, var(--c-border-hot) 22%, var(--c-surface-raised));
}

/* 手柄左侧的警示漆条 */
.hazard-bar {
  flex: none;
  width: 3px;
  align-self: stretch;
  background: var(--c-border-hot);
}

.hazard .hazard-bar {
  background-image: repeating-linear-gradient(
    45deg,
    var(--c-rust) 0 4px,
    var(--c-surface-sunken) 4px 8px
  );
}

.handle-icon {
  flex: none;
  color: var(--c-amber-text);
  font-size: 10px;
}

.handle-title {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 12px;
  color: var(--c-primary);
}

.handle-note {
  flex: none;
  color: var(--c-text-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  font-style: normal;
  font-variant-numeric: tabular-nums;
}

.caret {
  flex: none;
  color: var(--c-text-muted);
  font-size: 10px;
  transition: transform var(--t-hard);
}

.caret.up {
  transform: rotate(180deg);
}

.bay {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 11px 13px;
  border-top: 1px solid var(--c-border);
  background: var(--c-surface);
}

.bay-enter-active,
.bay-leave-active {
  transition: opacity var(--t-hatch);
}

.bay-enter-from,
.bay-leave-to {
  opacity: 0;
}
</style>
