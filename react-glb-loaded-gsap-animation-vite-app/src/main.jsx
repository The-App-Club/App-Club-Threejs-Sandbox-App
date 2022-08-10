import {createRoot} from 'react-dom/client';
import {useEffect, useMemo, useState} from 'react';
import {css, cx} from '@emotion/css';
import * as THREE from 'three';
import {useRef} from 'react';
import {ModelContainer} from './components/ModelContainer';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import gsap, {Power3, Power4} from 'gsap';

import '@fontsource/inter';
import './styles/index.scss';

const App = () => {
  const sceneContainerDomRef = useRef(null);
  useEffect(() => {
    (async () => {
      // 描画先の要素
      const {current: sceneContainer} = sceneContainerDomRef;

      // モデルを読み込み
      const loader = new GLTFLoader();
      const model = await loader.loadAsync(
        new URL(`./data/${'santa'}.glb`, import.meta.url).href,
        function (e) {
          // console.log(e);
        }
      );
      model.scene.position.set(0, 0, 0); // 原点配置

      const axis = new THREE.AxesHelper(10); // 座表軸

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // 環境光源

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6); // 平行光源
      directionalLight.position.set(5, 5, 0);

      // シーンを初期化
      const scene = new THREE.Scene();
      scene.add(model.scene);
      scene.add(axis);
      scene.add(ambientLight);
      scene.add(directionalLight);

      // カメラを初期化
      const camera = new THREE.PerspectiveCamera(
        75,
        sceneContainer.offsetWidth / sceneContainer.offsetHeight,
        0.1,
        1000
      );
      camera.position.set(1, 1, 1);
      camera.lookAt(scene.position);

      // レンダラーの初期化
      const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.setClearColor(0xffffff, 1.0); // 背景色
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(sceneContainer.offsetWidth, sceneContainer.offsetHeight);

      // レンダラーをDOMに追加
      sceneContainer.appendChild(renderer.domElement);

      // カメラコントローラー設定
      // const orbitControls = new OrbitControls(camera, renderer.domElement);
      // orbitControls.maxPolarAngle = Math.PI * 0.5;
      // orbitControls.zoomO = 0.13;
      // orbitControls.minDistance = 0.1;
      // orbitControls.maxDistance = 1000;
      // orbitControls.autoRotate = true; // カメラの自動回転設定
      // orbitControls.autoRotateSpeed = 4.0; // カメラの自動回転速度

      window.addEventListener(`resize`, () => {
        // レンダラーのサイズを調整
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(
          sceneContainer.offsetWidth,
          sceneContainer.offsetHeight
        );

        // カメラのアスペクト比を調整
        camera.aspect =
          sceneContainer.offsetWidth / sceneContainer.offsetHeight;
        
        // modelのシーン座標をリサイズでハンドリングしたい
        // camera.updateProjectionMatrix();
      });
      gsap.config({
        force3D: true,
      });
      const tl = gsap.timeline({
        paused: true,
      });
      let time = {t: 0};
      tl.to(time, {
        duration: 1,
        t: -0.02,
        ease: Power4.easeOut,
        onStart: function (e) {
          model.scene.rotateZ(0.1); // 正面向くように調整
          model.scene.rotateY(3.8); // 正面向くように調整
          model.scene.scale.set(0.15, 0.15, 0.15); // モデルのサイズを縮小
          renderer.render(scene, camera);
        },
        onUpdate: function (e) {
          model.scene.translateX(time.t);
          renderer.render(scene, camera);
        },
        onComplete: function (e) {},
      })
        .to(time, {
          duration: 1,
          t: -0.01,
          ease: Power4.easeOut,
          onStart: function (e) {
            renderer.render(scene, camera);
          },
          onUpdate: function (e) {
            model.scene.rotateY(time.t);
            model.scene.translateZ(-time.t);
            renderer.render(scene, camera);
          },
        })
        .to(time, {
          duration: 0.01,
          t: -0.02,
          ease: Power4.easeOut,
          onStart: function (e) {
            renderer.render(scene, camera);
          },
          onUpdate: function (e) {
            model.scene.translateZ(time.t);
            model.scene.scale.set(0, 0, 0);
            renderer.render(scene, camera);
          },
        })
        .to(time, {
          duration: 1.23,
          t: 0.512,
          ease: Power4.easeOut,
          onStart: function (e) {
            renderer.render(scene, camera);
          },
          onUpdate: function (e) {
            model.scene.rotateY(time.t);
            model.scene.scale.set(time.t, time.t, time.t);
            renderer.render(scene, camera);
          },
          onComplete: function (e) {
            // このタイミングでメインループをキックしたい
            console.log(`done`);
          },
        });

      tl.play();

      // main loop
      renderer.setAnimationLoop((e) => {
        // orbitControls.update();
        renderer.render(scene, camera);
      });
    })();
  }, []);

  return (
    <ModelContainer
      ref={sceneContainerDomRef}
      className={css`
        width: ${window.innerWidth}px;
        height: ${window.innerHeight}px;
      `}
    ></ModelContainer>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
