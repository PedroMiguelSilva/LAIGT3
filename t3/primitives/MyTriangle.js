/**
 * MyTriangle
 * @constructor
 */
class MyTriangle extends CGFobject
{
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3, minS, maxS, minT, maxT) 
	{
        super(scene);
        
        this.p3 = vec3.fromValues(x1, y1, z1);
  		this.p1 = vec3.fromValues(x2, y2, z2);
  		this.p2 = vec3.fromValues(x3, y3, z3);
		
		this.initBuffers();
	};

	initBuffers() 
	{
		this.vertices = [
			this.p1[0], this.p1[1], this.p1[2], // point 1
			this.p2[0], this.p2[1], this.p2[2],	// point 2
			this.p3[0], this.p3[1], this.p3[2]	// point 3
		];

		this.indices = [
		0, 1, 2, 
		];

		//Vector from point 1 to 2
		var v = vec3.fromValues(
			this.p2[0] - this.p1[0],
    		this.p2[1] - this.p1[1],
    		this.p2[2] - this.p1[2]
		)

		//Vector from point 2 to 3
		var w = vec3.fromValues(
			this.p3[0] - this.p2[0],
    		this.p3[1] - this.p2[1],
    		this.p3[2] - this.p2[2]
		)
		
		//V = P2 - P1
		//W = P3 - P1

		//Nx=(Vy∗Wz)−(Vz∗Wy)
		//Ny=(Vz∗Wx)−(Vx∗Wz)
		//Nz=(Vx∗Wy)−(Vy∗Wx)

		var normal = vec3.fromValues(
			(v[1]*w[2]) - (v[2]*w[1]),
			(v[2]*w[0]) - (v[0]*w[2]),
			(v[0]*w[1]) - (v[1]*w[0])
			)


		this.normals = [
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2],
		];

		this.texCoords = [
			0,1,
			1,1,
			0,0,
			1,0
		];

		// Distances between points
		this.dist2And3 = Math.sqrt(
			Math.pow(this.p2[0] - this.p3[0], 2) +
			Math.pow(this.p2[1] - this.p3[1], 2) +
			Math.pow(this.p2[2] - this.p3[2], 2)
		);

		this.dist1And3 = Math.sqrt(
			Math.pow(this.p1[0] - this.p3[0], 2) +
			Math.pow(this.p1[1] - this.p3[1], 2) +
			Math.pow(this.p1[2] - this.p3[2], 2)
		);

		this.dist1And2 = Math.sqrt(
			Math.pow(this.p2[0] - this.p1[0], 2) +
			Math.pow(this.p2[1] - this.p1[1], 2) +
			Math.pow(this.p2[2] - this.p1[2], 2)
		);

		// Angle Beta
		this.angBeta = Math.acos(
			(Math.pow(this.dist2And3, 2) -
			Math.pow(this.dist1And3, 2) +
			Math.pow(this.dist1And2, 2)) /
			(2 * this.dist2And3 * this.dist1And2)
		);
		
		this.distAux = this.dist2And3 * Math.sin(this.angBeta);

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.updateTexCoords(1,1);
		this.initGLBuffers();
    };
	
	updateTexCoords(lengthS, lengthT){

		this.texCoords = [
			0,							this.distAux / lengthT,
			this.dist1And2 / lengthS,	this.distAux / lengthT,
			(this.dist1And2 - this.dist2And3 * Math.cos(this.angBeta)) / lengthS,
			(this.distAux - this.dist2And3 * Math.sin(this.angBeta)) / lengthT
		  ];
		this.updateTexCoordsGLBuffers();

	}

    showPriorities(){

    }
};
