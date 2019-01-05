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

        this.game = this.scene.graph.game;

        //Types of movement possible
        this.types = {
            PLAIN : "plain move",
            CANTER : "canter move",
            JUMP : "jump move"
        }

        /*Captured piece, null if nothing captured */
        this.capturedPiece = null;

        /* Move type, can be CANTER, JUMP or PLAIN */
        this.moveType = null;
        this.stateBeforeMove = this.game.currentState;

        this.init();
    }

    /**
     * Executes this same movement
     */
    execute(){
        //Actually move it
        this.piece.move(this.destX,this.destY);

        //Add movement to movie if not playing movie
        if(!this.game.movieActive){
            this.game.movie.push(this);
        }        

        //If it has captured any piece, then move it and kill it in the game
        if(this.capturedPiece){
            this.capturedPiece.kill();
        }
        console.log(this.game.movie)
    }

    /**
     * Executes the reverse movement of this movement
     */
    executeReverse(){
        this.piece.move(this.fromX,this.fromY);

        if(this.capturedPiece){
            this.capturedPiece.revive();
        }

        this.game.movie.splice(this.game.movie.length-1,1);
        console.log(this.game.movie)
    }

    /**
     * Find out which type of move this is
     */
    init(){
        /* Computing decision variables */
        let deltaX = (this.fromX - this.destX);
        let deltaY = -(this.fromY - this.destY);
        let coordX = (this.fromX + this.destX)/2.0;
        let coordY = (this.fromY + this.destY)/2.0;

        /* Plain move */
        if(Math.abs(deltaX) == 3 || Math.abs(deltaY) == 3){
            this.moveType = this.types.PLAIN;
            return;
        }

        /* Canter or jump move */
        for(let i = 0 ; i < this.scene.graph.game.pieces.length; i++){
            let pieceTemp = this.scene.graph.game.pieces[i];
            if(pieceTemp.x == coordX && pieceTemp.y == coordY){
                /* Diferent colors */
                if(pieceTemp.color != this.piece.color){
                    this.moveType = this.types.JUMP;
                    this.capturedPiece = pieceTemp;
                }
                /* Same colors */
                else{
                    this.moveType = this.types.CANTER;
                }
            }
        }
    }
}