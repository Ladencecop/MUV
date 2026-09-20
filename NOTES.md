# 本仓库说明（Ladencecop/MUV）

从 [tavern_helper_template](https://github.com/StageDog/tavern_helper_template) 派生，用于部署 SillyTavern 角色卡的前端状态栏。上游模板的说明见 `README.md`。

## 已有状态栏

`src/{项目名}/界面/状态栏/` 是 Vue 3 源码，`pnpm build` 产出单文件 HTML 到 `dist/{项目名}/界面/状态栏/index.html`，酒馆正则只加载这个链接：

```
https://testingcf.jsdelivr.net/gh/Ladencecop/MUV/dist/{项目名}/界面/状态栏/index.html
```

| 项目 | 状态栏链接 |
|---|---|
| 阿斯缇娅 | `dist/阿斯缇娅/界面/状态栏/index.html` |
| 心动小屋 | `dist/心动小屋/界面/状态栏/index.html` |
| 迷梦 | `dist/迷梦/界面/状态栏/index.html` |
| 她和他 | `dist/她和他/界面/状态栏/index.html` |

## 改状态栏的流程

```bash
# 改 src/{项目名}/界面/状态栏/ 下的源码
pnpm build
git add -A && git commit -m "..." && git push
```

push 后 CI 会重新构建、提交 `dist`、并打版本 tag（如 `v0.0.2`）。打 tag 是为了让 jsdelivr 按版本号在 12 小时内刷新缓存，而不是走非版本号的 7 天缓存。

## 缓存

推送后 CDN 不会立即更新。三种加速方式：

- 加版本号访问：`.../gh/Ladencecop/MUV@v0.0.1/dist/...`
- 换镜像域名：`fastly.jsdelivr.net` / `gcore.jsdelivr.net`
- 手动 purge（只刷新主服务器）：https://www.jsdelivr.com/tools/purge

## 本机环境备忘

**1. 代理必须用 http 方案**

Git for Windows 的网络栈是 .NET 的 ServicePointManager，它的代理枚举里没有 SOCKS5。写 `socks5://` 会直接报
`ServicePointManager 不支持具有 socks5 方案的代理`。

Clash Verge 的 7897 是混合端口（HTTP 与 SOCKS5 都支持），所以写 http 即可：

```bash
git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897
```

**2. 受限环境下改用 OpenSSL 后端**

如果 git 报 `schannel: AcquireCredentialsHandle failed: SEC_E_NO_CREDENTIALS`，说明 Schannel 取不到 Windows 凭据存储。换 OpenSSL 后端绕开：

```bash
git config --global http.sslBackend openssl
```

本仓库的 `.git/config` 里已经设了这一项（因为某些受限进程写不了全局 `.gitconfig`）。

**3. 本仓库的 `.git/config` 是本地设置**

`core.symlinks`、`http.sslBackend` 等都在仓库级配置里，不会跟仓库一起同步。换机器需要重新设一次。
