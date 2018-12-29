/**
 * Cylinder2
 * @constructor
 */
class Cylinder2 extends CGFobject
{
	constructor(scene, base, top, height, slices, stacks) 
	{
        super(scene);
        this.scene = scene;
        
        //Values to create the cylinder's surface
        this.controlvertexes = [];
        this.uDivs = slices;
        this.vDivs = stacks;
        this.uPoints = 9;
        this.vPoints = 2; 
        this.degree1 = this.uPoints - 1;
        this.degree2 = this.vPoints - 1; 

        //Cylinder's values
        this.height = height;
        this.base = base;
        this.top = top;

        //Surface to display
        this.surface = null;

        //Initializing the surface
        this.initControlvertexes();
        this.makeSurface();
        
    };

    makeSurface() {
			
		var nurbsSurface = new CGFnurbsSurface(this.degree1, this.degree2, this.controlvertexes);

		this.surface = new CGFnurbsObject(this.scene, this.uDivs, this.vDivs, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }

    initControlvertexes() {

        var cornerWeight = Math.sqrt(2)/2.0;

        this.controlvertexes = [

            [
                [this.base, 0, 0, 1],
                [this.top, 0, this.height, 1]
            ],
            [
                [this.base, this.base, 0, cornerWeight],
                [this.top, this.top, this.height, cornerWeight]
            ],
            [
                [0, this.base, 0, 1],
                [0, this.top, this.height, 1]
            ],
            [
                [-this.base, this.base, 0, cornerWeight],
                [-this.top, this.top, this.height, cornerWeight]
            ],
            [
                [-this.base, 0, 0, 1],
                [-this.top, 0, this.height, 1]
            ],
            [
                [-this.base, -this.base, 0, cornerWeight],
                [-this.top, -this.top, this.height, cornerWeight]
            ],
            [
                [0, -this.base, 0, 1],
                [0, -this.top, this.height, 1]
            ],
            [
                [this.base, -this.base, 0, cornerWeight],
                [this.top, -this.top, this.height, cornerWeight]
            ],
            [
                [this.base, 0, 0, 1],
                [this.top, 0, this.height, 1]
            ]
        ];
    
    }
 

    updateTexCoords(lengthS, lengthT) {
        
    }

    
    display() {

        this.scene.pushMatrix();
            this.surface.display();
        this.scene.popMatrix();
    }

};
