<template>
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-user" />
      <span>玩家</span>
      <em class="hint">姓名 / 年龄 / 现状由你自定</em>
    </header>

    <dl class="facts">
      <div class="wide">
        <dt>前职业选手</dt>
        <dd :class="{ exposed: player.前职业选手 !== '未暴露' }">{{ player.前职业选手 }}</dd>
      </div>
      <div>
        <dt>观众人气</dt>
        <dd class="bar-cell">
          <span class="bar">
            <span class="bar-fill" :style="{ width: `${clamp(player.观众人气, 0, 100)}%` }" />
          </span>
          <em>{{ player.观众人气 }}</em>
        </dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { clamp } from '../utils';
import type { Schema } from '../../../schema';

defineProps<{ player: Schema['玩家'] }>();
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

.facts {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0;
}

.facts > div {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.facts dt {
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.06em;
}

.facts dd {
  margin: 0;
  font-size: 11px;
}

.facts dd.exposed {
  color: var(--c-warning);
}

.bar-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bar {
  position: relative;
  flex: 1 1 auto;
  height: 4px;
  background: var(--c-border);
}

.bar-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--c-primary);
  transition: width 200ms;
}

.bar-cell em {
  font-size: 11px;
  font-style: normal;
  font-variant-numeric: tabular-nums;
}
</style>
