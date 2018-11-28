/**
 * Water
 * @constructor
 * Use this.timeSpeed to alter the velocity of the time
 * Use dirX and dirZ to change the direction of the water
 */
class Water extends CGFobject
{
	constructor(scene,textureId,heightMap,parts,heightScale,texScale) 
	{
        super(scene);
        this.scene = scene;
        
        //Values to create the surface
        this.parts = parts;
        this.controlvertexes = [];  

        //Water moving direction
        this.dirX = 1;
        this.dirZ = 0;
        
        //Create the Shader
        this.shader = new CGFshader(this.scene.gl,"shaders/water.vert","shaders/water.frag");

        //Set values of Shader
        this.shader.setUniformsValues({normScale: heightScale});
        this.shader.setUniformsValues({uSampler: 0});
        this.shader.setUniformsValues({uSampler2: 1});
        this.shader.setUniformsValues({dirX: this.dirX});
        this.shader.setUniformsValues({dirZ: this.dirZ});
        this.shader.setUniformsValues({texScale: texScale});

        //Textures used
        this.texture = new CGFtexture(this.scene,textureId);
        this.heightMapTexture = new CGFtexture(this.scene,heightMap);
        
        //Plane used as base
        this.plane = new Plane(this.scene,parts,parts);

        //Time speed constant (The bigger this constant, the slower the time passes)
        this.timeSpeed = 10;
    };

    updateTexCoords(lengthS, lengthT) {

    }

    /**
     * Updates the position and texture of the shader to create movement
     * @param {Current Time} currTime 
     */
    update(currTime){
        var temp = currTime/this.timeSpeed;
        var time = (temp%1000)/1000;

        this.shader.setUniformsValues({timeFactor: time});
    }
    
    /**
     * Displays the water in the scene
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
