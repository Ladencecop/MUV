<template>
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-comments" />
      <span>精选弹幕</span>
      <em class="hint">本场实时弹幕</em>
    </header>

    <ul v-if="has_any" class="list">
      <li v-for="item in danmaku" :key="item.kind" class="item" :class="`kind-${item.kind}`">
        <span class="kind">{{ item.label }}</span>
        <span class="text">{{ item.text || '暂无' }}</span>
      </li>
    </ul>

    <p v-else class="empty">直播间还没刷起来，走一步看看观众怎么说。</p>
  </section>
</template>

<script setup lang="ts">
import { useDanmaku } from '../danmaku';

const { danmaku, has_any } = useDanmaku();
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

.list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  display: flex;
  align-items: baseline;
  gap: 7px;
  padding: 5px 8px;
  background: var(--c-surface-raised);
  border-left: 2px solid var(--c-border);
}

.item.kind-bless {
  border-left-color: var(--c-affection);
}

.item.kind-snark {
  border-left-color: var(--c-warning);
}

.item.kind-lewd {
  border-left-color: var(--c-danger);
}

.kind {
  flex: none;
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.kind-bless .kind {
  color: var(--c-affection);
}

.kind-snark .kind {
  color: var(--c-warning);
}

.kind-lewd .kind {
  color: var(--c-danger);
}

.text {
  font-size: 11px;
  line-height: 1.45;
}

.kind-lewd .text {
  color: #f0c2c4;
}

.empty {
  margin: 0;
  color: var(--c-text-muted);
  font-size: 10px;
}
</style>
