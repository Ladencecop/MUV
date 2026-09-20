<template>
  <section class="block">
    <header class="block-head">
      <i class="fa-solid fa-scale-unbalanced" />
      <span>恨意 · 欲望</span>
      <em class="hint">两条线各自独立，不合成一条</em>
    </header>

    <!--
      对冲双轨：两根条共享同一条中轴刻度，但一根自右端向左推、一根自左端向右推。
      两人之间的拉扯直接画成「相向而行」——最恨的时候欲望最强，两条都顶到中线附近。
      它们**始终是两根有独立标签与独立数值的条**，不求和、不画成单一双向条。
    -->
    <div class="axis">
      <div class="track-row">
        <span class="tag tag-hate">恨</span>
        <span class="track">
          <span class="fill fill-hate" :style="{ width: `${hate}%` }" />
        </span>
        <em class="num num-hate">{{ hate }}</em>
      </div>

      <div class="track-row">
        <span class="tag tag-desire">欲</span>
        <span class="track">
          <span class="fill fill-desire" :style="{ width: `${desire}%` }" />
        </span>
        <em class="num num-desire">{{ desire }}</em>
      </div>
    </div>

    <p class="read">{{ read }}</p>

    <footer class="ranges">
      <span>恨 单次 -3 ~ +5</span>
      <span>欲 单次 -2 ~ +8</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { percent } from '../utils';

const props = defineProps<{ hate: number; desire: number }>();

const hate = computed(() => Math.round(percent(props.hate)));
const desire = computed(() => Math.round(percent(props.desire)));

/**
 * 只描述两条线当前的关系，不做任何「合成判定」。
 * 措辞严格贴在 schema 的约束上：两条线独立，不允许互相带动。
 */
const read = computed(() => {
  const h = hate.value;
  const d = desire.value;
  if (h >= 70 && d >= 70) {
    return '最恨的时候欲望最强——这就是全部的张力所在。';
  }
  if (h >= 70 && d < 30) {
    return '恨意高企，欲望还没跟上。她还在用三十年前那张牌照跟你算账。';
  }
  if (h < 40 && d >= 60) {
    return '恨在松动，欲望先动了。她不会承认这件事。';
  }
  return '两条线各自走，谁也不牵谁。';
});
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

.axis {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.track-row {
  display: flex;
  align-items: center;
  gap: 7px;
}

.tag {
  flex: none;
  width: 15px;
  font-family: var(--font-serif);
  font-size: 12px;
  line-height: 1;
  text-align: center;
}

.tag-hate {
  color: var(--c-hate-text);
}

.tag-desire {
  color: var(--c-desire-text);
}

.track {
  position: relative;
  flex: 1 1 auto;
  height: 5px;
  background: var(--c-border);
}

/* 共享中轴：两根条朝这里推进 */
.track::after {
  content: '';
  position: absolute;
  top: -3px;
  bottom: -3px;
  left: 50%;
  width: 1px;
  background: var(--c-text-muted);
  opacity: 0.55;
}

.fill {
  position: absolute;
  top: 0;
  bottom: 0;
  transition: width var(--t-dream);
}

/* 恨：锚在右端，向左推 */
.fill-hate {
  right: 0;
  background: var(--c-hate);
}

/* 欲：锚在左端，向右推 */
.fill-desire {
  left: 0;
  background: var(--c-desire);
}

.num {
  flex: none;
  min-width: 26px;
  font-size: 12px;
  font-style: normal;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.num-hate {
  color: var(--c-hate-text);
}

.num-desire {
  color: var(--c-desire-text);
}

.read {
  margin: 0;
  color: var(--c-primary);
  font-size: 11px;
  line-height: 1.5;
  opacity: 0.85;
}

.ranges {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-top: 4px;
  border-top: 1px solid var(--c-border);
  color: var(--c-text-muted);
  font-size: 9px;
  letter-spacing: 0.04em;
}
</style>
