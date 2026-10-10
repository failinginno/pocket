try {
  await import('./scene3d.js');
  await import('./app.js');
} catch (error) {
  console.error('3D shop initialization failed', error);
  const message=document.createElement('div');message.className='scene-error';message.textContent='3D 场景未能启动。请使用支持 WebGL2 的浏览器并开启硬件加速，然后刷新页面。错误：'+error.message;document.getElementById('world').replaceChildren(message);
}
