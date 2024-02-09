import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module';

import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import * as CANNON from 'cannon-es'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { threeToCannon, ShapeType } from 'three-to-cannon';


@Component({
  selector: 'app-canvas-box',
  templateUrl: './canvas-box.component.html',
  styleUrl: './canvas-box.component.scss'
})
export class CanvasBoxComponent {
  constructor () {
		
		//const world = new CANNON.World({gravity: new CANNON.Vec3(0,-9.82, 0)});

		// // box body
		// const boxBody = new CANNON.Body({
		// mass: 5, // kg
		// shape: new CANNON.Box(new CANNON.Vec3(1,1,1))
		// })
		
		// boxBody.position.set(1,12,0);
		// boxBody.quaternion.set(Math.PI/4, Math.PI/2, 0, 1);
		// world.addBody(boxBody);

		// // ground body
		

		// // scene
		// const scene = new THREE.Scene();

		// // camera
		// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		// camera.position.z = 12;
		// camera.position.y = 4;
	
		// // renderer
		// const canvas = document.getElementById('c');
		// const renderer = new THREE.WebGLRenderer();
		// renderer.setSize(window.innerWidth, window.innerHeight);
		// document.body.appendChild(renderer.domElement);

	
		// // light
		// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		// directionalLight.position.set(0, 32, 64)
		// scene.add(directionalLight);
	
		// // box mesh
		// const boxGeometry = new THREE.BoxGeometry(2,2,2);
		// const boxMaterial = new THREE.MeshPhongMaterial({color: 0xfafafa,});
		// const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
		// scene.add(boxMesh);
	
		// // plane mesh
		// const PlaneGeometry = new THREE.PlaneGeometry(10, 10);
		// const planeMaterial = new THREE.MeshBasicMaterial();
		// const planeMesh = new THREE.Mesh(PlaneGeometry, planeMaterial);
	
		// planeMesh.position.copy(groundBody.position);
		// planeMesh.quaternion.copy(groundBody.quaternion);
		// scene.add(planeMesh);
	
		// // orbit controls
		// const controls = new OrbitControls(camera, renderer.domElement);
	  
		// // function for rendering animation
		// function animate() {
		//   requestAnimationFrame(animate);
	
		//   boxMesh.position.copy(boxBody.position);
		//   boxMesh.quaternion.copy(boxBody.quaternion);
	
		  
		//   world.fixedStep();
		//   controls.update();
		//   renderer.render(scene, camera);
		// };
	
		// animate();

      //init vars
			let camera:any, controls:any, scene:any, renderer:any;

      //determine world values
			const worldWidth = 10, worldLength = 10;
			const worldHalfWidth = worldWidth / 2;
			const worldHalfDepth = worldLength / 2;
			const data = generateHeight( worldWidth, worldLength );

			const clock = new THREE.Clock();

      //run
			let cube = init();
			animate(cube);
			 


			function init() {
        //create camera
				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
				camera.position.y = getY( worldHalfWidth, worldHalfDepth ) * 100 + 100;

        //create scene
				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xbfd1e5 );

				// sides

				const matrix = new THREE.Matrix4();

				//textures

				//
				const pxGeometry = new THREE.PlaneGeometry( 100, 100 );
				pxGeometry.attributes['uv'].array[ 1 ] = 0.5;
				pxGeometry.attributes['uv'].array[ 3 ] = 0.5;
				pxGeometry.rotateY( Math.PI / 2 );
				pxGeometry.translate( 50, 0, 0 );

				const nxGeometry = new THREE.PlaneGeometry( 100, 100 );
				nxGeometry.attributes['uv'].array[ 1 ] = 0.5;
				nxGeometry.attributes['uv'].array[ 3 ] = 0.5;
				nxGeometry.rotateY( - Math.PI / 2 );
				nxGeometry.translate( - 50, 0, 0 );

				const pyGeometry = new THREE.PlaneGeometry( 100, 100 );
				pyGeometry.attributes['uv'].array[ 5 ] = 0.5;
				pyGeometry.attributes['uv'].array[ 7 ] = 0.5;
				pyGeometry.rotateX( - Math.PI / 2 );
				pyGeometry.translate( 0, 50, 0 );

				const pzGeometry = new THREE.PlaneGeometry( 100, 100 );
				pzGeometry.attributes['uv'].array[ 1 ] = 0.5;
				pzGeometry.attributes['uv'].array[ 3 ] = 0.5;
				pzGeometry.translate( 0, 0, 50 );

				const nzGeometry = new THREE.PlaneGeometry( 100, 100 );
				nzGeometry.attributes['uv'].array[ 1 ] = 0.5;
				nzGeometry.attributes['uv'].array[ 3 ] = 0.5;
				nzGeometry.rotateY( Math.PI );
				nzGeometry.translate( 0, 0, - 50 );


				const geometries = [];

				for ( let z = 0; z < worldLength; z ++ ) {

					for ( let x = 0; x < worldWidth; x ++ ) {
            
            //get y pos (according to height map generated)
						const h = getY( x, z );

            //move matrix to pos in world
						matrix.makeTranslation(
							x * 100 - worldHalfWidth * 100,
							h * 100,
							z * 100 - worldHalfDepth * 100
						);

            //find surrounding heights
						const px = getY( x + 1, z );
						const nx = getY( x - 1, z );
						const pz = getY( x, z + 1 );
						const nz = getY( x, z - 1 );

            //add top planes to geometry
						geometries.push( pyGeometry.clone().applyMatrix4( matrix ) );
            
            //add certain sides depending on surrounding heights

						if ( ( px !== h && px !== h + 1 ) || x === 0 ) {

							geometries.push( pxGeometry.clone().applyMatrix4( matrix ) );

						}

						if ( ( nx !== h && nx !== h + 1 ) || x === worldWidth - 1 ) {

							geometries.push( nxGeometry.clone().applyMatrix4( matrix ) );

						}

						if ( ( pz !== h && pz !== h + 1 ) || z === worldLength - 1 ) {

							geometries.push( pzGeometry.clone().applyMatrix4( matrix ) );

						}

						if ( ( nz !== h && nz !== h + 1 ) || z === 0 ) {

							geometries.push( nzGeometry.clone().applyMatrix4( matrix ) );

						}

					}

				}

        //merge geometry into one object
				const geometry = BufferGeometryUtils.mergeGeometries( geometries );
				geometry.computeBoundingSphere();

        //load texture
				const texture = new THREE.TextureLoader().load( 'assets/images/atlas_blue.png' );
				texture.colorSpace = THREE.SRGBColorSpace;
				texture.magFilter = THREE.NearestFilter;

        //load blank mesh using texture and geometry
				const mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: texture, side: THREE.DoubleSide } ) );
				scene.add( mesh );


				const g = new THREE.BoxGeometry( 10, 10, 10 );
				const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
				const cube = new THREE.Mesh( g, material );
				scene.add( cube );

        //load light
				const ambientLight = new THREE.AmbientLight( 0xeeeeee, 3 );
				scene.add( ambientLight );

        //load light
				const directionalLight = new THREE.DirectionalLight( 0xffffff, 12 );
				directionalLight.position.set( 1, 1, 0.5 ).normalize();
				scene.add( directionalLight );

        //render
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild(renderer.domElement);

        //initate controls
				controls = new FirstPersonControls( camera, renderer.domElement );

        //determine control values
				controls.movementSpeed = 1000;
				controls.lookSpeed = 0.15;
				controls.lookVertical = true;

        		document.body.appendChild(renderer.domElement);

				//check if the window size changes, if so run onWindowResize
				window.addEventListener( 'resize', onWindowResize );
				return cube
			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				controls.handleResize();

			}

			function generateHeight( width:any, height:any ) {

				const data = [], perlin = new ImprovedNoise(),
					size = width * height, z = Math.random() * 100;

				let quality = 2;

				for ( let j = 0; j < 4; j ++ ) {

					if ( j === 0 ) for ( let i = 0; i < size; i ++ ) data[ i ] = 0;

					for ( let i = 0; i < size; i ++ ) {

						const x = i % width, y = ( i / width ) | 0;
						data[ i ] += perlin.noise( x / quality, y / quality, z ) * quality;


					}

					quality *= 4;

				}
				console.log(data)
				return data;

			}

			function getY( x:any, z:any ) {

				return ( data[ x + z * worldWidth ] * 0.15 ) | 0;

			}

			//

			function animate(cube: any) {

				requestAnimationFrame( animate );
				const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion); 
				console.log(forward)
				cube.position.x,cube.position.y,cube.position.z = forward
				render();
				//Stats.update();

			}

			function render() {

				controls.update( clock.getDelta() );
				renderer.render( scene, camera );
      }
    }
}
