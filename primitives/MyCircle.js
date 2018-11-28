/**
 * MyCircle
 * @constructor
 */
 class MyCircle extends CGFobject
 {
     constructor(scene, slices, radius)
     {
         super(scene);

         this.slices = slices;
         this.radius = radius;

         this.initBuffers();
     };

     initBuffers()
     {
         this.vertices = [];
         this.indices = [];
         this.normals = [];
         this.texCoords = [];

         var alpha = Math.PI * 2 / this.slices;

         // Add vertices and normals
         this.vertices.push(0, 0, 0);
         this.normals.push(0, 0, 1);
         this.texCoords.push(0.5, 0.5);

         for (var i = 0; i <= this.slices; i++)
         {
             this.vertices.push(this.radius*Math.cos(alpha * i), this.radius*Math.sin(alpha * i), 0);
             this.normals.push(0, 0, 1);
             this.texCoords.push(0.5 * (1 + Math.cos(alpha * i)), 0.5 * (1 - Math.sin(alpha * i)));
         };

         for (var i = 0; i < this.slices; i++)
         {
             this.indices.push(0, i+1, i+2);
         };

         this.primitiveType = this.scene.gl.TRIANGLES;
		
		 this.initGLBuffers();
     };
 };