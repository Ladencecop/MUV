<template>
  <div class="sb-block">
    <header class="sb-head">
      <i class="fa-solid fa-flask" />
      <span>性经验账本</span>
      <em class="sb-note">{{ total > 0 ? `共 ${total} 次` : '尚无经历' }}</em>
    </header>

    <dl class="sb-facts">
      <div>
        <dt>口交 · 接收方</dt>
        <dd>{{ experience.口交.接收方 }}<em class="unit">次</em></dd>
      </div>
      <div>
        <dt>口交 · 服务方</dt>
        <dd>{{ experience.口交.服务方 }}<em class="unit">次</em></dd>
      </div>
      <div>
        <dt>性交</dt>
        <dd :class="{ marked: experience.性交 > 0 }">{{ experience.性交 }}<em class="unit">次</em></dd>
      </div>
      <div>
        <dt>肛交</dt>
        <dd :class="{ marked: experience.肛交 > 0 }">{{ experience.肛交 }}<em class="unit">次</em></dd>
      </div>
    </dl>

    <p class="rule">
      口交以开始到接收方高潮为止记一次，接收方与服务方各自独立计数。性交与肛交从肉棒插入开始、到男方射精为止记一次，其间女方高潮多少次都不改变计数。
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Schema } from '../../../schema';

const props = defineProps<{
  /** 千羽.性经验 */
  experience: Schema['千羽']['性经验'];
}>();

const total = computed(
  () =>
    (Number(props.experience.口交.接收方) || 0) +
    (Number(props.experience.口交.服务方) || 0) +
    (Number(props.experience.性交) || 0) +
    (Number(props.experience.肛交) || 0),
);
</script>

<style scoped>
.unit {
  margin-left: 3px;
  color: var(--c-text-muted);
  font-size: 9px;
  font-style: normal;
}

.marked {
  color: var(--c-arousal);
}

.rule {
  margin: 0;
  padding-top: 5px;
  border-top: 1px solid var(--c-border);
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.4;
}
</style>
