module.exports = function( THREE ){

	var defaultQuad = new THREE.PlaneBufferGeometry(2,2,1,1);

	var defaultVertexShader = [

		"uniform vec4 uSize;",
		"varying vec2 vUv;",
		"void main(){",
			"vUv = uv;",
			"vec2 transformed = position.xy * uSize.xy - vec2(1.,-1.) + vec2( uSize.x ,  -uSize.y ) + vec2( uSize.w , - uSize.z ) * 2.;",
			"gl_Position = vec4( transformed , 1. , 1. );",
		"}",

	].join("\n");

	var defaultFragmentShader = [
		
		"varying vec2 vUv;",
		"void main(){",
			"gl_FragColor = vec4( vUv , 0. , 1. );",
		"}"

	].join("\n");


	function ScreenQuad( params){

		params = params || {};

		THREE.Mesh.apply( this, [ defaultQuad , new THREE.ShaderMaterial({

			uniforms:{
				uTexture:{
					type:'t',
					value:null
				},
				uSize:{
					type:'v4',
					value:new THREE.Vector4(1,1,0,0)
				}
			},

			vertexShader: defaultVertexShader,

			fragmentShader: params.fragmentShader ? fragmentShader : defaultFragmentShader,

			depthWrite: false

		})]);


		this.renderOrder = -1;

		this.top = undefined !== params.top ? params.top : 0;

		this.left = undefined !== params.left ? params.left : 0;

		this.width = undefined !== params.width ? params.width : 1;

		this.height = undefined !== params.height ? params.height : 1;

		this._pixels = [false,false,false,false]; //w h t l 

		this._componentSetters = [
			this.setWidth,
			this.setHeight,
			this.setTop,
			this.setLeft
		];

		this._components = [
			'width',
			'height',
			'top',
			'left'
		];

		this.screenSize = new THREE.Vector2( 1 , 1 );
			
		this.setSize( this.width , this.height );

		this.setOffset( this.top , this.left );

	}

	ScreenQuad.prototype = Object.create( THREE.Mesh.prototype );
	ScreenQuad.constructor = ScreenQuad;

	ScreenQuad.prototype.setScreenSize = function( width , height ){

		console.log( width , height );
		this.screenSize.set( width , height );

		this._pixels.forEach( ( p , pi )=>{

			//if a component is set in pixels, update the uniform 
			if ( p ) this._componentSetters[ pi ].call(this , this[ this._components[pi] ] );  
			
		});

	}
	ScreenQuad.prototype.setSize = function( width , height ){

		this.setWidth( width );
		
		this.setHeight( height );

	};

	ScreenQuad.prototype.setWidth = function( v ) {

		this.width = v;

		if( isNaN( v ) ){

			this.material.uniforms.uSize.value.x = parseInt( v ) / this.screenSize.x;

			this._pixels[0] = true;

		} else {

			this.material.uniforms.uSize.value.x = v;

			this._pixels[0] = false;

		}

	};

	ScreenQuad.prototype.setHeight = function( v ){

		this.height = v;

		if( isNaN( v ) ){

			this.material.uniforms.uSize.value.y = parseInt( v ) / this.screenSize.y;

			this._pixels[1] = true;

		} else {

			this.material.uniforms.uSize.value.y = v;

			this._pixels[1] = false;

		}

	};

	ScreenQuad.prototype.setOffset = function( top , left ) {

		this.setLeft( left );

		this.setTop( top );

	}

	ScreenQuad.prototype.setTop = function( v ) {


		this.top = v;

		if( isNaN( v ) ){

			this.material.uniforms.uSize.value.z = parseInt( v ) / this.screenSize.y;

			this._pixels[2] = true;

		} else {

			this.material.uniforms.uSize.value.z = v;

			this._pixels[2] = false;

		}

	}

	ScreenQuad.prototype.setLeft = function( v ){


		this.left = v;

		if( isNaN( v ) ){

			this.material.uniforms.uSize.value.w = parseInt( v ) / this.screenSize.x;

			this._pixels[3] = true;

		} else {

			this.material.uniforms.uSize.value.w = v;

			this._pixels[3] = false;

		}

	}

	return ScreenQuad

}