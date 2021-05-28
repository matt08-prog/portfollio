import { OrbitControls } from "../vendor/OrbitControls.js";
import * as THREE from "../vendor/three.module.js";
import { GUI } from "../vendor/dat.gui.module.js";
import { Stats } from "../vendor/stats.module.js";
import { Input } from "./input.js";

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

class App {
  constructor() {
    var stats, scene, renderer;
    var camera, cameraControls;
    let self = this;

    document.onmousemove = function (e) {
      self.mouseX = e.pageX;
      self.mouseY = e.pageY;

      self.distToCenter = Math.sqrt(
        Math.pow(self.mouseX - (window.innerWidth / 2), 2) +
        Math.pow(self.mouseY - (window.innerHeight / 2), 2)
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

      // add Stats.js - https://github.com/mrdoob/stats.js
      stats = new Stats();
      stats.domElement.style.position = "absolute";
      stats.domElement.style.bottom = "0px";
      document.body.appendChild(stats.domElement);

      // create a scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
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
      self.loader = new THREE.TextureLoader();

      // load a resource
      self.loader.load(
        // resource URL
        "./images/g3.jpg",

        // onLoad callback
        function (texture) {
          // in this example we create the material when the texture is loaded
          // here you add your objects
          // - you will most likely replace this part by your own
          //   var geometry = new THREE.TorusGeometry(1, 0.42);
          //   var material = new THREE.MeshNormalMaterial();
          //   var mesh = new THREE.Mesh(geometry, material);
          //   scene.add(mesh);

          const gui = new GUI();
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
            false
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
    }

    
    // animation loop
    function animate() {
      // loop on request animation loop
      // - it has to be at the begining of the function
      // - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
      requestAnimationFrame(animate);

      // do the render
      render();

      // update stats
      stats.update();
    }

    // render the scene
    function render() {
      scene.remove(self.tubeMesh);
      self.tubeMaterial.map.offset.x += self.distToCenter.map(0,self.maxDistToCenter,0.009,-0.003);
      self.tubeMaterial.map.offset.y += 0.001;
      // Update the third point of the curve in X and Y axis
      //-64.5
      self.curve.points[2].x = -self.mouseX * 0.1;
      //console.log(self.curve.points[2].x);
      //   if (self.curve.points[2].x < -64) {
      //     self.curve.points[2].x = -64
      //   }

      self.curve.points[2].y = self.mouseY * 0.1;

      // Update the X position of the last point
      self.curve.points[4].x = -self.mouseX * 0.1;

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
