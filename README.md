# GLB 3D 产品预览组件（Product GLB 3D Viewer）

基于 [Google `<model-viewer>`](https://modelviewer.dev/) 构建的轻量级、响应式 3D 产品预览页面。延续 [product-360-image-viewer](https://github.com/coowinit/product-360-image-viewer) 的简洁设计，但本项目使用真正的 **GLB 三维模型**，而不是 36 张图片序列。

无需正面、背面切换按钮：可以直接拖动、旋转并缩放模型，自由查看不同角度。

## 功能

- **自由旋转**：鼠标拖动、触屏手势控制 3D 模型。
- **缩放**：滚轮、双指缩放，以及工具栏的放大 / 缩小按钮。
- **自动旋转**：开始或暂停模型旋转。
- **视角重置**：恢复初始相机角度及缩放值。
- **全屏模式**：支持浏览器全屏查看（受浏览器支持限制）。
- **加载反馈**：显示模型加载进度及错误提示。
- **响应式布局**：最大内容宽度 800px，移动端自动适配。
- **本地 GLB**：示例模型已包含在 `models/` 目录中；无需向 GitHub 远程请求模型。

## 快速开始

建议使用 **VS Code Live Server** 或本地 HTTP 服务器运行项目：

1. 下载或克隆仓库，在 VS Code 中打开项目文件夹。
2. 使用 Live Server 打开 `index.html`。
3. 等待模型加载完成，再测试拖动、缩放、自动旋转、视角重置和全屏功能。

也可在项目根目录使用 Python（若已安装）启动本地服务：

```bash
python -m http.server 8000
```

随后访问 `http://localhost:8000/`。

**网络要求：** `models/MaterialsVariantsShoe.glb` 已随项目本地提供；但 `index.html` 目前仍从 Google CDN 加载 **`model-viewer` 4.4.0**，因此首次运行及未缓存时需要联网。它**不是完全离线版本**。使用本地 HTTP 服务可规避直接以 `file://` 打开时的浏览器加载限制。

## 项目结构

```text
product-glb-3d-viewer/
├── index.html                        # 组件结构和 model-viewer 配置
├── css/
│   └── style.css                     # 界面样式与响应式布局
├── js/
│   └── viewer.js                     # 缩放、旋转、重置、全屏等交互
├── models/
│   └── MaterialsVariantsShoe.glb     # 本地 GLB 演示模型
└── README.md
```

无需 npm、Webpack 或构建步骤，页面为原生 HTML、CSS、JavaScript；3D 渲染功能依赖外部引入的 `model-viewer` 组件。

## 核心实现

在 `index.html` 中加载固定版本的组件：

```html
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.4.0/model-viewer.min.js"></script>
```

并引用本地模型：

```html
<model-viewer
  src="models/MaterialsVariantsShoe.glb"
  camera-controls
  touch-action="pan-y"
  camera-orbit="35deg 70deg auto"
  field-of-view="30deg">
</model-viewer>
```

上面是关键参数示例，完整标记和加载状态控件请参考 `index.html`。

## 如何替换成自己的产品

1. 将完整的 `.glb` 文件复制到 `models/` 目录。
2. 修改 `index.html` 中 `<model-viewer>` 的 `src` 路径。
3. 根据模型的实际方向和尺寸，调整 `camera-orbit`、`field-of-view`、`exposure` 和 `shadow-intensity`。
4. 如需改变默认视角或缩放，应同步调整 `js/viewer.js` 中的 `initialOrbit` / `initialFov` 常量，以确保“重置视角”行为一致。

GLB 文件需要正确包含网格、材质和纹理信息，查看器无法凭空补全原本缺失的材质。不同模型的真实正面朝向可能不同。

## 响应式与浏览器支持

外层容器最大宽度为 800px，展示区域会随屏幕尺寸自适应；在窄屏下，操作工具栏会自动换行。建议在桌面 Chrome、Edge 和手机浏览器中分别测试模型大小、触控手势以及全屏行为。

如果页面长期停留在“正在加载模型”，先检查浏览器开发者工具的 **Network / Console**，确认 CDN 脚本和本地 GLB 均成功加载，并确认浏览器设备支持 WebGL。

## 技术限制和后续维护

- `<model-viewer>` 的固定版本是 **4.4.0**，建议仅在有必要时经过测试后升级，而不是自动跟随最新版。
- 当前仅展示单个 GLB 模型；暂不加入材质编辑、模型上传系统或复杂后台配置。
- 后续可根据实际需要研究本地打包依赖、加载性能、模型压缩和 WordPress 短代码 / Gutenberg 区块。
- 若准备发布无需联网的完整版本，必须把 `model-viewer` 及其相关依赖妥善部署到本地，不能仅保留 GLB 文件。

## 开源项目与演示模型版权

- 3D 查看组件：[Google model-viewer](https://github.com/google/model-viewer)，Apache-2.0 许可。
- 演示 GLB：[Khronos glTF-Sample-Assets — MaterialsVariantsShoe](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/MaterialsVariantsShoe)，模型署名 **© 2021 Shopify**，采用 **CC BY 4.0**，使用和再分发时需遵循许可条款并保留署名信息。

---

**技术栈：** HTML5 · CSS3 · Vanilla JavaScript · model-viewer 4.4.0  
**运行方式：** 本地 HTTP 服务 + 本地 GLB + 在线 JS 组件
