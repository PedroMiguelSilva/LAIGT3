/**
 * Cell
 * @constructor
 */
class Cell {

    constructor(scene, x1, y1, x2, y2, pickingId) {

        this.scene = scene;

        this.active = false;

        this.x = x1 + 1.5;
        this.y = -(y1 + 1.5);

        this.pickingId = pickingId;

        this.rectangle = new MyRectangle(this.scene, x1, y1, x2, y2);
        this.activeMaterial = this.scene.graph.materials['red'];
    }
/*
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
*/

    /**
     * 
     
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
    }*/

    activate(){
        this.active = true;
    }

    deactivate(){
        this.active = false;
    }

    display(currentMaterial) {
        if(this.active){
            this.activeMaterial.apply();
        }

        this.scene.pushMatrix();
            this.rectangle.display();
        this.scene.popMatrix();

        this.scene.graph.materials[currentMaterial].apply();
    }
   


}