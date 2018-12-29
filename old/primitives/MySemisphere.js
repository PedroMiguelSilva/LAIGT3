/**
 * MySemisphere
 * @constructor
 */
class MySemisphere extends CGFobject
{
	constructor(scene, slices, stacks) 
	{
		super(scene);

		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	};

	initBuffers() 
	{
		// utilizar sistema de coordenadas esfericas
		var radius = 1;
		var theta = Math.PI * 2 / this.slices;
		var phi = Math.PI / 2 / this.stacks;

		var slice_vertices = this.stacks+1;
			
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];
		
		var theta_i = 0;
		for (var i = 0; i < this.slices; i++) {

			// definir vertices da "aresta" com respetivas normais
			var phi_j = Math.PI / 2;
			for (var j = 0; j <= this.stacks; j++) {
				var x = radius * Math.sin(phi_j) * Math.cos(theta_i);
				var y = radius * Math.sin(phi_j) * Math.sin(theta_i);
				var z = radius * Math.cos(phi_j);

				this.vertices.push(x, y, z);
				this.normals.push(x, y, z);
				this.texCoords.push(0.5 * (1 + x), 0.5 * (1 - y));
		
				phi_j -= phi;
			}

			theta_i += theta;
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
