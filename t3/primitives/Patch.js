/**
 * Patch
 * @constructor
 */
class Patch extends CGFobject
{
	constructor(scene, uDivs, vDivs, uPoints, vPoints, controlpoints) 
	{
        super(scene);
        this.scene = scene;
        
        //Values to create the surface
        this.controlvertexes = [];
        this.uDivs = uDivs;
        this.vDivs = vDivs;
        this.uPoints = uPoints;
        this.vPoints = vPoints;
        this.degree1 = uPoints - 1;
        this.degree2 = vPoints - 1; 

        //Surface to display
        this.surface = null;

        //Initializing the surface
        this.initControlvertexes(controlpoints);
        this.makeSurface();
        
    };

    makeSurface() {
			
		var nurbsSurface = new CGFnurbsSurface(this.degree1, this.degree2, this.controlvertexes);

		this.surface = new CGFnurbsObject(this.scene, this.uDivs, this.vDivs, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }
    
    initControlvertexes(controlpoints) {

        var i = 0;

        for(var u = 0; u < this.uPoints; u++){

            var controlvertexesU = [];  //Saves controlevertexes of each U (U = 0..uPoints)

            for(var v = 0; v < this.vPoints; v++){   //Saving controlvertexes at all V values in each U (V = 0..vPoints)

                var point = controlpoints[i];   //point (x,y,z)

                var controlvertex = vec4.fromValues(point[0], point[1], point[2], 1);   //controlvertex with weight w=1
                controlvertexesU.push(controlvertex);

                i++;
            }

            this.controlvertexes.push(controlvertexesU);
        }
    }


    updateTexCoords(lengthS, lengthT) {
        
    }

    
    display() {

        this.scene.pushMatrix();
            this.surface.display();
        this.scene.popMatrix();
    }

};
