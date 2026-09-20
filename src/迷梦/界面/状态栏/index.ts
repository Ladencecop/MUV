import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';

/**
 * 渲染失败时才把诊断面板画进 iframe。
 *
 * 与参考项目不同，这里不做「始终可见的启动探针」：正常路径下界面里只该有状态栏本身。
 * 每一步仍写 console，便于在酒馆控制台里定位；只有当界面真的渲染不出来时，
 * 才在页面上留一块显眼的说明，否则玩家只会看到一片空白而无从判断。
 */
function report_error(text: string) {
  console.error('[迷梦 状态栏]', text);
  if (document.getElementById('boot-probe')) {
    return;
  }
  const el = document.createElement('pre');
  el.id = 'boot-probe';
  el.style.cssText =
    'margin:8px;padding:10px;border:1px solid #8e2b30;background:#16181d;color:#d5d1c8;font-size:12px;line-height:1.6;white-space:pre-wrap';
  el.textContent = `《迷梦》状态栏未能渲染：${text}\n请确认酒馆助手已启用，且本楼层已初始化 MVU 变量。`;
  document.body.appendChild(el);
}

$(async () => {
  console.info('[迷梦 状态栏] 入口脚本已执行');

  try {
    await waitGlobalInitialized('Mvu');
  } catch (e) {
    report_error(`Mvu 全局未就绪：${e instanceof Error ? e.message : String(e)}`);
    return;
  }

  try {
    await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'), { timeout: 15000 });
  } catch (e) {
    report_error(`等待 stat_data 超时：${e instanceof Error ? e.message : String(e)}`);
    return;
  }

  const app = createApp(App);
  app.config.errorHandler = (err, _instance, info) => {
    report_error(`组件错误（${info}）：${err instanceof Error ? err.stack || err.message : String(err)}`);
  };

  try {
    app.use(createPinia()).mount('#app');
    console.info('[迷梦 状态栏] Vue 已挂载');
  } catch (e) {
    report_error(`挂载失败：${e instanceof Error ? e.stack || e.message : String(e)}`);
  }
});
