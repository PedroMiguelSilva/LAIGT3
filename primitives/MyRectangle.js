/**
 * MyRectangle
 * @constructor
 */
class MyRectangle extends CGFobject
{
	constructor(scene, x1, y1, x2, y2, pickingId) 
	{
        super(scene);
        
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

		this.minS =  0.0;
		this.maxS =  1.0;
		this.minT =  0.0;
		this.maxT =  1.0;

		this.pickingId = pickingId;
		
		this.initBuffers();
	};

	initBuffers() 
	{
		this.vertices = [
		this.x1, this.y1, 0,    //0
		this.x2, this.y1, 0,    //1
		this.x1, this.y2, 0,    //2
		this.x2, this.y2, 0     //3
		];

		this.indices = [
		0, 1, 2, 
		3, 2, 1
		];

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.texCoords = [
			this.minS, this.maxT,
			this.maxS, this.maxT,
			this.minS, this.minT,
			this.maxS, this.minT
		];

		this.initGLBuffers();
    };
	
	updateTexCoords(lengthS, lengthT){

		var gapS = Math.abs(this.x2 - this.x1);
		var gapT = Math.abs(this.y2 - this.y1);

		var minS = this.minS;
		var minT = this.minT;
		var maxS = gapS / lengthS;
		var maxT = gapT / lengthT;

		this.texCoords = [
			0, maxT,
			maxS, maxT,
			0, 0,
			maxS, 0
		];

		this.updateTexCoordsGLBuffers();
	}


    showPriorities(){
	/*
        console.log("x1 : " + this.x1);
        console.log("y1 : " + this.y1);
        console.log("x2 : " + this.x2);
		console.log("y2 : " + this.y2);
		
		console.log(this.texCoords);
		*/
    }
};
