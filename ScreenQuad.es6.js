

//avoid creating geometry per intance?

const defaultQuad = new THREE.PlaneBufferGeometry(2,2,1,1);

const defaultVertexShader = `
	
uniform vec4 uSize; 		//w h t l 

varying vec2 vUv;

void main(){

	vUv = uv;

	vec2 transformed = position.xy * uSize.xy - vec2(1.,-1.) + vec2( uSize.x ,  -uSize.y ) + vec2( uSize.w , - uSize.z ) * 2.;
	
	gl_Position = vec4( transformed , 1. , 1. );

}
`;


const defaultFragmentShader = `
	
varying vec2 vUv;

uniform sampler2D uTexture;

void main(){

	gl_FragColor = texture2D( uTexture , vUv );

}	
`;


export default class ScreenQuad extends THREE.Mesh{

	constructor({
	
		width = 1,        	//100%
		height = 1,			//100%
		top = 0,			
		left = 0,
		texture = null,
		fragmentShader = false
	
	} = {}) {
	
		super( defaultQuad , new THREE.ShaderMaterial({

			uniforms:{
				uTexture:{
					type:'t',
					value: texture
				},
				uSize:{
					type:'v4',
					value:new THREE.Vector4(1,1,0,0)
				}
			},

			vertexShader: defaultVertexShader,

			fragmentShader: fragmentShader ? fragmentShader : defaultFragmentShader,

			depthWrite: false

		}));

		this.frustumCulled = false;

		this.renderOrder = -1;

		this.top = top;

		this.left = left;

		this.width = width;

		this.height = height;


		//cleanup
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
			
		this.setSize( width , height );

		this.setOffset( top , left );

	}

	setScreenSize( width , height ){

		// this.material.uniforms.uScreenSize.value.set( width , height , 1 / width , 1 / height );
		this.screenSize.set( width , height );

		this._pixels.forEach( ( p , pi )=>{

			//if a component is set in pixels, update the uniform 
			if ( p ) this._componentSetters[ pi ].call(this , this[ this._components[pi] ] );  
			
		});

	}

	setSize( width , height ){


		this.setWidth( width );
		this.setHeight( height );

	}

	setWidth( v ) {

		this.width = v;

		if( isNaN( v ) ){

			this.material.uniforms.uSize.value.x = parseInt( v ) / this.screenSize.x;

			this._pixels[0] = true;

		} else {

			this.material.uniforms.uSize.value.x = v;

			this._pixels[0] = false;

		}

	}

	setHeight( v ){

		this.height = v;

		if( isNaN( v ) ){

			this.material.uniforms.uSize.value.y = parseInt( v ) / this.screenSize.y;

			this._pixels[1] = true;

		} else {

			this.material.uniforms.uSize.value.y = v;

			this._pixels[1] = false;

		}

	}

	setOffset( top , left ){

		// this.material.uniforms.uSize.value.z = top;

		// this.material.uniforms.uSize.value.w = left;

		this.setLeft( left );
		this.setTop( top );

	}

	setTop( v ) {

		console.log( v );

		this.top = v;

		if( isNaN( v ) ){

			this.material.uniforms.uSize.value.z = parseInt( v ) / this.screenSize.y;

			this._pixels[2] = true;

		} else {

			this.material.uniforms.uSize.value.z = v;

			this._pixels[2] = false;

		}

	}

	setLeft( v ){

		console.log( v );

		this.left = v;

		if( isNaN( v ) ){

			this.material.uniforms.uSize.value.w = parseInt( v ) / this.screenSize.x;

			this._pixels[3] = true;

		} else {

			this.material.uniforms.uSize.value.w = v;

			this._pixels[3] = false;

		}

		console.log( this._pixels )

	}

}