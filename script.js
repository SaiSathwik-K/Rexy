import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x808080);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000);
camera.position.set(0,5,11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0; //to control camera tilt
controls.maxPolarAngle = 2;
//controls.autoRotate = true;
controls.target = new THREE.Vector3(0, 2, 0); //target that the camera is looking at
controls.update();

//const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32); //width, length, width segment, height segment
//groundGeometry.rotateX(-Math.PI / 2); //this makes sure that the ^ plane is sitting on the ground
//const groundMaterial = new THREE.MeshStandardMaterial({
    //color: 0x555555,
    //side: THREE.DoubleSide //side property to make sure that three js renders both sides of the plane, by default it renders only one. 
//});
//const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
//scene.add(groundMesh);

const ambientLight = new THREE.AmbientLight(0xffffff, 10);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1000, 100, 0.2, 0.5); //color, intensity, distance, how it attenuates near its edges
spotLight.position.set(0, 25, 0);
//scene.add(spotLight); 

const spotLight2 = new THREE.SpotLight(0xffffff, 1000, 100, 0.2, 0.5);
spotLight2.position.set(10,8,0);
spotLight2.rotateX(-Math.PI/2);
//scene.add(spotLight2);

const loader = new GLTFLoader().setPath('/models/');
loader.load('scene.gltf', (gltf) => {
    const mesh = gltf.scene;
    mesh.position.set(0, 0, 0);
    scene.add(mesh);
});

const inactivityThreshold = 4000; //seconds before it starts auto rotating
let inactivityTimer;

function resetInactivityTimer() { //reset timer on inactivity
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(handleInactivity, inactivityThreshold);
  controls.autoRotate = false;
}

function handleInactivity(){
    controls.autoRotate = true;
}

function setupActivityListeners() {
  // List of events that indicate user activity
  const activityEvents = [
    'mousemove', 'mousedown', 'mouseup', 'click', 
    'keydown', 'keyup', 'keypress', 
    'scroll', 'touchstart', 'touchmove', 'touchend'
  ];
 
  // Attach listeners to the document
  activityEvents.forEach(event => {
    // Use { passive: true } for scroll/touch events to improve performance
    const options = event === 'scroll' || event.startsWith('touch') 
      ? { passive: true } 
      : false;
 
    document.addEventListener(event, resetInactivityTimer, options);
  });
}

// Start the timer when the page finishes loading
window.addEventListener('load', () => {
  resetInactivityTimer(); // Start the initial countdown
  setupActivityListeners(); // Attach event listeners
});

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}


animate();
