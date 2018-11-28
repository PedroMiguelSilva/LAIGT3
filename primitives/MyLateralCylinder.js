/**
 * MyCylinder
 * @constructor
 */
class MyLateralCylinder extends CGFobject
{
	constructor(scene, base, top, slices, stacks, minS, maxS, minT, maxT) 
	{
		super(scene);

		this.slices = slices;
		this.stacks = stacks;

		this.base = base;
		this.top = top;
		
		this.minS = minS || 0.0;
		this.maxS = maxS || 1.0;
		this.minT = minT || 0.0;
		this.maxT = maxT || 1.0;
		
		this.sLength = (this.maxS - this.minS) / this.slices;
		this.tLength = (this.maxT - this.minT) / this.stacks;
		
		this.initBuffers();
	};

	initBuffers() 
	{
		var alpha = Math.PI * 2 / this.slices;
		var delta_z = 1 / this.stacks;
		var slice_vertices = this.stacks+1;
		var aux = this.base - this.top;
		var delta_radius = 0;
			
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];
		
		for (var i = 0; i <= this.slices; i++) {

			var alpha_i = i * alpha;

			var radius = this.base;
			var x = radius * Math.cos(alpha_i);
			var y = radius * Math.sin(alpha_i);
			var x_normal = x;
			var y_normal = y;
			var z = 0;

			// definir vertices da aresta com respetivas normais
			for (var j = 0; j <= this.stacks; j++) {
				this.vertices.push(x, y, z);
				this.normals.push(x_normal, y_normal, z);
				this.texCoords.push(this.minS + i*this.sLength, this.minT + j*this.tLength);
				
				z = z + delta_z;

				delta_radius = aux*z;
				radius = this.base - delta_radius;

				var x = radius * Math.cos(alpha_i);
				var y = radius * Math.sin(alpha_i);
			}
		}
		// Definir indices
		var verticesNum = this.vertices.length/3;
		for (var i = 0; i < this.slices; i++) {
			for (var j = 0; j < this.stacks; j++) {
				this.indices.push(slice_vertices*i+j, (slice_vertices*(i+1)+j)%verticesNum, slice_vertices*i+j+1);
				this.indices.push((slice_vertices*(i+1)+j)%verticesNum, (slice_vertices*(i+1)+j+1)%verticesNum, slice_vertices*i+j+1);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		
		this.initGLBuffers();
	};
};
