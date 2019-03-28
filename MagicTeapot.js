// ==========================================================================
// ====== ===================== The Magic Teapot ===================== ======
// ==========================================================================
// $Id: MagicTeapot.js,v 1.0 2019/03/27 20:00:00 Liren Pan Created $
// The Magic Teapot Three.js project
// ==========================================================================
// (C)opyright:
//
//    Liren Pan
//    https://www.fredpan.cn
//	  Available on: https://github.com/fredpan
//	  Published on: https://github.com/fredpan
//
// Creator: Liren Pan
// Email:   fredpan0821@gmail.com
// ==========================================================================
// $Log: MagicTeapot.js,v $
// Revision 1.0  2019/03/27 19:21:22  Liren
// Updated copyright.
//
// Revision 0.9  2019/03/27 18:27:03  Liren
// Added additional skymap "skins".
// Improved dat.gui control logics.
//
// Revision 0.7  2019/03/26 13:22:27  Liren
// Finished skymap and environment lighting.
//
// Revision 0.5  2019/03/25 17:51:51  Liren
// Finished Bump Mapping.
//
// Revision 0.3  2019/03/23 22:33:09  Liren
// Finished Displacement Mapping.
// Finished Specular Mapping.
//
// Revision 0.1  2019/03/22 21:08:27  Liren
// Finished Decal Texture.
// Finished Lighing setup.
//
// ========================================================================== 

var scene;
var camera;
var teapot;
var renderer;
var spotLight;
var controllers;
var teapotSize = 100;
var selectedTheme = "blood_valley";

function init(){


	//init basic
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( canvasWidth, canvasHeight );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	scene = new THREE.Scene();
	// scene.background = new THREE.Color( 0x00000 );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 80000 );
	camera.position.set( - 600, 550, 1300 );
	var cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
	cameraControls.addEventListener( 'change', render );
	// cameraControls.maxDistance = 5000;



	//INIT SKYBOX


	// Old way to setup skybox, DEPRECATED

	// skyboxGeo = new THREE.CubeGeometry(10000, 10000, 10000);
	// var cubeMaterials = 
	// [
	// new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("mp/ft.png"), side: THREE.DoubleSide } ),
	// new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("mp/bk.png"), side: THREE.DoubleSide } ),
	// new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("mp/up.png"), side: THREE.DoubleSide } ),
	// new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("mp/dn.png"), side: THREE.DoubleSide } ),
	// new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("mp/rt.png"), side: THREE.DoubleSide } ),
	// new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load("mp/lf.png"), side: THREE.DoubleSide } ),
	// ];
	// var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
	// cubeMaterial.envMap = cubeMaterials;
	// // cubeMaterial.depthTest = false;
	// // cubeMaterial.depthWrite = false;
	// // cubeMaterial.depthFunc = false;
	// var cube = new THREE.Mesh(skyboxGeo, cubeMaterial);
	// scene.add(cube);


	//Init cube textrues
	cubeLoader_blood_valley = new THREE.CubeTextureLoader();
	cubeLoader_blood_valley.setPath( 'img/skybox/blood-valley/' );
	blood_valley = cubeLoader_blood_valley.load( [
	'ft.png', 'bk.png',
	'up.png', 'dn.png',
	'rt.png', 'lf.png'
	] );
	
	cubeLoader_castle = new THREE.CubeTextureLoader();
	cubeLoader_castle.setPath( 'img/skybox/castle/' );
	castle = cubeLoader_castle.load( [
	'ft.png', 'bk.png',
	'up.png', 'dn.png',
	'rt.png', 'lf.png'
	] );

	cubeLoader_city = new THREE.CubeTextureLoader();
	cubeLoader_city.setPath( 'img/skybox/city/' );
	city = cubeLoader_city.load( [
	'ft.png', 'bk.png',
	'up.png', 'dn.png',
	'rt.png', 'lf.png'
	] );

	scene.background = blood_valley;//default theme



	//INIT TEAPOT


	//init colors
	materialColor = new THREE.Color();
	materialColor.setRGB( 1, 1, 1 );
	specularColor = new THREE.Color();
	specularColor.setRGB( 1, 1, 1 );


	//init textures
	fernTexture = new THREE.TextureLoader().load( 'img/fern.png' );
	fernTexture.wrapS = fernTexture.wrapT = THREE.RepeatWrapping;
	fernTexture.anisotropy = 21;
	specularMap = new THREE.TextureLoader().load( 'img/fern_specular_map.png' );
	specularMap.wrapS = specularMap.wrapT = THREE.RepeatWrapping;
	specularMap.anisotropy = 21;
	displacementMap = new THREE.TextureLoader().load( 'img/fern_displacement_map.png' );
	displacementMap.wrapS = displacementMap.wrapT = THREE.RepeatWrapping;
	displacementMap.anisotropy = 21;
	displacementMap.roughness = 0;
	bumpMap = new THREE.TextureLoader().load( 'img/fern_bump_map.png' );
	bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
	bumpMap.anisotropy = 21;
	bumpMap.roughness = 0;
	//END OF INIT TEAPOT



	//init lights
	ambientLight = new THREE.AmbientLight( 0x333333, 0.1 );
	scene.add(ambientLight);

	directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 0.6 );
	directionalLight.position.set(-1000, 1000, 1000);
	scene.add(directionalLight);

	spotLight = new THREE.SpotLight( 0xffffff, 1 );
	spotLight.position.set( 0, 500, 500 );
	scene.add(spotLight);


	//finish init
	var container = document.getElementById("display");
	container.appendChild( renderer.domElement );


	//attach info
	info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '5px';
    info.style.left = '50px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.style.color = "lightblue";
    info.innerHTML = "<p>The Magic Teapot</p><p>Created by &copy 2019 <a  href='https://github.com/fredpan'>Liren Pan</a></p>";
    container.appendChild(info);

	initGUI();

	render();

}

function initGUI(){
	controllers = new function(){

		this.ambientLight = true;
		this.directionalLight = true;
		this.spotLight = true;
		this.spotLightXPosition = 0;
		this.spotLightZPosition = 90;
		this.spotLightLightness = 0.5;
		this.spotLightAngle = 60;

		// this.showPhongShading = true;
		this.showFlatShading = false;
		this.showFernDecal = false;
		this.segmentNum = 10;

		this.showSpecular = false;
		this.shininess = 30;
		this.specularColor = 0xFFFFFF;

		this.showDisplacement = false;
		this.displacementScale = 0;

		this.showBump = false;		
		this.bumpScale = 0;

		this.showCube = false;
		this.envMapping = false;
		this.skyboxTheme = 'blood_valley';
		
	}
	var gui = new dat.GUI();
	lightControls = gui.addFolder("Light Controls");
	ambCtrl = lightControls.add(controllers, "ambientLight", true, false).name("Ambient Light").onChange(render);
	directCtrl = lightControls.add(controllers, "directionalLight", true, false).name("Directional Light").onChange(render);
	spotCtrl = lightControls.add(controllers, "spotLight", true, false).name("Spot Light").onChange(render);
	lightControls.add(controllers, "spotLightXPosition", -180, 180).name("X Position of Spot Light").onChange(render);
	lightControls.add(controllers, "spotLightZPosition", -180, 180).name("Z Position of Spot Light").onChange(render);
	lightControls.add(controllers, "spotLightLightness", 0, 1).name("Spot Light Lightness").onChange(render);
	lightControls.add(controllers, "spotLightAngle", 0, 180).name("Spot Light Angle").onChange(render);

	teapotMaterialControl = gui.addFolder("Teapot Materials");
	// teapotMaterialControl.add(controllers, "showPhongShading", true, false).name("Show Phong Shading").onChange(render);
	teapotMaterialControl.add(controllers, "showFlatShading", true, false).name("Show Flat Shading").onChange(render);
	teapotMaterialControl.add(controllers, "showFernDecal", true, false).name("Show Fern Decal").onChange(render);
	teapotMaterialControl.add(controllers, "segmentNum", 1, 210).name("Number of Segment").onChange(render)

	teapotSpecularControl = gui.addFolder("Teapot Specular");
	specularCtrl = teapotSpecularControl.add(controllers, "showSpecular", true, false).name("Show Specular").onChange(render);
	teapotSpecularControl.add(controllers, "shininess", 1, 10000).name("Shininess").onChange(render);
	teapotSpecularControl.addColor(controllers, 'specularColor').name('Specular Color').onChange(render);

	teapotDisplacementControl = gui.addFolder("Teapot Displacement");
	displacementCtrl = teapotDisplacementControl.add(controllers, "showDisplacement", true, false).name("Show Displacement").onChange(render);
	teapotDisplacementControl.add(controllers, "displacementScale", 0, 30).name("Displacement Scale").onChange(render);

	teapotBumpControl = gui.addFolder("Teapot Bump");
	bumpCtrl = teapotBumpControl.add(controllers, "showBump", true, false).name("Show Bump").onChange(render);
	teapotBumpControl.add(controllers, "bumpScale", 0, 1).name("Bump Scale").onChange(render);

	skybBoxControl = gui.addFolder("Sky Box and IBL");
	skybBoxControl.add(controllers, "showCube", true, false).name("Show Sky Box").onChange(render);
	skybBoxControl.add(controllers, "envMapping", true, false).name("Environment Lighting").onChange(render);
	
	skybBoxControl
	.add(
		controllers, 
		"skyboxTheme", 
		{
			"Blood Valley" : "blood_valley", 
			"Castle" : "castle", 
			"City" : "city"
		})
	.name("Skybox Theme")
	.onChange(
		function(value){
			selectedTheme = value;
			render();
		});
}


function render() {

	var spotLightLightness = controllers.spotLightLightness;
	var currTheme = blood_valley;

	scene.remove( teapot );

	specularColor.set(controllers.specularColor);

	// Skybox
	//theme selection
	if (selectedTheme == "blood_valley") {
		currTheme = blood_valley;
	}else if (selectedTheme == "castle") {
		currTheme = castle;
	} else if (selectedTheme == "city") {
		currTheme = city
	}else {
		throw new Error('404: Theme not found!');
	}

	if (controllers.showCube) {
		scene.background = currTheme;
		envMap = currTheme;
		if (!controllers.envMapping) {
			envMap = null;
		}
	}else{
		envMap = null;
		scene.background = new THREE.Color( 0x00000 );
	}


	//teapot
	teapotGeometry = new THREE.TeapotBufferGeometry( teapotSize, controllers.segmentNum, true, true, true, false, true );

	// defaultMaterial = new THREE.MeshLambertMaterial( { color: materialColor, envMap: envMap, side: THREE.DoubleSide} );
	// defaultMaterial.combine = THREE.MixOperation;

	phongMaterial = new THREE.MeshPhongMaterial( { color: materialColor, envMap: envMap, side: THREE.DoubleSide} );
	phongMaterial.combine = THREE.MixOperation;


	//Displacement trigger
	if (controllers.showDisplacement){
		phongMaterial.displacementMap = displacementMap;
		phongMaterial.displacementScale = controllers.displacementScale;

		// default material Lambert does not support displacement map
		// defaultMaterial.displacementMap = displacementMap;
		// defaultMaterial.displacementScale = controllers.displacementScale;
	}else{
		phongMaterial.displacementMap = null;
		phongMaterial.displacementScale = 0;

		// default material Lambert does not support displacement map
		// defaultMaterial.displacementMap = null;
		// defaultMaterial.displacementScale = 0;
	}


	//Bump trigger
	if (controllers.showBump){
		phongMaterial.bumpMap = bumpMap;
		phongMaterial.bumpScale = controllers.bumpScale;

		// default material Lambert does not support bump map
		// defaultMaterial.bumpMap = bumpMap;
		// defaultMaterial.bumpScale = controllers.bumpScale;
	}else{
		phongMaterial.bumpMap = null;
		phongMaterial.bumpScale = 0;

		// default material Lambert does not support bump map
		// defaultMaterial.bumpMap = null;
		// defaultMaterial.bumpScale = 0;
	}


	//Fern Decal trigger
	if (controllers.showFernDecal){
		phongMaterial.map = fernTexture;	

		// defaultMaterial.map = fernTexture;	
	}else{
		phongMaterial.map = null;

		// defaultMaterial.map = null;
	}


	//Specular
	if (controllers.showSpecular){
		phongMaterial.specularMap = specularMap;
		phongMaterial.specular = specularColor;
		phongMaterial.shininess = controllers.shininess;

		// default material Lambert does affect by specular
		// defaultMaterial.specularMap = specularMap;
		// defaultMaterial.specular = specularColor;
		// defaultMaterial.shininess = controllers.shininess;
	}else{
		phongMaterial.specularMap = null;
		phongMaterial.shininess = 0;

		// default material Lambert does affect by specular
		// defaultMaterial.specularMap = null;
		// defaultMaterial.shininess = 0;
	}


	//flat shading
	phongMaterial.flatShading = controllers.showFlatShading;
	// defaultMaterial.flatShading = controllers.showFlatShading;


	//Phong trigger
	// if (controllers.showPhongShading){
		// teapot = new THREE.Mesh(teapotGeometry, phongMaterial);	
		// displacementCtrl.__checkbox.disabled = '';
		// specularCtrl.__checkbox.disabled = '';
		// bumpCtrl.__checkbox.disabled = '';
	// }else{
	// 	teapot = new THREE.Mesh(teapotGeometry, defaultMaterial);
	// 	displacementCtrl.__checkbox.disabled = 'disabled';
	// 	specularCtrl.__checkbox.disabled = 'disabled';
	// 	bumpCtrl.__checkbox.disabled = 'disabled';
	// 	displacementCtrl.__checkbox.checked = false;
	// 	specularCtrl.__checkbox.checked = false;
	// 	bumpCtrl.__checkbox.checked = false;
	// }

	teapot = new THREE.Mesh(teapotGeometry, phongMaterial);

	scene.add(teapot);


	//Ambient light trigger
	if (controllers.ambientLight){
		scene.remove(ambientLight);
		scene.add(ambientLight);
	}else {
		scene.remove(ambientLight);
	}


	//Directional light trigger
	if (controllers.directionalLight){
		scene.remove(directionalLight);
		scene.add(directionalLight);
	}else {
		scene.remove(directionalLight);
	}


	//Spot light trigger
	if (controllers.spotLight){
		scene.remove(spotLight);
		spotLight = new THREE.SpotLight( 0xffffff, spotLightLightness );
		spotLight.angle = controllers.spotLightAngle * Math.PI/180;
		spotLight.target = teapot;
		positionX = controllers.spotLightXPosition * Math.PI/180 * 500;
		positionZ = controllers.spotLightZPosition * Math.PI/180 * 500;
		spotLight.position.set( positionX, 500, positionZ );
		scene.add(spotLight);
	}else{
		scene.remove(spotLight);
	}


	//light adjustion while switching skybox
	// if (controllers.showCube) {
	// 	controllers.ambientLight = false;
	// 	controllers.spotLight = false;
	// 	controllers.directionalLight = false;
	// 	ambCtrl.__checkbox.checked = false;
	// 	spotCtrl.__checkbox.checked = false;
	// 	directCtrl.__checkbox.checked = false;
	// }else{
	// 	scene.add(ambientLight);
	// 	scene.add(directionalLight);
	// 	scene.add(spotLight);
	// 	ambCtrl.__checkbox.checked = true;
	// 	spotCtrl.__checkbox.checked = true;
	// 	directCtrl.__checkbox.checked = true;
	// }

	renderer.render( scene, camera );
}

window.addEventListener("load", init, false);