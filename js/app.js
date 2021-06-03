import { OrbitControls } from "../vendor/OrbitControls.js";
import * as THREE from "../vendor/three.module.js";
import { Input } from "./input.js";
import { Slides } from "./slides.js";
import { moveRight, moveLeft } from "./transition.js";

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

class App {
  constructor() {
    function left() {
      let left = new moveLeft(self);
    }
    function right() {
      let right = new moveRight(self);
    }

    function cubeClicked() {
      console.log("gr5yr5", self.slideIndex);
      if (!self.first) {
        if (self.slideIndex > 0) {
          window.location.href = links[self.slideIndex - 1];
        } else {
          window.location.href = links[1];
        }
      }
    }

    let links = [
      "https://matt08-prog.github.io/wiki_world_react/",
      "https://matt08-prog.github.io/radio_garden.github.io/",
    ];
    var scene, renderer;
    var camera, cameraControls;
    let self = this;
    self.first = true;
    self.transition = false;
    document.onmousedown = () => {
      const video = document.querySelectorAll("video");
      video.forEach((it) => {
        it.play();
      });
    };
    document.onmousemove = function (e) {
      self.mouseX = e.pageX;
      self.mouseY = e.pageY;

      self.distToCenter = Math.sqrt(
        Math.pow(self.mouseX - window.innerWidth / 2, 2) +
          Math.pow(self.mouseY - window.innerHeight / 2, 2)
      );

      //console.log(self.distToCenter)

      if (self.mouseX < 700) {
        self.mouseX = 700;
      }
      if (self.mouseY > 700) {
        self.mouseY = 700;
      }
    };

    if (!init()) animate();

    // init the scene
    function init() {
      console.log("Press F to go fullscreen and S to show/hide stats");
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.outputEncoding = THREE.sRGBEncoding;

      // renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById("container").appendChild(renderer.domElement);

      // create a scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      // put a camera in the scene
      camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.set(0, 0, 5);
      scene.add(camera);

      // create a camera contol
      cameraControls = new OrbitControls(camera, renderer.domElement);
      cameraControls.enableDamping = true;
      cameraControls.dampingFactor = 0.25;
      cameraControls.enableZoom = true;
      cameraControls.autoRotate = false;
      cameraControls.autoRotateSpeed = 5.0;
      cameraControls.minDistance = 4.0;
      cameraControls.keyPanSpeed = 0;

      // transparently support window resize
      THREEx.WindowResize.bind(renderer, camera);

      // allow 'f' to go fullscreen where this feature is supported
      if (THREEx.FullScreen.available()) {
        THREEx.FullScreen.bindKey();
      }

      self.scene = scene;
      self.loadCubes = true;
      const slides = new Slides(self);

      self.spriteLoader = new THREE.TextureLoader();

      self.spriteLoader.load(
        "./images/wikiWorld.png",
        function (map) {
          const material = new THREE.SpriteMaterial({ map: map });
          const sprite = new THREE.Sprite(material);
          sprite.scale.set(3, 3);
          let geom = new THREE.PlaneGeometry(3, 1.5);

          let mat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
          });

          let box = new THREE.Mesh(geom, mat);
          box.renderOrder = 999;
          box.material.depthTest = false;
          box.material.depthWrite = false;
          box.onBeforeRender = function (renderer) {
            renderer.clearDepth();
          };

          self.texts = [];
          let g = new THREE.Group();
          g.add(sprite);
          g.add(box);
          self.texts.push(g);
          self.spriteLoader.load(
            "./images/radio.png",
            function (map) {
              const material = new THREE.SpriteMaterial({ map: map });
              const sprite = new THREE.Sprite(material);
              sprite.scale.set(3, 3);
              let geom = new THREE.PlaneGeometry(3, 1.5);

              let mat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
              });

              let box = new THREE.Mesh(geom, mat);
              box.renderOrder = 999;
              box.material.depthTest = false;
              box.material.depthWrite = false;
              box.onBeforeRender = function (renderer) {
                renderer.clearDepth();
              };

              let g = new THREE.Group();
              g.add(sprite);
              g.add(box);
              self.texts.push(g);
              self.texts.push(g.clone());

              self.texts.forEach((it) => {
                self.scene.add(it);
                it.position.set(self.origin.x, self.origin.y, self.origin.z);
              });
            },

            // onProgress callback currently not supported
            undefined,

            // onError callback
            function (err) {
              console.error("An error happened.");
            }
          );
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function (err) {
          console.error("An error happened.");
        }
      );

      self.textureLoader = new THREE.TextureLoader();

      // load a resource
      self.textureLoader.load(
        // resource URL
        "./images/g.jpg",

        // onLoad callback
        function (texture) {
          const input = new Input();

          // Create an empty array to stores the points
          var points = [];

          // Define points along Z axis
          for (var i = 0; i < 5; i += 1) {
            points.push(new THREE.Vector3(0, 0, -(500 * (i / 4)) + 10));
          }

          // Create a curve based on the points
          self.curve = new THREE.CatmullRomCurve3(points);

          // Create the geometry of the tube based on the curve
          // The other values are respectively :
          // 70 : the number of segments along the tube
          // 0.02 : its radius (yeah it's a tiny tube)
          // 50 : the number of segments that make up the cross-section
          // false : a value to set if the tube is closed or not
          self.tubeGeometry = new THREE.TubeGeometry(
            self.curve,
            70,
            1,
            50,
            true
          );

          // Define a material for the tube with a jpg as texture instead of plain color
          self.tubeMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide, // Since the camera will be inside the tube we need to reverse the faces
            map: texture, // rockPattern is a texture previously loaded
          });
          // Repeat the pattern to prevent the texture being stretched

          self.tubeMaterial.map.wrapS = THREE.RepeatWrapping;
          self.tubeMaterial.map.wrapT = THREE.RepeatWrapping;
          self.tubeMaterial.map.repeat.set(1, 1);

          // Create a mesh based on tubeGeometry and tubeMaterial
          self.tubeMesh = new THREE.Mesh(self.tubeGeometry, self.tubeMaterial);

          // Add the tube into the scene
          scene.add(self.tubeMesh);
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function (err) {
          console.error("An error happened.");
        }
      );

      self.maxDistToCenter = Math.sqrt(
        Math.pow(0 - window.innerWidth / 2, 2) +
          Math.pow(0 - window.innerHeight / 2, 2)
      );

      //console.log(self.maxDistToCenter);
      document.querySelector(".leftButton").onclick = left;
      document.querySelector(".rightButton").onclick = right;

      document.querySelector(".cube").onclick = cubeClicked;
    }

    // animation loop
    function animate(time) {
      // loop on request animation loop
      // - it has to be at the begining of the function
      // - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
      requestAnimationFrame(animate);
      TWEEN.update(time);

      // do the render
      render();
    }

    // render the scene
    function render() {
      // console.log(self.tween)
      self.slides.forEach((it) => {
        it.rotation.y += 0.008;
      });

      //self.cube.rotation.z += 0.001;
      scene.remove(self.tubeMesh);
      let minSpeed = 0.0006;
      let maxSpeed = 0.001;
      if (self.tubeMaterial && self.distToCenter) {
        self.tubeMaterial.map.offset.x += self.distToCenter.map(
          0,
          self.maxDistToCenter,
          maxSpeed,
          minSpeed
        );
        self.tubeMaterial.map.offset.y += 0.001;
      }
      if (self.curve) {
        self.curve.points[2].x = -self.mouseX * 0.1;

        self.curve.points[2].y = self.mouseY * 0.1;

        // Update the X position of the last point
        self.curve.points[4].x = -self.mouseX * 0.1;
      }
      // Update the third point of the curve in X and Y axis

      self.tubeGeometry = new THREE.TubeGeometry(self.curve, 70, 1, 50, false);
      self.tubeMesh = new THREE.Mesh(self.tubeGeometry, self.tubeMaterial);

      scene.add(self.tubeMesh);
      // update camera controls
      cameraControls.update();

      // actually render the scene
      renderer.render(scene, camera);
    }
  }
}

export { App };
