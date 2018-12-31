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
            JUMP : "jump move"
        }

        //Id of captured piece, null if nothing captured
        this.capturedPiece = null;
        //Move type, can be CANTER, JUMP or PLAIN
        this.moveType = null;

        this.init();
    }

    /**
     * Executes this same movement
     */
    execute(){
        console.log(this)
        //Actually move it
        this.piece.move(this.destX,this.destY);

        //If it has captured any piece, then move it and kill it in the game
        if(this.capturedPiece){
            this.capturedPiece.move(100,100);
            this.capturedPiece.kill();
        }
    }

    /**
     * Executes the reverse movement of this movement
     */
    executeReverse(){

    }

    init(){
        //Check for a plain move
        let deltaX = (this.fromX - this.destX);
        let deltaY = -(this.fromY - this.destY);
        if(Math.abs(deltaX) == 3 || Math.abs(deltaY) == 3){
            this.moveType = this.types.PLAIN;
            return;
        }
        
        //Check coordinates of the middle tile
        let coordX = this.fromX + deltaX/2.0;
        let coordY = this.fromY + deltaY/2.0;
        
        for(let i = 0 ; i < this.scene.graph.game.pieces.length; i++){
            let pieceTemp = this.scene.graph.game.pieces[i];
            //console.log("Coordinate: " + pieceTemp.x + " " + pieceTemp.y);
            //Found piece
            
            if(pieceTemp.x == coordX && pieceTemp.y == coordY){
                if(pieceTemp.color != this.piece.color){
                    this.moveType = this.types.JUMP;
                    this.capturedPiece = pieceTemp;
                }else{
                    this.moveType = this.types.CANTER;
                }
            }
        }
    }
}