/**
 * MySphere
 * @constructor
 */
class MySphere extends CGFobject
{
	constructor(scene, radius, slices, stacks) 
	{
		super(scene);

        this.radius = radius;
		this.slices = slices;
        this.stacks = stacks;

		this.initBuffers();
    };
    
    initBuffers() 
	{		
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		var deta = 2*Math.PI / this.slices;
		var phi = Math.PI / this.stacks;
		var r = this.radius;
		
		for(var i=0; i <= this.slices ; i++)
			for(var j=0; j <= this.stacks; j++){

				var x = Math.cos(deta*i) * Math.sin(phi*j);
				var y = Math.sin(deta*i) * Math.sin(phi*j);
				var z = Math.cos(phi*j);
				  

				this.vertices.push(r*x,r*y,r*z);
				this.normals.push(x,y,z);

				var s = i / this.slices;
				var t = j / this.stacks;

				this.texCoords.push(s, t);

			}

			
		for(var i=0; i < this.slices; i++)
			for(var j=0; j < this.stacks; j++){

				var p0 = i*(this.stacks+1) + j; 
				var p1 = p0 + 1;			
				var p2 = p0 + this.stacks + 1;	
				var p3 = p2 + 1;		

				this.indices.push(p0, p1, p3);	
				this.indices.push(p0, p3, p2);	
			}
		

		this.primitiveType = this.scene.gl.TRIANGLES;
				
		this.initGLBuffers();
	};




    updateTexCoords(lengthS, lengthT){
        //EMPTY: doesn't need to apply texture amplifications
	}



    showPriorities(){
        
    }

};
