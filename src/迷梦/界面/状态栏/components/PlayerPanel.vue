<template>
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-user-tie" />
      <span>你的牌面</span>
      <em class="hint">姓名 / 年龄 / 外貌 / 背景 / 动机由你自定</em>
    </header>

    <div class="assets">
      <span class="label">筹码与资产</span>
      <p class="assets-text">{{ player.筹码与资产 }}</p>
    </div>

    <div class="intel">
      <span class="label">已掌握的情报<em class="count">{{ list.length }} 项</em></span>
      <ul v-if="list.length" class="intel-list">
        <li v-for="(item, index) in list" :key="index">
          <i class="fa-solid fa-circle-check" />
          <span>{{ item }}</span>
        </li>
      </ul>
      <p v-else class="intel-empty">还没有任何一条能拿住人的东西。</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Schema } from '../../../schema';

const props = defineProps<{ player: Schema['玩家'] }>();

const list = computed(() => (Array.isArray(props.player.已掌握的情报) ? props.player.已掌握的情报 : []));
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

.label {
  display: flex;
  align-items: baseline;
  gap: 6px;
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.count {
  margin-left: auto;
  font-style: normal;
  font-variant-numeric: tabular-nums;
}

/* 筹码：金色 —— 这是你手里唯一能上桌的东西 */
.assets {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.assets-text {
  margin: 0;
  padding-left: 7px;
  border-left: 2px solid var(--c-gold);
  color: var(--c-primary);
  font-size: 11px;
  line-height: 1.55;
}

.intel {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 5px;
  border-top: 1px solid var(--c-border);
}

.intel-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 11px;
    line-height: 1.5;
  }

  i {
    flex: none;
    color: var(--c-gold);
    font-size: 9px;
  }
}

.intel-empty {
  margin: 0;
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.5;
}
</style>
