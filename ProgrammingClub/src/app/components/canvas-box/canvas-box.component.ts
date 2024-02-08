import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';


@Component({
  selector: 'app-canvas-box',
  templateUrl: './canvas-box.component.html',
  styleUrl: './canvas-box.component.scss'
})
export class CanvasBoxComponent implements OnInit {
 
  ngOnInit() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const tgeometry = new THREE.SphereGeometry()
    const sphere = new THREE.Mesh(tgeometry,material)
    const cube = new THREE.Mesh(geometry, material);
    scene.add( sphere);
    const animate = function () {
      requestAnimationFrame(animate);

      //sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;

      renderer.render(scene, camera);
    };
    camera.position.z = 5;
    renderer.render(scene, camera);
    animate();
  }
  
}
