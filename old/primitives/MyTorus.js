/**
 * MySphere
 * @constructor
 */
class MyTorus extends CGFobject
{
	constructor(scene, inner, outer, slices, loops) 
	{
        super(scene);
        
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

		this.initBuffers();
    };
    
    initBuffers() 
	{		
		this.vertices = [];
		this.indices = [];
		this.normals = [];
        this.texCoords = [];
        
        var r = this.inner;
        var R = this.outer;

        var alpha = 2*Math.PI / this.loops;
        var beta = 2*Math.PI / this.slices;

		for(var i=0; i <= this.loops; i++){

            var xc = R * Math.cos(alpha*i);
            var yc = R * Math.sin(alpha*i);
            var zc = 0;

            //Vertices and Normals
            for(var j=0; j <= this.slices; j++){

                var x = (R + r*Math.cos(beta*j)) * Math.cos(alpha*i);
                var y = (R + r*Math.cos(beta*j)) * Math.sin(alpha*i);
                var z = r * Math.sin(beta*j);

                //vertices and normals
                this.vertices.push(x, y, z);
                this.normals.push(x - xc, y - yc, z - zc);

                //texture coordinates
                var s = j / this.slices;
				var t = i / this.loops;

				this.texCoords.push(t,s);

            }

        }

        //Indices   
        for(var i=0; i < this.loops; i++)
            for(var j=0; j < this.slices; j++){
                
                var p0 = (this.slices + 1) * i + j;           
                var p1 = p0+1;                     
                var p2 = p0 + this.slices+ 1;                            
                var p3 = p2 + 1;                     

                this.indices.push(p0, p3, p1);	
                this.indices.push(p0, p2, p3);
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
