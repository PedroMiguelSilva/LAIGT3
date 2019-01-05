/**
 * MyComponent - intermiate element of the graph tree
 * @constructor
 */
class MyComponent
{
	constructor(scene,graph) 
	{
        this.scene = scene;
        this.graph = graph;

        /* Children of the component */
        this.primitivesId = [];
        this.componentsId = [];

        /* Transformations of the component */
        this.transformationId = -1;
        this.transformation = null;

        /* Texture and materials */ 
        this.textureInf = null;
        this.materialsId = [];
        this.currentMaterialId;
        this.currentMaterial = null;
        this.currentTexture = null;

        /* Animations */
        this.animations = [];
        this.currentAnimationIndex = 0;
        this.doneWithAnimations = false;
    }; 

    /**
     * Displays the components and calls its children recursivly
     * @param {Material of the components' father} parentMaterial 
     * @param {Texture of the components' father} parentTexture 
     * @param {Information about the parent texture} parentTextureInf 
     * @param {Counter of the number of 'm's pressed so far} materialIndexSum 
     */
    display(parentMaterial, parentTexture, parentTextureInf, materialIndexSum){

        this.scene.pushMatrix();

        //Update values
        var indexOfMaterial = materialIndexSum%this.materialsId.length;
        this.currentMaterialId = this.materialsId[indexOfMaterial];

        

        //Check if the values should be inherited or not
        if(this.currentMaterialId == "inherit"){
            
            this.currentMaterial = parentMaterial;
        }
        else{

            this.currentMaterial = this.graph.materials[this.currentMaterialId];

            if(this.currentMaterial == undefined)
                return;
                  
        }




        //Set Component's Texture and Component's TextureInf
        var textureId = this.textureInf.id;
        if(textureId == "none"){
            
            this.currentTexture = null;
        }
        else if(textureId == "inherit"){

            this.currentTexture = parentTexture;

            //if theres no lenght_s and lenght_t, the texture inherits parent's lenght values
            if(this.textureInf.inheritST){

                this.textureInf.lengthS = parentTextureInf.lengthS;
                this.textureInf.lengthT = parentTextureInf.lengthT;
            }
        }
        else{

            this.currentTexture = this.graph.textures[textureId];
        }

        
            
        //Apply Material
        if(this.currentMaterial){
            this.currentMaterial.apply();
        }
        
        
        
        
        

        //Apply Texture
        //console.log("Textura atual" + this.currentTexture)
        if(this.currentTexture != null){

            //Update primitives TexCoords
            this.updatePrimitivesTexCoords();
            //console.log("Textura atual" + this.currentTexture)
            this.currentTexture.bind();
        }
   

        //Set Transformation
        if(this.transformationId != -1 && this.transformationId != undefined){
            this.transformation = this.graph.transformations[this.transformationId];
        }
        
        //Apply Transformation
        if(this.transformation != null && this.transformation != undefined){
            this.scene.multMatrix(this.transformation);
        }

        if(this.animations.length > 0){ 
            this.animations[this.currentAnimationIndex].apply();
        }


        
        //Print Comonent's Children (Primitives and Components)
        this.printChildren(materialIndexSum);

        this.scene.popMatrix();

    }

    /**
     * Calculate the new texture coordinates for the primitives
     */
    updatePrimitivesTexCoords(){

        var lengthS = this.textureInf.lengthS;
        var lengthT = this.textureInf.lengthT;

        for(var i=0; i < this.primitivesId.length; i++)
            this.graph.primitives[this.primitivesId[i]].updateTexCoords(lengthS, lengthT);
        
    }

    /**
     * Updates the animation with index 'this.currentAnimationIndex' from the vector 'this.animations'
     * If one animation ends then the counter should increment
     * After reaching the end of the animations it can either stay in the last position or cycle back to the first animation
     * @returns -1 if it has no longer any animation
     */
    updateAnimation(timeElapsed){
        //Update current animation
        if(this.doneWithAnimations){
            return -1;
        }

        var hasEnded = this.animations[this.currentAnimationIndex].update(timeElapsed);
        
        //Check if animation has ended
        if(hasEnded == -1){
            this.currentAnimationIndex++;
        }  

        if(this.currentAnimationIndex == this.animations.length){
            this.currentAnimationIndex = this.animations.length -1;
            this.doneWithAnimations = true;
        }
            
        return 0;
    }

    /**
     * Prints the children of the component. Children may be other components or primitives
     * @param {Counter of the material index - number of times m has been pressed so far} materialIndexSum 
     */
    printChildren(materialIndexSum){
        for(var i = 0; i < this.primitivesId.length; i++){
            this.graph.primitives[this.primitivesId[i]].display();
        }
        for(var i = 0; i < this.componentsId.length; i++){
            this.graph.components[this.componentsId[i]].display(this.currentMaterial, this.currentTexture, this.textureInf,materialIndexSum);
        }
    }

};
