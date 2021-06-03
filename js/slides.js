import * as THREE from "../vendor/three.module.js";

export function Slides(self) {
  if (self.loadCubes) {
    console.log("load Cubes");

    let video = document.querySelector("video.wiki");
    //video.play();
    video.loop = true
    console.log(video);
    let videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;
    let geometry = new THREE.BoxGeometry(2, 1, 2);

    let material = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.FrontSide,
    });

    self.cube = new THREE.Mesh(geometry, material);
    self.cube.renderOrder = 999;
    self.cube.material.depthTest = false;
    self.cube.material.depthWrite = false;
    self.cube.onBeforeRender = function (renderer) {
      renderer.clearDepth();
    };
    self.origin = new THREE.Vector3(-5, 0, 0);

    self.slideIndex = 0;
    self.slides = [];
    self.slides.push(self.cube);
    self.slides.forEach((it) => {
      it.position.set(self.origin.x, self.origin.y, self.origin.z);
      self.scene.add(it);
    });

    let video1 = document.querySelector("video.radioGarden");
    video1.loop = true;
    console.log(video1);
    videoTexture = new THREE.VideoTexture(video1);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;
    geometry = new THREE.BoxGeometry(2, 1, 2);

    material = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.FrontSide,
    });

    self.cube = new THREE.Mesh(geometry, material);
    self.cube.renderOrder = 999;
    self.cube.material.depthTest = false;
    self.cube.material.depthWrite = false;
    self.cube.onBeforeRender = function (renderer) {
      renderer.clearDepth();
    };

    self.slides.push(self.cube);
    self.slides.forEach((it) => {
      it.position.set(self.origin.x, self.origin.y, self.origin.z);
      self.scene.add(it);
    });
  }
}
