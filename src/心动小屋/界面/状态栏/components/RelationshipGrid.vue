<template>
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-user-group" />
      <span>女嘉宾</span>
      <em class="hint">关系仅两档，好感度只决定态度</em>
    </header>

    <ul class="grid">
      <li v-for="guest in guests" :key="guest.key" class="guest" :class="{ intimate: is_intimate(guest) }">
        <span class="guest-top">
          <span class="guest-name">{{ guest.name }}</span>
          <span class="guest-tag">{{ guest.tag }}</span>
        </span>

        <span class="guest-state">
          <i class="fa-solid" :class="is_intimate(guest) ? 'fa-heart' : 'fa-handshake'" />
          {{ relations[guest.key].关系 }}
        </span>

        <span class="guest-affection">
          <span class="aff-label">好感度</span>
          <span class="aff-bar">
            <span class="aff-fill" :style="{ width: `${clamp(relations[guest.key].好感度, 0, 100)}%` }" />
          </span>
          <em class="aff-value">{{ relations[guest.key].好感度 }}</em>
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { clamp } from '../utils';
import type { Schema } from '../../../schema';

const props = defineProps<{
  relations: { 温典溪: Schema['温典溪']; 千羽: Schema['千羽'] };
}>();

const relations = computed(() => props.relations);

const guests: { key: '温典溪' | '千羽'; name: string; tag: string }[] = [
  { key: '温典溪', name: '温典溪', tag: '小太阳 · 集团千金' },
  { key: '千羽', name: '千羽', tag: '电竞选手' },
];

const is_intimate = (guest: { key: '温典溪' | '千羽' }) => relations.value[guest.key].关系 === '炮友';
</script>

<style lang="scss" scoped>
.block {
  display: flex;
  flex-direction: column;
  gap: 6px;
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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.guest {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 7px 9px;
  background: var(--c-surface-raised);
  border-left: 2px solid var(--c-affection);
}

.guest.intimate {
  border-left-color: var(--c-thaw);
}

.guest-top {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.guest-name {
  font-size: 12px;
  letter-spacing: 0.04em;
}

.guest-tag {
  color: var(--c-text-muted);
  font-size: 9px;
}

.guest-state {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--c-primary);
  font-size: 11px;
}

.guest-state i {
  font-size: 10px;
  color: var(--c-affection);
}

.guest.intimate .guest-state i {
  color: var(--c-thaw);
}

.guest-affection {
  display: flex;
  align-items: center;
  gap: 6px;
}

.aff-label {
  flex: none;
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.aff-bar {
  position: relative;
  flex: 1 1 auto;
  height: 3px;
  background: var(--c-border);
}

.aff-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--c-affection);
  transition: width 200ms;
}

.guest.intimate .aff-fill {
  background: var(--c-thaw);
}

.aff-value {
  flex: none;
  color: var(--c-text-muted);
  font-size: 10px;
  font-style: normal;
  font-variant-numeric: tabular-nums;
}
</style>
