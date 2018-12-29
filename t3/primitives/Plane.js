/**
 * Plane
 * @constructor
 */
class Plane extends CGFobject
{
	constructor(scene, uDivs, vDivs) 
	{
        super(scene);
        this.scene = scene;
        
        //Values to create the surface
        this.controlvertexes = [];
        this.uDivs = uDivs;
        this.vDivs = vDivs;

        //Surface to display
        this.surface = null;
        
        //Initializing the surface
        this.initControlvertexes();
        this.makeSurface();
    };
    
    initControlvertexes() {

        var u0 = [      // U = 0 ; V = 0..1 (control vertexes)
            [-0.5, 0, 0.5, 1],
            [-0.5, 0, -0.5, 1]
        ];

        var u1 = [      //U = 0 ; V = 0..1 (control vertexes) 
            [0.5, 0, 0.5, 1],
            [0.5, 0, -0.5, 1]
        ]

        this.controlvertexes.push(u0);
        this.controlvertexes.push(u1);
    }

	makeSurface() {

		var nurbsSurface = new CGFnurbsSurface(1, 1, this.controlvertexes);

        this.surface = new CGFnurbsObject(this.scene, this.uDivs, this.vDivs, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }

    updateTexCoords(lengthS, lengthT) {
        
    }
    
    display() {

        this.scene.pushMatrix();
            this.surface.display();
        this.scene.popMatrix();
    }

};
