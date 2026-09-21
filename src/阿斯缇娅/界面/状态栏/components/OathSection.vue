<script setup lang="ts">
import { computed } from 'vue';
import { OATH_NOTES, OATH_STATES } from '../constants';
import { useLocalStorage } from '@vueuse/core';

/**
 * 誓约：一枚素戒与一圈花瓣。
 *
 * 这个分区块刻意不用统一的琥珀／锈色 —— 誓约是整个界面里唯一一处暖粉色，
 * 因为它是她身上唯一一件与废土无关的东西。已缔结之后环上有一点微光，
 * 花瓣按亲密度长出片数：还没有身体接触时是光秃的素戒。
 *
 * 只读：状态与日期都来自 MVU 变量，界面不提供任何写回入口。
 */
const props = withDefaults(
  defineProps<{
    /** 誓约状态。字面与 schema.ts 的 阿斯缇娅.誓约.状态 一致 */
    state: string;
    /** 缔结日期 YYYY/MM/DD，未缔结为空串 */
    date?: string;
    /** 亲密度，只用来决定花瓣片数 */
    intimacy?: number;
  }>(),
  { date: '', intimacy: 0 },
);

const open = useLocalStorage('阿斯缇娅:sb:oath', false);

/** 收敛到合法状态，防止 AI 写进别的字面导致样式整块丢失 */
const state = computed(() => ((OATH_STATES as readonly string[]).includes(props.state) ? props.state : '未缔结'));
const sealed = computed(() => state.value === '已缔结');

/** 花瓣片数：素戒到满环。0 片是没有身体接触，6 片是亲密关系 */
const petals = computed(() => {
  if (!sealed.value) {
    return state.value === '未缔结' ? 0 : 2;
  }
  const n = Number(props.intimacy) || 0;
  return n >= 60 ? 6 : n >= 40 ? 4 : n >= 20 ? 2 : 3;
});

const note = computed(() => OATH_NOTES[state.value] ?? '');
const headNote = computed(() => (sealed.value && props.date ? `已缔结 · ${props.date}` : state.value));
const flowerClass = computed(() => (sealed.value ? 'oath-sealed' : state.value === '未缔结' ? 'oath-none' : 'oath-soft'));
</script>

<template>
  <section class="block oath" :class="flowerClass">
    <button class="block-head" type="button" @click="open = !open">
      <i class="fa-solid fa-ring" />
      <span class="stencil">誓约</span>
      <em class="head-note">{{ headNote }}</em>
      <i class="fa-solid fa-chevron-down caret" :class="{ up: open }" />
    </button>

    <!-- 素戒与花瓣 -->
    <div class="flower">
      <span class="ring">
        <span class="gem" />
        <span
          v-for="i in petals"
          :key="i"
          class="petal"
          :style="{ transform: `rotate(${30 + (i - 1) * (360 / petals)}deg) translateY(-10px)` }"
        />
      </span>
      <p class="flower-note">{{ note }}</p>
    </div>

    <Transition name="bay">
      <div v-if="open" class="bay">
        <dl class="facts">
          <div>
            <dt>缔结日期</dt>
            <dd>{{ sealed && date ? date : '尚无' }}</dd>
          </div>
          <div>
            <dt>戒指</dt>
            <dd>{{ sealed ? '已戴上。你的标识刻在她的底层代码里' : '需要先找到誓约之戒，再由她点头' }}</dd>
          </div>
        </dl>

        <p class="tail">
          {{
            sealed
              ? '她会把这件事当事实来用，也会把占有摆到台面上说。她把戒指取下来收好的时候，说明接下来要做的事不适合戴着它。'
              : '誓约之戒是战前格里芬的战术人形序列制品，环内侧有编号，不可复制。她不会当场答应，也不会说不，她会先问你一句。'
          }}
        </p>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 标题行整行可点，与折叠舱盖保持同一套手感 */
.block-head {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 0 0 5px;
  background: none;
  border: 0;
  border-bottom: 1px solid var(--c-border);
  color: var(--c-text-muted);
  font: inherit;
  font-size: 10px;
  text-align: left;
  cursor: pointer;
}

.block-head i {
  font-size: 9px;
  color: var(--oath);
}

.head-note {
  margin-left: auto;
  color: var(--oath-text);
  font-size: 10px;
  font-style: normal;
  letter-spacing: 0.06em;
}

.caret {
  flex: none;
  color: var(--c-text-muted);
  font-size: 9px;
  transition: transform var(--t-hard);
}

.caret.up {
  transform: rotate(180deg);
}

/* ── 素戒 ── */
.flower {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 9px;
  background: var(--c-surface-raised);
  border-left: 2px solid var(--oath);
}

.ring {
  position: relative;
  flex: none;
  width: 26px;
  height: 26px;
  border: 2px solid var(--oath);
  border-radius: 50%;
}

/* 环上的小石：一枚素戒只留这一点装饰 */
.gem {
  position: absolute;
  top: -4px;
  left: 50%;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  background: var(--oath-text);
  transform: rotate(45deg);
}

/* 缔结之后小石走一条很慢的呼吸，比警戒灯的节奏慢一半 */
.oath-sealed .gem {
  animation: glow 3.4s ease-in-out infinite;
}

/* ── 花瓣：围成一圈，长在环上 ── */
.petal {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  background: var(--oath);
  border-radius: 50% 0 50% 0;
  opacity: 0.5;
  transform-origin: center;
  transition:
    opacity var(--t-hatch),
    background var(--t-hatch);
}

.oath-sealed .petal {
  opacity: 0.92;
}

.flower-note {
  margin: 0;
  color: var(--c-primary);
  font-size: 11px;
  line-height: 1.55;
}

/* ── 展开区 ── */
.bay {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  padding-left: 7px;
  border-left: 2px solid var(--oath);
  color: var(--c-primary);
  font-size: 11px;
  line-height: 1.55;
}

.tail {
  margin: 0;
  color: var(--c-text-muted);
  font-size: 10px;
  line-height: 1.6;
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

<style scoped>
/* ── 三档粉色：只改令牌，不改结构 ── */
.oath-none {
  --oath: var(--c-oath-dim);
  --oath-text: var(--c-text-muted);
}

.oath-soft {
  --oath: var(--c-oath-soft);
  --oath-text: var(--c-oath-soft-text);
}

.oath-sealed {
  --oath: var(--c-oath);
  --oath-text: var(--c-oath-text);
}
</style>
