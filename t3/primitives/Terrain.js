/**
 * Terrain
 * @constructor
 */
class Terrain extends CGFobject
{
	constructor(scene,textureId,heightMap,parts,heightScale) 
	{
        super(scene);
        this.scene = scene;
        
        //Values to create the surface
        this.parts = parts;
        this.controlvertexes = [];  
        
        //Create the Shader
        this.shader = new CGFshader(this.scene.gl,"shaders/terrain.vert","shaders/terrain.frag");

        //Set the variables for the shader
        this.shader.setUniformsValues({normScale: heightScale});
        this.shader.setUniformsValues({uSampler: 0});
        this.shader.setUniformsValues({uSampler2: 1});

        //Textures used by the shader
        this.texture = new CGFtexture(this.scene,textureId);
        this.heightMapTexture = new CGFtexture(this.scene,heightMap);
        
        //Plane used as the base
        this.plane = new Plane(this.scene,parts,parts);        
    };

    updateTexCoords(lengthS, lengthT) {
        
    }
    
    /**
     * Displays the terrain on the scene
     */
    display() {
        this.scene.pushMatrix();
            this.scene.setActiveShader(this.shader);
            this.texture.bind(0);
            this.heightMapTexture.bind(1);
            this.plane.display();
            this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.popMatrix();
    }

};
