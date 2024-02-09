import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module';

import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

@Component({
  selector: 'app-canvas-box',
  templateUrl: './canvas-box.component.html',
  styleUrl: './canvas-box.component.scss'
})
export class CanvasBoxComponent {
  constructor () {

      //init vars
			let camera:any, controls:any, scene:any, renderer:any;

      //determine world values
			const worldWidth = 200, worldDepth = 200;
			const worldHalfWidth = worldWidth / 2;
			const worldHalfDepth = worldDepth / 2;
			const data = generateHeight( worldWidth, worldDepth );

			const clock = new THREE.Clock();

      //run
			init();
			animate();


			function init() {

        //create camera
				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
				camera.position.y = getY( worldHalfWidth, worldHalfDepth ) * 100 + 100;

        //create scene
				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xbfd1e5 );

				// sides

				const matrix = new THREE.Matrix4();

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

				for ( let z = 0; z < worldDepth; z ++ ) {

					for ( let x = 0; x < worldWidth; x ++ ) {
            
            //get cubes y pos (according to height map generated)
						const h = getY( x, z );

            //move cube to pos in world
						matrix.makeTranslation(
							x * 100 - worldHalfWidth * 100,
							h * 100,
							z * 100 - worldHalfDepth * 100
						);

            //find surrounding cubes
						const px = getY( x + 1, z );
						const nx = getY( x - 1, z );
						const pz = getY( x, z + 1 );
						const nz = getY( x, z - 1 );

            //add matrix/cube to geometries array
						geometries.push( pyGeometry.clone().applyMatrix4( matrix ) );
            
            //add certain sides depending on surrounding cubes?
						if ( ( px !== h && px !== h + 1 ) || x === 0 ) {

							geometries.push( pxGeometry.clone().applyMatrix4( matrix ) );

						}

						if ( ( nx !== h && nx !== h + 1 ) || x === worldWidth - 1 ) {

							geometries.push( nxGeometry.clone().applyMatrix4( matrix ) );

						}

						if ( ( pz !== h && pz !== h + 1 ) || z === worldDepth - 1 ) {

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
				const texture = new THREE.TextureLoader().load( 'assets/images/atlas.png' );
				texture.colorSpace = THREE.SRGBColorSpace;
				texture.magFilter = THREE.NearestFilter;

        //load blank mesh
				const mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: texture, side: THREE.DoubleSide } ) );
				scene.add( mesh );

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

				return data;

			}

			function getY( x:any, z:any ) {

				return ( data[ x + z * worldWidth ] * 0.15 ) | 0;

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				//Stats.update();

			}

			function render() {

				controls.update( clock.getDelta() );
				renderer.render( scene, camera );
      }
    }
}
