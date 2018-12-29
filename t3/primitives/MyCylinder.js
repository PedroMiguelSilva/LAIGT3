/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject
{
	constructor(scene, base, top, height, slices, stacks, minS, maxS, minT, maxT) 
	{
		super(scene);

		this.scene = scene;

		this.base = new MyCircle(scene, slices, base);
		this.top = new MyCircle(scene, slices, top);
		this.lateral = new MyLateralCylinder(scene, base, top, slices, stacks);
		this.height = height;
		
		this.minS = minS || 0.0;
		this.maxS = maxS || 1.0;
		this.minT = minT || 0.0;
		this.maxT = maxT || 1.0;
		
		this.sLength = (this.maxS - this.minS) / this.slices;
		this.tLength = (this.maxT - this.minT) / this.stacks;
		
		this.initBuffers();
	};


	updateTexCoords(lengthS, lengthT){
		//EMPTY: doesn't need to apply texture amplifications
	}


	display(){

		this.scene.pushMatrix();
			this.scene.rotate(Math.PI, 0, 1, 0);
			this.base.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.scale(1, 1, this.height);
			this.lateral.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.translate(0, 0, this.height);
			this.top.display();
		this.scene.popMatrix();

	};


	showPriorities(){
		
	}

};
