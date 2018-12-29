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
        var emptyLine = [this.OUT_OF_BOUNDS,this.OUT_OF_BOUNDS,this.OUT_OF_BOUNDS,this.OUT_OF_BOUNDS,this.OUT_OF_BOUNDS,this.OUT_OF_BOUNDS,this.OUT_OF_BOUNDS]
        var sizeX = 3;
        var sizeZ = 3;

        let lineTop = emptyLine.slice();
        lineTop[3] = new Cell(this.scene, 1, 4,-1.5,-19.5, 1.5,-16.5)
        this.matrix.push(lineTop);

        lineTop = emptyLine.slice();
        lineTop[2] = new Cell(this.scene, 2, 3,-4.5,-16.5,-1.5,-13.5);
        lineTop[3] = new Cell(this.scene, 2, 4,-1.5,-16.5, 1.5,-13.5);
        lineTop[4] = new Cell(this.scene, 2, 5, 1.5,-16.5, 4.5,-13.5);
        this.matrix.push(lineTop);

        lineTop = emptyLine.slice();
        lineTop[1] = new Cell(this.scene, 3, 2,-7.5,-13.5,-4.5,-10.5);
        lineTop[2] = new Cell(this.scene, 3, 3,-4.5,-13.5,-1.5,-10.5);
        lineTop[3] = new Cell(this.scene, 3, 4,-1.5,-13.5, 1.5,-10.5);
        lineTop[4] = new Cell(this.scene, 3, 5, 1.5,-13.5, 4.5,-10.5);
        lineTop[5] = new Cell(this.scene, 3, 6, 4.5,-13.5, 7.5,-10.5);
        this.matrix.push(lineTop);

        let x1 = -10.5;
        let y1 = -10.5;

        for(var i = 4; i <= 10; i++){
            let line = [];

            for(var j = 1; j <= 7; j++){
                line.push(new Cell(this.scene, i, j, x1, y1, x1+sizeX, y1+sizeZ));
                x1 += sizeX;
            }
            this.matrix.push(line);
            x1 = -10.5;
            y1 += sizeZ;
        }

        lineTop = emptyLine.slice();
        lineTop[1] = new Cell(this.scene, 11, 2,-7.5, 10.5,-4.5, 13.5);
        lineTop[2] = new Cell(this.scene, 11, 3,-4.5, 10.5,-1.5, 13.5);
        lineTop[3] = new Cell(this.scene, 11, 4,-1.5, 10.5, 1.5, 13.5);
        lineTop[4] = new Cell(this.scene, 11, 5, 1.5, 10.5, 4.5, 13.5);
        lineTop[5] = new Cell(this.scene, 11, 6, 4.5, 10.5, 7.5, 13.5);
        this.matrix.push(lineTop);

        lineTop = emptyLine.slice();
        lineTop[2] = new Cell(this.scene, 12, 3,-4.5, 13.5,-1.5, 16.5);
        lineTop[3] = new Cell(this.scene, 12, 4,-1.5, 13.5, 1.5, 16.5);
        lineTop[4] = new Cell(this.scene, 12, 5, 1.5, 13.5, 4.5, 16.5);
        this.matrix.push(lineTop);

        lineTop = emptyLine.slice();
        lineTop[3] = new Cell(this.scene, 13, 4,-1.5, 16.5, 1.5, 19.5);
        this.matrix.push(lineTop);

        console.log(this.matrix);

        /*
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
        */

    }

    updateBoard() {
        var game = this.scene.graph.game;
        if(game.changedPiece == false)
            return;

        
        for(var i = 0; i < this.matrix.length; i++){
            for(var j = 0; j < this.matrix[i].length; j++){
                if(this.matrix[i][j] != this.OUT_OF_BOUNDS)
                    this.matrix[i][j].updateCell();
            }
        }
        
        
        game.changedPiece = false;
    }

    display() {
        var darkTilesMaterial = this.scene.graph.materials['dark tiles'];
        var whiteTilesMaterial = this.scene.graph.materials['light tiles'];

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,1,0,0);

        for(var i = 0 ; i < this.matrix.length ; i++){
            for(var j = 0; j < this.matrix[i].length ; j += 1){

                if((i%2==0 && j%2!=0) || (i%2!=0 && j%2==0))
                    whiteTilesMaterial.apply();
                else
                    darkTilesMaterial.apply();

                

                if(this.matrix[i][j] != this.OUT_OF_BOUNDS){
                    this.matrix[i][j].display();
                }
            }

        }

        this.scene.popMatrix();
    }


}