<template>
  <div class="sb-block">
    <header class="sb-head">
      <i class="fa-solid fa-cloud-sun" />
      <span>现场</span>
      <em class="sb-note">{{ weather }}</em>
    </header>

    <div class="events">
      <span class="events-head">
        <i class="fa-solid fa-scroll" />
        关键事件记录
        <em v-if="events.length">共 {{ events.length }} 条</em>
      </span>
      <ul v-if="events.length" class="event-list">
        <li v-for="(item, index) in events" :key="index">{{ item }}</li>
      </ul>
      <p v-else class="sb-empty">还没有记录下来的关键事件。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schema } from '../../../schema';

defineProps<{
  /** 世界.天气 */
  weather: Schema['世界']['天气'];
  /** 剧情.关键事件记录 */
  events: string[];
}>();
</script>

<style scoped>
.events {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.events-head {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.08em;
}

.events-head em {
  margin-left: auto;
  font-style: normal;
  opacity: 0.8;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.event-list li {
  padding-left: 8px;
  border-left: 2px solid var(--c-border);
  font-size: 11px;
  line-height: 1.4;
}
</style>
