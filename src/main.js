import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import * as THREE from "three"

// document.querySelector('#app').innerHTML = 
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// setupCounter(document.querySelector('#counter'))

//cancvas
const canvas = document.querySelector("#webGL");

//シーン
const scene = new THREE.Scene();

//背景テクスチャ
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load('img/bg.jpg');
scene.background = bgTexture;

//size
const sizes = {
  width: innerWidth,
  height: innerHeight,
}

//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

//オブジェクトを作成
const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMaterial = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0.5, -15);
box.rotation.set(1, 1, 0);

const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 1, 10);

scene.add(box, torus);

//線形補完で滑らかに移動させる
function lerp(x, y, a){
  return (1 - a) * x + a * y;
}

function scalePercent(start, end) {
  return (scrollParcent - start) / (end - start);
}

//スクロールアニメーション
const animationScripts = [];

animationScripts.push({
  start: 0,
  end: 40,
  function(){
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    //box.position.z += 0.01;
    box.position.z = lerp(
      -15, 
      2, 
      scalePercent(0, 40),
      
    );
    torus.position.z = lerp(
      10, 
      -20, 
      scalePercent(0, 40),
      
    );
  },
});

animationScripts.push({
  start: 40,
  end: 60,
  function(){
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    //box.position.z += 0.01;
    box.rotation.z = lerp(1, Math.PI, scalePercent(40, 60));
  },
});

animationScripts.push({
  start: 60,
  end: 80,
  function(){
    camera.lookAt(box.position);
    camera.position.x = lerp(0, -15, scalePercent(60, 80));
    camera.position.y = lerp(1, 15, scalePercent(60, 80));
    camera.position.z = lerp(10, 25, scalePercent(60, 80));
    //box.position.z += 0.01;
    
  },
});

animationScripts.push({
  start: 80,
  end: 100,
  function(){
    camera.lookAt(box.position);
    box.rotation.x += 0.02;
    box.rotation.y += 0.02;
    
  },
});

//アニメーションを実行、開始
function playScrollAnimetion(){
  animationScripts.forEach((animation) => {
    if(scrollParcent >= animation.start && scrollParcent <= animation.end)
    animation.function();
  });
};


//ブラウザのスクロール率を取得
let scrollParcent = 0;

document.body.onscroll = () => {
  scrollParcent = 
    (document.documentElement.scrollTop /
       (document.documentElement.scrollHeight - 
          document.documentElement.clientHeight)) * 100;

          console.log(scrollParcent);

};







//アニメーション
const tick = () => {
  window.requestAnimationFrame(tick);
  playScrollAnimetion();

  renderer.render(scene, camera);
};

tick();

//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
 
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});