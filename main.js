import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/17/Stats.js';


let width, height;
const canvas = document.getElementById('canvas');

const setSizes = () => {
    width = window.innerWidth;
    height = window.innerHeight;
}

setSizes();

window.addEventListener('resize', () => {
    setSizes();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

});

//ROOT BASIC VARIABLES
const colorBlue = 0x4763ad;
const colorLight = 0xf0f0f7;

//LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff, 3); // soft white light
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.position.set(0, 2, 5);
dirLight.lookAt(0, 0, 0);
const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight2.castShadow = true;
dirLight2.shadow.mapSize.width = 512;
dirLight2.shadow.mapSize.height = 512;
dirLight2.position.set(0, -2, -5);
dirLight2.lookAt(0, 0, 0);

// CAMERA
const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 500);
camera.name = "Camera_A";
camera.position.set(0, 3, 7);

// SCENE
const scene = new THREE.Scene({});
scene.background = new THREE.Color(colorLight);

// GEOMETRIES 
const geometry = new THREE.BoxGeometry(1, 1, 1);

// MATERIAL
const materialA = new THREE.MeshPhysicalMaterial({
    flatShading: true,
    color: colorBlue,
    fog: true,
    roughness: 0.5,
    metalness: 0.5,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: colorLight,
});

const materialB = new THREE.MeshPhysicalMaterial({
    flatShading: true,
    color: colorBlue,
    fog: true,
    roughness: 0.5,
    metalness: 0.5,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: colorLight,
});

// MESH
let cubeA = new THREE.Mesh(geometry, materialA);
let cubeB = new THREE.Mesh(geometry, materialB);
cubeA.name = "A";
cubeB.name = "B";
cubeA.position.set(-1.5, 0, 0);
cubeB.position.set(1.5, 0, 0)

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = false;
controls.target.set(0, 0, 0);
controls.update();


// STATS
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);


// ADD TO SCENE
scene.add(camera);
scene.add(ambientLight, dirLight, dirLight2);
scene.add(cubeA);
scene.add(cubeB);


// ANIMATION LOOP
const clock = new THREE.Clock();

const animation = () => {

    stats.begin();

    controls.update();
    renderer.render(scene, camera);
    TWEEN.update();
    stats.end();

    renderer.setAnimationLoop(animation);
}

animation();


// CLICKING EVENTS
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function getRnd(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

function getRndColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function updateObject(object) {

    let newColor = getRndColor();
    object.material.color.set(newColor);

    let newScale = getRnd(0.5, 2)
    // object.scale.set(newScale, newScale, newScale);

    let newX = getRnd(0, 2) * Math.PI;
    let newY = getRnd(0, 2) * Math.PI;
    let newZ = getRnd(0, 2) * Math.PI;
    // object.position.set(newX, newY, newZ);

    new TWEEN.Tween(object.scale).to({
        x: newScale,
        y: newScale,
        z: newScale,
    }, 300)
        .easing(TWEEN.Easing.Quartic.Out)
        .start();

    new TWEEN.Tween(object.rotation).to({
        x: newX,
        y: newY,
        z: newZ,
    }, 600)
        .easing(TWEEN.Easing.Quartic.Out)
        .start();
}

function clicking(e) {

    pointer.x = (e.clientX / width) * 2 - 1;
    pointer.y = -(e.clientY / height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    let intersection = raycaster.intersectObjects(scene.children);

    if (intersection[0] && intersection[0].object.name) {
        updateObject(intersection[0].object);
    }
}

window.addEventListener('click', clicking);