/**
 * Board
 * @constructor
 */
class Board extends CGFobject {

    constructor(scene) {

        super(scene);
        this.scene = scene;

        this.OUT_OF_BOUNDS = 'X';

        //White player materials (ID's)
        this.whiteTileMat = [];
        this.whiteTileMatSel = [];
        this.whitePiecesMat = [];

        //Black player materials (ID's)
        this.blackTileMat = [];
        this.blackTileMatSel = [];
        this.blackPiecesMat = [];

        //Board Matrix
        this.matrix = []
        this.init();
    }

    init(){
        //Auxiliar
        var emptyLine = [this.OUT_OF_BOUNDS,this.OUT_OF_BOUNDS,this.OUT_OF_BOUNDS,this.OUT_OF_BOUNDS,this.OUT_OF_BOUNDS,this.OUT_OF_BOUNDS]
        let pickingId = 15;
        //First few lines
        let line1 = emptyLine.slice();
        line1[3] = new MyRectangle(this.scene, -1.5,-19.5,1.5,-16.5,pickingId);
        pickingId++;
        this.matrix.push(line1);

        let line2 = emptyLine.slice();
        line2[2] = new MyRectangle(this.scene, -4.5,-16.5,-1.5,-13.5,pickingId);
        pickingId++;
        line2[3] = new MyRectangle(this.scene, -1.5,-16.5,1.5,-13.5,pickingId);
        pickingId++;
        line2[4] = new MyRectangle(this.scene, 1.5,-16.5,4.5,-13.5,pickingId);
        pickingId++;
        this.matrix.push(line2);

        let line3 = emptyLine.slice();
        line3[1] = new MyRectangle(this.scene, -7.5,-13.5,-4.5,-10.5,pickingId);
        pickingId++;
        line3[2] = new MyRectangle(this.scene, -4.5,-13.5,-1.5,-10.5,pickingId);
        pickingId++;
        line3[3] = new MyRectangle(this.scene, -1.5,-13.5,1.5,-10.5,pickingId);
        pickingId++;
        line3[4] = new MyRectangle(this.scene, 1.5,-13.5,4.5,-10.5,pickingId);
        pickingId++;
        line3[5] = new MyRectangle(this.scene, 4.5,-13.5,7.5,-10.5,pickingId);
        pickingId++;
        this.matrix.push(line3);

        //Create the middle tiles
        let sizeX = 3;
        let sizeY = 3;

        for(let i = -10.5; i < 10.5 - 0.0005; i += sizeY){
            let line = []
            for(let j = -10.5; j < 10.5 - 0.0005; j+= sizeX){
                line.push(new MyRectangle(this.scene, j,i,j+sizeX, i+sizeY,pickingId));
                pickingId++;
            }
            this.matrix.push(line);
        }

        //Create the bottom tiles
        let last3 = emptyLine.slice();
        
        last3[1] = new MyRectangle(this.scene, -7.5,10.5,-4.5,13.5,pickingId);
        pickingId++;
        last3[2] = new MyRectangle(this.scene, -4.5,10.5,-1.5,13.5,pickingId);
        pickingId++;
        last3[3] = new MyRectangle(this.scene, -1.5,10.5,1.5,13.5,pickingId);
        pickingId++;
        last3[4] = new MyRectangle(this.scene, 1.5,10.5,4.5,13.5,pickingId);
        pickingId++;
        last3[5] = new MyRectangle(this.scene, 4.5,10.5,7.5,13.5,pickingId);
        pickingId++;
        this.matrix.push(last3)

        let last2 = emptyLine.slice()
        
        last2[2] = new MyRectangle(this.scene, -4.5,13.5,-1.5,16.5,pickingId);
        pickingId++;
        last2[3] = new MyRectangle(this.scene, -1.5,13.5,1.5,16.5,pickingId);
        pickingId++;
        last2[4] = new MyRectangle(this.scene, 1.5,13.5,4.5,16.5,pickingId);
        pickingId++;
        this.matrix.push(last2)

        let last1 = emptyLine.slice()
        
        last1[3] = new MyRectangle(this.scene, -1.5,16.5,1.5,19.5,pickingId);
        pickingId++;
        this.matrix.push(last1);

    }

    display() {
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,1,0,0);

        //Display all the light color tiles =========================================
        this.scene.graph.materials['dark tiles'].apply();

        //All whites besides matrix        

        //Main Matrix
        for(var i = 0 ; i < this.matrix.length ; i++){
            if(i%2 == 0){
                var j = 0;
            }
            else{
                var j = 1;
            }
            for(; j < this.matrix[i].length ; j += 2){
                if(this.matrix[i][j] != this.OUT_OF_BOUNDS){
                    this.matrix[i][j].display();
                }
            }
        }

        //Display all the dark color tiles ===========================================
        this.scene.graph.materials['light tiles'].apply();

        //All blacks besides matrix

        //Main Matrix
        for(var i = 0 ; i < this.matrix.length ; i++){
            if(i%2 == 0){
                var j = 1;
            }
            else{
                var j = 0;
            }
            for(; j < this.matrix[i].length ; j += 2){
                if(this.matrix[i][j] != this.OUT_OF_BOUNDS){
                    this.matrix[i][j].display();
                }
            }
        }
        this.scene.popMatrix();
    }


}