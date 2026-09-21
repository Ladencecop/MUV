<script setup lang="ts">
import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { OATH_NOTES, OATH_STATES } from '../constants';

/**
 * 誓约：一枚素戒，与铺在这一段背景里的花瓣。
 *
 * 素戒的形状是「十二边形外轮廓 + 正圆内壁」。它必须画成一条填充的环带，
 * 而不是两条描边 —— 描边只能多边形，内壁会跟着变成十二边形。做法是在同一条
 * path 里写两个子路径（外十二边形 + 内正圆），靠 fill-rule: evenodd 挖出中间的孔。
 *
 * 花瓣是背景装饰，不是挂在戒指上的东西：它们散在这一段的四角与边缘，低透明度，
 * 片数按亲密度长。未缔结时压暗到几乎看不见。
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

/* ── 素戒的几何：外半径 23 的十二边形，内圆半径 16，环带 7px ── */
const CX = 26;
const R_OUT = 23;
const R_IN = 16;

/** 十二边形顶点：角度从正上方起算，避免出现一条水平的顶边 */
const outerPath = computed(() => {
  const pts: string[] = [];
  for (let i = 0; i < 12; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 12;
    pts.push(`${(CX + R_OUT * Math.cos(a)).toFixed(2)} ${(CX + R_OUT * Math.sin(a)).toFixed(2)}`);
  }
  return `M ${pts.join(' L ')} Z`;
});

/** 正圆：两段半圆弧拼成 */
const innerPath = computed(
  () =>
    `M ${CX - R_IN} ${CX} A ${R_IN} ${R_IN} 0 1 0 ${CX + R_IN} ${CX} ` +
    `A ${R_IN} ${R_IN} 0 1 0 ${CX - R_IN} ${CX} Z`,
);

const ringPath = computed(() => `${outerPath.value} ${innerPath.value}`);

/** 收敛到合法状态，防止 AI 写进别的字面导致样式整块丢失 */
const state = computed(() =>
  (OATH_STATES as readonly string[]).includes(props.state) ? props.state : '未缔结',
);
const sealed = computed(() => state.value === '已缔结');

/**
 * 花瓣的落位。前几个贴四角与边缘，越往后越往中间散。
 * 写成静态表而不是随机：同一个存档每次渲染的位置必须一致。
 */
const PETAL_SLOTS = [
  { w: 62, h: 62, top: '-24px', left: '-16px', rot: 22 },
  { w: 52, h: 52, bottom: '-24px', right: '-12px', rot: -30 },
  { w: 34, h: 34, top: '54%', right: '9%', rot: 58 },
  { w: 40, h: 40, bottom: '-16px', left: '26%', rot: -14 },
  { w: 28, h: 28, top: '10%', right: '30%', rot: 46 },
  { w: 32, h: 32, top: '46%', left: '12%', rot: -52 },
  { w: 26, h: 26, top: '-14px', left: '38%', rot: 34 },
  { w: 30, h: 30, bottom: '6%', right: '38%', rot: -22 },
  { w: 24, h: 24, top: '30%', left: '46%', rot: 62 },
];

/** 花瓣片数：未缔结不画，已缔结按亲密度长 */
const petals = computed(() => {
  if (!sealed.value) return 0;
  const n = Number(props.intimacy) || 0;
  return n >= 60 ? 9 : n >= 40 ? 6 : n >= 20 ? 3 : 2;
});

/** 每片花瓣的定位。用内联样式只放几何，颜色一律走 CSS 类 */
const petalStyle = (i: number) => {
  const s = PETAL_SLOTS[i % PETAL_SLOTS.length];
  const pos: string[] = [];
  if (s.top) pos.push(`top:${s.top}`);
  if (s.bottom) pos.push(`bottom:${s.bottom}`);
  if (s.left) pos.push(`left:${s.left}`);
  if (s.right) pos.push(`right:${s.right}`);
  return [
    `width:${s.w}px`,
    `height:${s.h}px`,
    ...pos,
    `transform:rotate(${s.rot}deg)`,
  ].join(';');
};

const note = computed(() => OATH_NOTES[state.value] ?? '');
const headNote = computed(() => (sealed.value && props.date ? `已缔结 · ${props.date}` : state.value));
</script>

<template>
  <section class="oath" :class="sealed ? 'oath-sealed' : 'oath-none'">
    <!-- 背景花瓣：贴在这一段的底上，不参与交互 -->
    <div class="deco" aria-hidden="true">
      <span v-for="i in petals" :key="i" class="petal" :style="petalStyle(i - 1)" />
    </div>

    <button class="block-head" type="button" @click="open = !open">
      <i class="fa-solid fa-ring" />
      <span class="stencil">誓约</span>
      <em class="head-note">{{ headNote }}</em>
      <i class="fa-solid fa-chevron-down caret" :class="{ up: open }" />
    </button>

    <div class="flower">
      <svg class="ring" width="56" height="56" viewBox="0 0 52 52">
        <path :d="ringPath" fill-rule="evenodd" />
      </svg>
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
.oath {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  padding: 9px 11px 10px;
  background: var(--c-surface-raised);
  border-left: 2px solid var(--oath);
}

/* ── 背景花瓣 ── */
.deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.petal {
  position: absolute;
  background: var(--oath);
  /* 两个圆角对角 + 两个近直角，才是花瓣的样子 */
  border-radius: 70% 8% 70% 8%;
  opacity: 0.17;
  transition: opacity var(--t-hatch);
}

.oath-none .petal {
  opacity: 0.07;
}

/* 正文压在花瓣上面 */
.block-head,
.flower,
.bay {
  position: relative;
}

/* ── 标题行 ── */
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
}

.ring {
  flex: none;
  display: block;
}

.ring path {
  fill: var(--oath);
}

/* 呼吸加在整个戒指上，环与内壁一起明暗；两档都走，强度不同 */
.ring {
  animation: breathe 3.4s ease-in-out infinite;
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

/* ── 两档粉色：只改变量，不动结构 ── */
.oath-none {
  --oath: var(--c-oath-dim);
  --oath-text: var(--c-text-muted);
  --oath-glow: 3px;
}

.oath-sealed {
  --oath: var(--c-oath);
  --oath-text: var(--c-oath-text);
  --oath-glow: 6px;
}
</style>
