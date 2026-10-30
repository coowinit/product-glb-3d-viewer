(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const model = $('modelViewer');
  const rotate = $('autoRotate');
  const status = $('statusText');
  const hint = $('stageHint');
  const initialOrbit = '35deg 70deg auto';
  const initialFov = 30;
  let fov = initialFov;
  let ready = false;

  function setRotation(active) {
    model.autoRotate = active;
    rotate.innerHTML = active ? 'Ⅱ <span>暂停旋转</span>' : '▶ <span>自动旋转</span>';
    rotate.setAttribute('aria-pressed', String(active));
  }
  function updateZoom(delta) {
    if (!ready) return;
    fov = Math.max(15, Math.min(60, fov + delta));
    model.fieldOfView = `${fov}deg`;
  }
  $('zoomIn').addEventListener('click', () => updateZoom(-5));
  $('zoomOut').addEventListener('click', () => updateZoom(5));
  rotate.addEventListener('click', () => { if (ready) setRotation(!model.autoRotate); });
  $('resetView').addEventListener('click', () => {
    if (!ready) return;
    setRotation(false);
    fov = initialFov;
    model.cameraOrbit = initialOrbit;
    model.fieldOfView = `${initialFov}deg`;
    if (typeof model.resetTurntableRotation === 'function') model.resetTurntableRotation();
  });
  $('fullscreen').addEventListener('click', async () => {
    const target = document.querySelector('.viewer');
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (target.requestFullscreen) await target.requestFullscreen();
    } catch (error) { status.textContent = '当前浏览器不支持全屏切换'; }
  });
  model.addEventListener('progress', event => {
    const p = Math.round((event.detail.totalProgress || 0) * 100);
    $('loadProgress').style.width = `${p}%`;
    if (!ready) status.textContent = `模型加载中 ${p}%`;
  });
  model.addEventListener('load', () => {
    ready = true;
    status.textContent = '模型已加载 · 可自由旋转';
    $('errorMessage').hidden = true;
    hint.style.opacity = '1';
  });
  model.addEventListener('error', () => {
    ready = false;
    setRotation(false);
    status.textContent = '模型加载失败';
    $('errorMessage').hidden = false;
  });
  model.addEventListener('camera-change', () => { if (ready) hint.style.opacity = '0'; });
  // model-viewer 允许用户通过手势改变 FOV；缩放按钮从当前实际值继续调整。
  model.addEventListener('camera-change', () => {
    const current = Number.parseFloat(model.getFieldOfView?.());
    if (Number.isFinite(current)) fov = current;
  });
})();
