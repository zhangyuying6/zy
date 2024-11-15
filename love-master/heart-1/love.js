import { App, THREE } from "./App.js";
import HeartObject from "./HeartObject.js";
import BlueParticles from "./BlueParticles.js";

// 初始化应用和相机位置
const app = new App(new THREE.Vector3(0, 0, 100));

// 创建一个画布
function createTextCanvas(text, fontSize, color, xPos, yPos) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // 设置画布大小
    canvas.width = 1500; // 宽度可以根据需要调整
    canvas.height = 600; // 高度可以根据需要调整

    // 设置字体样式
    context.font = `${fontSize}px Arial`; // 字体大小
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // 绘制文字（xPos 和 yPos 控制文字位置）
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText(text, xPos, yPos);  // 调整文本的 x 和 y 坐标

    return canvas;
}

// 创建文字纹理
const canvas = createTextCanvas('略略略', 90, '#ff6699', 256, 100); 
const texture = new THREE.CanvasTexture(canvas);

// 使用纹理创建材质
const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });

// 创建平面并添加到场景
const aspectRatio = canvas.width / canvas.height;
const geometry = new THREE.PlaneGeometry(25* aspectRatio, 25); // 根据画布比例调整平面大小
const mesh = new THREE.Mesh(geometry, material);

// 修改文字平面的位置 (例如将其放置在屏幕中央)
mesh.position.set(20, 20, 0);  // 你可以通过修改 x, y, z 坐标来调整位置

// 将网格添加到 Three.js 场景
app.scene.add(mesh);


// 创建爱心对象并设置其初始状态
const innerHeart = new HeartObject(true);
innerHeart.rotateZ(Math.PI);
innerHeart.scale.set(2.2, 2.2, 3.2);
innerHeart.position.set(0, 28, 0);  // 将初始位置调整到屏幕上方
app.addView(innerHeart);

const outsideHeart = new HeartObject(false);
outsideHeart.rotateZ(Math.PI);
outsideHeart.scale.set(2.7, 2.8, 2.8);
outsideHeart.position.set(0, 25, 0);  // 将初始位置调整到屏幕上方
app.addView(outsideHeart);

// 创建蓝色粒子并添加到场景
const blueParticles = new BlueParticles(10000, innerHeart, 200, 10, new THREE.Vector3(0, -35, 0));
blueParticles.addToScene(app.scene); // 将粒子添加到场景中

// 在动画中更新爱心的位置来实现飘动效果
app.startAnimation((time) => {
  // 更新内部爱心的位置（漂浮效果）
  const moveSpeed = 0.02; // 设置漂浮的速度
  innerHeart.position.y -= moveSpeed;  // 垂直向下移动
  // 如果爱心超出画布底部，则从顶部重新开始
  if (innerHeart.position.y < -50) {  // 当它到达屏幕底部时从顶部重置
    innerHeart.position.y = 50;  // 重置到屏幕顶部
  }

  // 更新外部爱心的位置（漂浮效果）
  outsideHeart.position.y -= moveSpeed;  // 垂直向下移动
  // 如果外部爱心超出画布底部，则从顶部重新开始
  if (outsideHeart.position.y < -50) {  // 当它到达屏幕底部时从顶部重置
    outsideHeart.position.y = 50;  // 重置到屏幕顶部
  }

  // 更新爱心的动画状态
  innerHeart.animate(time);
  innerHeart.geometry.attributes.position.needsUpdate = true;
  outsideHeart.animate(time);
  outsideHeart.geometry.attributes.position.needsUpdate = true;

  // 更新粒子的动画状态
  blueParticles.animate(time);

  // 触发渲染
  app.renderer.render(app.scene, app.camera);
});
