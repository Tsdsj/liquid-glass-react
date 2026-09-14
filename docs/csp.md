# 内容安全策略与资源处理

## 预览服务器的策略

`node scripts/serve-preview.mjs` 默认只监听 localhost，拒绝非 GET/HEAD、隐藏路径和超出预览根目录的路径。返回 nosniff、no-referrer、no-store；HTML 添加 CSP。

```text
default-src 'none';
script-src 'self' 'nonce-<per-response>';
style-src 'self';
style-src-attr 'unsafe-inline';
img-src 'self' data:;
media-src 'self' blob:;
connect-src 'none';
font-src 'none';
object-src 'none';
base-uri 'none';
frame-ancestors 'none';
form-action 'none';
```

script 不需要 unsafe-eval 或 unsafe-inline。样式属性有意单独允许，因为 React 动态 CSS 自定义属性、尺寸/位置与 SSR style 属性属于本实现的接口；这不是“任何完全禁止内联样式的 CSP 都能直接兼容”的承诺。

PNG data URL 仅表示几何位移数据，不包含页面截图。合成视频和导出使用本地 Blob URL，流与 URL 会按生命周期清理。应用若禁用 data 图片，应使用 CSS renderer；若禁用所有 style 属性，需要修改材质参数注入方式，而不是默默降低 CSP。

## 当前验证边界

当前容器禁止浏览器导航任何 URL，未改变这一策略。实际测试使用本地编写的 HTML、nonce 脚本和等效资源限制的内联夹具，在 about:blank 中执行；未出现 CSP violation。HTTP 服务器另用本地 HTTP 客户端验证响应头与拒绝路径。

因此，CSP 内联夹具通过不等于正式 Chrome 已通过真实 HTTP 部署测试。完整 HTTP 浏览器检查位于 `tests/browser/csp.spec.ts`，需在允许访问本地服务的机器运行。

本地开发服务器不是经过部署审计的公网服务器；生产应用应使用自己的 HTTPS、认证、日志和安全策略。当前 demo 没有用户账号、后端、Cookie 或持久化敏感数据。
