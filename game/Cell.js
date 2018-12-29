/**
 * Cell
 * @constructor
 */
class Cell extends CGFobject {

    constructor(scene, row, column, x1, y1, x2, y2) {

        super(scene);
        this.scene = scene;

        this.active = false;
        this.updated = false;

        this.row = row;
        this.column = column;

        this.x = x1 + 1.5;
        this.z = -(y1 + 1.5);

        this.rectangle = new MyRectangle(this.scene, x1, y1, x2, y2);
    }


    updateCell() {
        var game = this.scene.graph.game;
        
        this.validPosition();
    }

    validPosition() {

        var game = this.scene.graph.game;
       
        if(game.selectedPiece == null || game.selectedPiece == undefined)
            return;

        var board = game.boardToProlog(game.board);
        var player ="white";
        var pieceRow = game.selectedPiece.getRow();
        var pieceCol = game.selectedPiece.getColumn();
        var moveRow = this.row;
        var moveCol = this.column;

        console.log('pieceRow: ' + pieceRow);
        console.log('pieceCol: ' + pieceCol);
        console.log('moveRow: ' + moveRow);
        console.log('moveCol: ' + moveCol);

        this.validFirstPosition(board, player, pieceRow, pieceCol, moveRow, moveCol);
    }

    /**
     * 
     */
    validFirstPosition(board, player, pieceRow, pieceCol, moveRow, moveCol) {
        var this_cell = this;
    
        var command = "valid_first_position(" + board + "," + player + "," + pieceRow + "," + pieceCol + "," + moveRow + "," + moveCol + ")";

        this.scene.client.getPrologRequest(command,
            function(data){
                if(data.target.response == "0")
                    this_cell.active = false;
                else
                    this_cell.active = true;
            },
            function(data){
                console.log("Connection error: validFirstPosition");
            }
        );
    }


    /**
     * 
     */
    display() {
        this.activeMaterial = this.scene.graph.materials['possible_move'];

        this.scene.registerForPick(10*this.row + this.column,this);
        
        this.scene.pushMatrix();
        if(this.active)
            this.activeMaterial.apply();

        this.rectangle.display();
        this.scene.popMatrix();
    }
   


}