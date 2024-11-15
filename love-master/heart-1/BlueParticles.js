import * as THREE from 'three';
import HeartObject from './HeartObject.js';

export default class BlueParticles {
  constructor(numParticles, heartObject, width, height, center) {
    this.numParticles = numParticles;
    this.heartObject = heartObject;
    this.width = width;
    this.height = height;
    this.center = center;

    this.ellipseParticles = [];  // 椭圆上的粒子
    this.fallingParticles = [];  // 从爱心下半部分散落的粒子

    this.createEllipseParticles(); // 创建不规则椭圆形状的粒子
    this.createFallingParticles(); // 创建散落的粒子
  }

  // 创建不规则椭圆形状的粒子，并赋予轻微跳动效果
  createEllipseParticles() {
    const semiMajorAxis = this.width * 3.9; // 椭圆的长轴
    const semiMinorAxis = this.height * 3.9; // 椭圆的短轴
    const minRadius = Math.min(semiMajorAxis * 1.6, semiMinorAxis * 1.6); // 设置一个较大的最小半径，避免粒子生成在椭圆中心
  
    for (let i = 0; i < this.numParticles; i++) {
      const angle = (i / this.numParticles) * Math.PI * 2;  // 均匀分布的角度
  
      // 生成粒子距离的计算，增加外围区域的密度
      // 通过distanceFactor增加靠近外缘的粒子的数量
      const distanceFactor = Math.random() * 0.5 + 0.5; // 生成更大半径的粒子，靠近外缘
      const distance = minRadius + (Math.random() * (Math.min(semiMajorAxis, semiMinorAxis) - minRadius) * distanceFactor);
  
      // 增加粒子的随机偏移量，避免它们都排列得很整齐
      const offsetX = (Math.random() - 0.5) * 1;  // 更大偏移量
      const offsetZ = (Math.random() - 0.5) * 1;  // 更大偏移量
  
      const x = this.center.x + distance * Math.cos(angle) + offsetX;
      const z = this.center.z + distance * Math.sin(angle) + offsetZ;
      const y = this.center.y
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: 0xADD8E6 })
      );
  
      particle.position.set(x, y, z);
      particle.velocity = new THREE.Vector3(0, Math.random() * 0.1 - 0.08, 0); // 随机跳动速度
      this.ellipseParticles.push(particle);
    }
  }
  


  // 创建散落的粒子，从爱心下半部分开始向椭圆下落
  createFallingParticles() {
    const semiMajorAxis = this.width / 2;

    for (let i = 0; i < this.numParticles / 2; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.2),
        new THREE.MeshBasicMaterial({ color: 0xADD8E6 })
      );

      // 随机生成粒子在爱心下半部分的初始位置
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (semiMajorAxis * 0.5);
      const x = this.center.x + radius * Math.cos(angle);
      const y = this.center.y  + Math.random() * 40-10;
      const z = this.center.z + radius * Math.sin(angle);

      particle.position.set(x, y, z);

      particle.velocity = new THREE.Vector3(
        Math.random() * 0.4 - 0.01,  // 随机 X 速度
        -Math.random() * 0.4 - 0.01, // Y 方向速度向下
        Math.random() * 0.4 - 0.01  // 随机 Z 速度
      );

      this.fallingParticles.push(particle);
    }
  }

  // 将所有粒子添加到场景
  addToScene(scene) {
    for (let particle of this.ellipseParticles) {
      scene.add(particle);
    }
    for (let particle of this.fallingParticles) {
      scene.add(particle);
    }
  }

  // 更新粒子的位置，模拟椭圆上粒子的轻微跳动效果以及从爱心下半部分散落到椭圆的效果
  animate(time) {
    // 更新椭圆上粒子的轻微跳动效果
    for (let i = 0; i < this.ellipseParticles.length; i++) {
      const particle = this.ellipseParticles[i];
      const offsetY = Math.sin(time * 4 + i) * 0.2; 
      particle.position.y = this.center.y + offsetY;
    }

    // 更新散落粒子的位置，模拟它们逐渐落到椭圆上
    for (let particle of this.fallingParticles) {
      if (particle.position.y > this.center.y) {
        particle.position.add(particle.velocity); // 粒子下落并伴随随机晃动
      } else {
        // 粒子到达椭圆表面后加入到椭圆粒子中并开始跳动
        this.ellipseParticles.push(particle);
        this.fallingParticles.splice(this.fallingParticles.indexOf(particle), 1);
      }
    }
  }
}
