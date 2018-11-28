/**
 * Vehicle
 * @constructor
 */
class Vehicle extends CGFobject
{
	constructor(scene) 
	{
        super(scene);
        this.scene = scene;

        //Bristles information
        this.bDivsU = 30;
        this.bDivsV = 10;
        this.bHeight = 3;   //Bristle's height
        this.bMaxR = 0.9;   //Bristle's max ratius

        //Cable information
        this.cSlices = 30;          //Equals slices
        this.cStacks = 3;           //Equals stacks
        this.cLength = 8;           //Cable's length
        this.cR = 0.15;             //Cable's ratius
        this.cAng = Math.PI / 6;    //Cable's first angle
        this.cAng2 = Math.PI / 18;  //Cable's second angle
        this.baseFrac = 1/5;        //Base's fraction of the total length
        this.midFrac = 1/5;         //Middle's fraction of the total length
        this.topFrac = 3/5;         //Top's fractions of the total length
        this.gapBC = 0.3;           //Gap to help proximate bristles and cabe

        //Broom's textures
        this.woodTexture = new CGFtexture(this.scene, "scenes/images/wood.png");
        this.britlesTexture = new CGFtexture(this.scene, "scenes/images/bristles.png");

        //Controlpoints
        this.bristlesControlpoints = [];
        this.cabeControlpoints = [];
       
        //Broom's bristles
        this.initBristlesControlpoints();
        this.britles = new Patch(this.scene, this.bDivsU, this.bDivsV, this.bDivsU+1, this.bDivsV+1, this.bristlesControlpoints);

        //Broom's cabe
        this.cableBase = new Cylinder2(this.scene, this.cR, this.cR, this.cLength*this.baseFrac, this.cSlices, this.cStacks);
        this.cableMid = new Cylinder2(this.scene, this.cR, this.cR, this.cLength*this.midFrac, this.cSlices, this.cStacks);
        this.cableTop = new Cylinder2(this.scene, this.cR, this.cR, this.cLength*this.topFrac, this.cSlices, this.cStacks);
  
    };
    
    initBristlesControlpoints() {

        var uDivs = this.bDivsU;
        var vDivs = this.bDivsV;
        var uPoints = uDivs + 1;
        var vPoints = vDivs + 1;

        //To calculate controlpoints (x,y,z)
        var minR = 0.001
        var maxR = this.bMaxR;
        var deltaR;
        var alpha = 2 * Math.PI / uDivs;
        var deltaH = this.bHeight / vDivs;

        //Calculating deltaR
        var totalVarR = maxR - minR;
        deltaR = totalVarR / (vDivs / 2);

        //Controlpoints coordinates
        var x, y, z;

        //Filling BristlesControlpoints
        for(var u = 0; u < uPoints; u++){

            var ratius = minR;
            var angle = u*alpha;
            z = 0;

            for(var v = 0; v < vPoints; v++){

                x = ratius * Math.cos(angle);
                y = ratius * Math.sin(angle);

                var controlpoint = vec3.fromValues(x,y,z);
                this.bristlesControlpoints.push(controlpoint);

                z += deltaH;

                if(v < vPoints/2 - 1)
                    ratius += deltaR;
                else
                    ratius -= deltaR;

                if(ratius <= 0)
                    ratius = minR;
            }

        }
    }


    updateTexCoords(lengthS, lengthT) {
        
    }
    
    display() {
        
        var zTranslate = 0;
        var yTranslate = 0;
        var gapZ;
        var gapY;

        this.scene.pushMatrix();
            this.britlesTexture.bind();
            this.britles.display();
        this.scene.popMatrix();

        zTranslate += this.bHeight - this.gapBC;
        
        this.scene.pushMatrix();
            this.scene.translate(0, 0, zTranslate);
            this.woodTexture.bind();
            this.cableBase.display();
        this.scene.popMatrix();

        gapZ = this.cR * Math.cos(Math.PI / 2 - this.cAng);
        gapY = this.cR - this.cR * Math.sin(Math.PI / 2 - this.cAng);

        zTranslate += this.cLength * this.baseFrac - gapZ;
        yTranslate -= gapY;

        this.scene.pushMatrix();
            this.scene.translate(0, yTranslate, zTranslate);
            this.scene.rotate(-this.cAng, 1, 0, 0);
            this.woodTexture.bind();
            this.cableMid.display();
        this.scene.popMatrix();


        gapZ = this.cR * Math.cos(Math.PI/2 - this.cAng) - this.cR * Math.sin(this.cAng2);
        gapY = this.cR * Math.cos(this.cAng2) - this.cR * Math.sin(Math.PI/2 - this.cAng);

        zTranslate += this.cLength * this.midFrac * Math.cos(this.cAng) - gapZ;
        yTranslate += this.cLength * this.midFrac * Math.sin(this.cAng) - gapY;

        this.scene.pushMatrix();
            this.scene.translate(0, yTranslate, zTranslate);
            this.scene.rotate(-this.cAng2, 1, 0, 0);
            this.woodTexture.bind();
            this.cableTop.display();
        this.scene.popMatrix();
    
    }

};
