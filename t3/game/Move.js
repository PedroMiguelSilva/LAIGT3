/**
 * Describes the movement of a piece and its consequences
 */
class Move {
    
    /**
     * @param {Scene} scene 
     * @param {piece of movement} piece 
     * @param {X of end of movement} x2 
     * @param {Y of end of movement} y2 
     */
    constructor(scene,piece,x2,y2){
        this.scene = scene;
        this.piece = piece;
        this.fromX = piece.x;
        this.fromY = piece.y;
        this.destX = x2;
        this.destY = y2;

        //Types of movement possible
        this.types = {
            PLAIN : "plain move",
            CANTER : "canter move",
            PLAIN : "plain move"
        }

        //Id of captured piece, null if nothing captured
        this.capturedPiece = null;
        //Move type, can be CANTER, JUMP or PLAIN
        this.moveType = null;

        this.init();
    }

    init(){
        //Check for a plain move
        let deltaX = (this.fromX - this.destX);
        let deltaY = (this.fromY - this.destY);
        if(Math.abs(deltaX) == 3 && Math.abs(deltaY) == 3){
            this.moveType = this.types.PLAIN;
            return;
        }

        //Check coordinates of the middle tile
        let coordX = this.fromX + deltaX;
        let coordY = this.fromY + deltaY;
        for(let i = 0 ; i < this.scene.graph.game.pieces.length; i++){
            let pieceTemp = this.scene.graph.game.pieces[i];
            //Found piece
            if(pieceTemp.x == coordX && pieceTemp.y == coordY){
                
                if(pieceTemp.type != this.piece.type){
                    this.moveType = this.types.JUMP;
                    this.capturedPiece = pieceTemp;
                }else{
                    this.moveType = this.types.CANTER;
                }
            }
        }
    }
}