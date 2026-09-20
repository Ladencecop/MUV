import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';

/**
 * 酒馆助手把界面塞进消息楼层的 iframe 里运行。部分环境下这个 iframe 缺 SVGElement，
 * 而 Vue 的 app.mount() 一进来就用 `container instanceof SVGElement` 判断命名空间
 * （相邻的 MathMLElement 那支有 typeof 保护，SVGElement 这支没有），
 * 缺了就会直接抛 "Right-hand side of 'instanceof' is not an object" 并让整个界面白屏。
 *
 * 补一个空构造器即可：instanceof 恒为 false，等于告诉 Vue「这是个普通 HTML 容器」，
 * 也就是事实。界面本身不使用 SVG（周期环用 conic-gradient 绘制）。
 */
function ensure_svg_element(): boolean {
  const scope = window as unknown as Record<string, unknown>;
  if (typeof scope.SVGElement === 'function') {
    return true;
  }
  scope.SVGElement = function SVGElement() {};
  return false;
}

/** 收集运行时环境信息，挂载失败时直接显示在楼层里，免得只能靠猜。 */
function environment_report(): Record<string, string | boolean> {
  const scope = window as unknown as Record<string, unknown>;
  return {
    界面地址: String(location.href).slice(0, 80),
    文档状态: document.readyState,
    挂载点: !!document.querySelector('#app'),
    SVGElement类型: typeof scope.SVGElement,
    SVGElement在window上: 'SVGElement' in scope,
    Element类型: typeof scope.Element,
    MathMLElement类型: typeof scope.MathMLElement,
    ShadowRoot类型: typeof scope.ShadowRoot,
    Vue类型: typeof scope.Vue,
    Vue版本: typeof scope.Vue === 'object' ? String((scope.Vue as { version?: string }).version ?? '?') : '?',
    lodash: typeof scope._,
    jQuery: typeof scope.$,
    Mvu: typeof scope.Mvu,
  };
}

function show_report(title: string, detail: string): void {
  const host = document.querySelector('#app');
  if (!host) {
    return;
  }
  const box = document.createElement('pre');
  box.style.cssText =
    'margin:0;padding:10px 12px;white-space:pre-wrap;word-break:break-all;' +
    'font:11px/1.5 monospace;color:#e0545f;background:#171d24;border:1px solid #e0545f;';
  box.textContent = `${title}\n${detail}`;
  host.textContent = '';
  host.appendChild(box);
}

async function init(): Promise<void> {
  const report = environment_report();
  console.info('[她和他] 状态栏环境', report);

  if (!ensure_svg_element()) {
    console.warn('[她和他] 该 iframe 缺少 SVGElement，已补空构造器供 Vue 判断命名空间');
  }

  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));

  try {
    createApp(App).use(createPinia()).mount('#app');
    console.info('[她和他] 状态栏已挂载');
  } catch (error) {
    const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    console.error('[她和他] 状态栏挂载失败', error);
    show_report(
      '状态栏挂载失败',
      `${detail}\n\n环境：\n${Object.entries(report)
        .map(([key, value]) => `  ${key} = ${value}`)
        .join('\n')}`,
    );
  }
}

$(() => {
  errorCatched(init)();
});
