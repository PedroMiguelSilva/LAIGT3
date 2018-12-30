class Game {
    
    constructor(scene){
        this.scene = scene;

        //Piece geometric identifiers
        this.pieceGeoIdentMan = ["man"]
        this.pieceGeoIdentKnight = ["knight"]
        this.pieceGeoIdent_Index = 0;

        this.board = this.scene.graph.primitives['board'];
        this.timer = this.scene.graph.primitives['timer'];

        this.material = this.scene.graph.materials["dark tiles"];

        this.materialBlack = this.scene.graph.materials["dark tiles"];
        this.materialWhite = this.scene.graph.materials["light tiles"];

        //Create the pieces and set their initial positions
        this.pieces = [
            new Piece(this.scene,-6,-6,"Man","White"),
            new Piece(this.scene,-3,-6,"Man","White"),
            new Piece(this.scene, 0,-6,"Man","White"),
            new Piece(this.scene, 3,-6,"Man","White"),
            new Piece(this.scene, 6,-6,"Man","White"),
            new Piece(this.scene,-3,-9,"Knight","White"),
            new Piece(this.scene, 3,-9,"Knight","White"),
            new Piece(this.scene,-6,6,"Man","Black"),
            new Piece(this.scene,-3,6,"Man","Black"),
            new Piece(this.scene, 0,6,"Man","Black"),
            new Piece(this.scene, 3,6,"Man","Black"),
            new Piece(this.scene, 6,6,"Man","Black"),
            new Piece(this.scene,-3, 9,"Knight","Black"),
            new Piece(this.scene, 3, 9,"Knight","Black")
        ] // 7 first for white, 7 last for black, in order: MMMMMKKmmmmmkk

        /**
         * Possible States of the Game
         */
        this.state = {
            START : "Please select a game mode",

            PLAYER_1_SELECT_PIECE: "WHITE: Select a piece to move",
            PLAYER_1_MOVE: "WHITE: Select a destination for first move",
            PLAYER_1_CONTINUE_MOVE: "WHITE: Select a destination of move",

            PLAYER_2_SELECT_PIECE: "BLACK: Select a piece to move",
            PLAYER_2_MOVE: "BLACK: Select a destination for first move",
            PLAYER_2_CONTINUE_MOVE: "BLACK: Select a destination of move",

            END_GAME: "Game ended",
            QUIT_GAME: "Quit Game",
            MOVIE: "Showing game movie, please wait",
            CONNECTION_ERROR: "Error connecting with game engine"
        };

        this.movementState = {
            START : "No move",
            PLAIN : "Plain move",
            CANTER : "Canter move",
            JUMP : "Jump move",
            KNIGHTS_CHARGE : "Knights charge move"
        }

        this.currentMovementState = this.movementState.START;
        this.currentState = this.state.START;
        console.log("==============================");
        console.log(this.currentState);
        this.selectedPiece = null;

        /**
         * Possible Game Modes
         */
        this.game_mode = {
            PVP: "Player VS Player",
            PVBOT: "Player VS Bot",
            BOTVBOT: "Bot VS Bot"
        };

        /**
         * Dificulty of the Game
         */
        this.dificulty = {
            EASY: "Easy bot and lots of time",
            MEDIUM: "Hard bot and lots of time",
            HARD: "Hard bot and less time"
        }
        this.currentDificulty = this.dificulty.MEDIUM;

        this.whiteAlivePieces = [1,2,3,4,5,6,7];
        this.blackAlivePieces = [8,9,10,11,12,13,14];

        // Castle coordinates
        this.whiteCastle = new Object();
        this.whiteCastle.x = 0;
        this.whiteCastle.y = -18;
        this.blackCastle = new Object();
        this.blackCastle.x = 0;
        this.blackCastle.y = 18;

        this.validMoves = [];
    }

    /**
     * Updates the values of the game
     * @param {Variation of time between 2 updates} delta 
     */
    update(delta){ 

        for(var i = 0; i < this.pieces.length; i++){
            if(this.pieces[i].animation != undefined){
                this.pieces[i].animation.update(delta);
            }
        } 
    }

    /**
     * Displays the scene
     */
    display(){
        //for each piece, performe their animations and then display it
        this.defaultMaterial = new CGFappearance(this.scene);
        //Get the name of the component to be printed
        let nameOfMan = this.pieceGeoIdentMan[this.pieceGeoIdent_Index];

        // CHANGE 5 TO 7 ONCE THE KNIGHTS ARE DESINED AND WORKING
        for(var i = 0 ;  i < 5 ; i++ ){
            this.scene.pushMatrix();
            var anime = this.pieces[i].animation;
            if(anime != null){
                anime.apply();
            }
            //de acordo com a state machine, registar ou nao a peça para picking
            this.scene.registerForPick(i+1,this.scene.graph.components[nameOfMan]);
            this.scene.graph.components[nameOfMan].display(this.materialWhite,"teste",null,0);
        
            this.scene.popMatrix();
        }


        // CHANGE 5 TO 7 ONCE THE KNIGHTS ARE DESINED AND WORKING
        for(var i = 7 ;  i < 12 ; i++ ){
            this.scene.pushMatrix();
            var anime = this.pieces[i].animation;
            if(anime != null)
                anime.apply();
                
            //de acordo com a state machine, registar ou nao a peça para picking
            this.scene.registerForPick(i+1,this.scene.graph.components[nameOfMan]);
            this.scene.graph.components[nameOfMan].display(this.materialBlack,"teste",null,0);
        
            this.scene.popMatrix();
        }
        this.board.registerAllPieces();

        //for loop percorre dos man, e depois dos cavaleiros por causa da diferença das geometrias

        // animaçoes de houver

        // posiçao fixa se nao houver
    }

    restart(){
        for(var i = 0 ; i < this.pieces.length; i++){
            if(this.pieces[i] != 0)
            this.pieces[i].restart();
        }
        this.timer.restart();
    }

    /**
     * State machine that handles the state of the game
     */
    stateMachine(customId, piecePicked, comp){
        console.log("==============================");
        console.log(this.currentState);

        // Restart game
        if(customId == 102 && this.currentState != this.state.START){
            this.restart();
            this.currentState = this.state.START;
            return;
        }

        switch(this.currentState){
            case this.state.START:
                // Someone presse the start button
                if(customId == 102){
                    this.currentState = this.state.PLAYER_1_SELECT_PIECE;
                    this.timer.start();
                }
                break;
            case this.state.PLAYER_1_SELECT_PIECE:
                //Valid piece for selection
                if(this.whiteAlivePieces.includes(customId)){
                    //Select piece
                    this.selectedPiece = this.pieces[customId-1];
                    this.currentMovementState = this.movementState.START;
                    this.validMoves = this.getValidMoves(this.selectedPiece);
                    this.currentState = this.state.PLAYER_1_MOVE;
                }
                break;
            case this.state.PLAYER_1_MOVE:
                //Chose another white piece
                if(this.whiteAlivePieces.includes(customId)){
                    this.selectedPiece = this.pieces[customId-1];
                    this.currentMovementState = this.movementState.START;
                    this.validMoves = this.getValidMoves(this.selectedPiece);
                }
                //Chose destination tile
                else if(customId >= 15 && customId <= 81){
                    //Need to add logic here
                    if(this.isMoveInValidMoves(comp.x,comp.y)){
                       this.selectedPiece.move(comp.x,comp.y);
                       this.currentState = this.state.PLAYER_1_CONTINUE_MOVE;
                    }
                    //Check for game over
                    if(this.isGameOver()){
                        this.currentState = this.state.END_GAME;
                        return;
                    }                    
                }
                break;
            case this.state.PLAYER_1_CONTINUE_MOVE:
                //If white player presses button
                if(customId == 101){
                    this.currentState = this.state.PLAYER_2_SELECT_PIECE;
                    this.timer.changePlayer();
                }
                if(customId >= 15 && customId <= 81){
                    this.validMoves = this.getValidMoves(this.selectedPiece);
                    if(this.isMoveInValidMoves(comp.x,comp.y)){
                        this.selectedPiece.move(comp.x,comp.y);
                        this.currentState = this.state.PLAYER_1_CONTINUE_MOVE;
                     }
                }
                break;
            case this.state.PLAYER_2_SELECT_PIECE:
                //Valid piece for selection
                if(this.blackAlivePieces.includes(customId)){
                    //Select piece
                    this.selectedPiece = this.pieces[customId-1];
                    this.currentMovementState = this.movementState.START;
                    this.validMoves = this.getValidMoves(this.selectedPiece);
                    //Update Game state
                    this.currentState = this.state.PLAYER_2_MOVE;
                }
                break;
            case this.state.PLAYER_2_MOVE:
                //Chose another black piece
                if(this.blackAlivePieces.includes(customId)){
                    this.selectedPiece = this.pieces[customId-1];
                    this.validMoves = this.getValidMoves(this.selectedPiece);
                    this.currentMovementState = this.movementState.START;
                }
                //Chose destination tile
                else if(customId >= 15 && customId <= 81){

                    //Need to add logic here
                    if(this.isMoveInValidMoves(comp.x,comp.y)){
                        this.selectedPiece.move(comp.x,comp.y);
                        this.currentState = this.state.PLAYER_2_CONTINUE_MOVE;
                     }

                    //Check for game over
                    if(this.isGameOver()){
                        this.currentState = this.state.END_GAME;
                        return;
                    }
                }
                break;
            case this.state.PLAYER_2_CONTINUE_MOVE:
                if(customId == 100){
                    this.currentState = this.state.PLAYER_1_SELECT_PIECE;
                    this.timer.changePlayer();
                }
                if(customId >= 15 && customId <= 81){
                    this.validMoves = this.getValidMoves(this.selectedPiece);
                    if(this.isMoveInValidMoves(comp.x,comp.y)){
                        this.selectedPiece.move(comp.x,comp.y);
                        this.currentState = this.state.PLAYER_2_CONTINUE_MOVE;
                     }
                }
                break;
            case this.state.END_GAME:
                console.log("end of game")
                break;
            case this.state.QUIT_GAME:
                break;
            case this.state.MOVIE:
                break;
            case this.state.CONNECTION_ERROR:
                break;
            default:
                break;
        }

        
    }//end of state machine

    isMoveInValidMoves(x,y){
        for(let i = 0 ; i < this.validMoves.length; i++){
            let move = this.validMoves[i];
            if(move.destX == x && move.destY == y){
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if the game is over
     * @returns true if game over, false otherwise
     */
    isGameOver(){
        
        //White has no pieces alive
        if(this.whiteAlivePieces.length === 0){
            return true;
        }

        //Black has no pieces alive
        if(this.blackAlivePieces.length === 0){
            return true;
        }

        //White conquered Black castle
        for(var i = 0 ; i < this.whiteAlivePieces.length; i++){
            var piece = this.pieces[this.whiteAlivePieces[i]-1];
            if(piece.x === this.blackCastle.x && piece.y === this.blackCastle.y){
                return true;
            }
        }

        //Black conquered White castle
        for(var i = 0 ; i < this.blackAlivePieces.length; i++){
            var piece = this.pieces[this.blackAlivePieces[i]-1];
            if(piece.x === this.whiteCastle.x && piece.y === this.whiteCastle.y){
                return true;
            }
        }
        
        return false;
    }

    //Only checks for 4 possible orientations for now
    getValidMoves(movingPiece){
        var results = [];
        let upX = movingPiece.x + 3;
        let upY = movingPiece.y;
        let pieceUp = this.getPiece(upX,upY);
        if(pieceUp){
            upX += 3;
            pieceUp = this.getPiece(upX,upY);
        }
        //If it doesn't exist any piece, then we can create a move
        if(!pieceUp){
            let move = new Move(this.scene, movingPiece, upX,upY);
            results.push(move);
        }

        let downX = movingPiece.x - 3;
        let downY = movingPiece.y;
        let pieceDown = this.getPiece(downX,downY);
        if(pieceDown){
            downX -= 3;
            pieceDown = this.getPiece(downX,downY);
        }
        //If it doesn't exist any piece, then we can create a move
        if(!pieceDown){
            let move = new Move(this.scene, movingPiece, downX,downY);
            results.push(move);
        }
        
        let rightX = movingPiece.x;
        let rightY = movingPiece.y + 3;
        let pieceRight = this.getPiece(rightX,rightY);
        if(pieceRight){
            rightY += 3;
            pieceRight = this.getPiece(rightX,rightY);
        }
        //If it doesn't exist any piece, then we can create a move
        if(!pieceRight){
            let move = new Move(this.scene, movingPiece, rightX,rightY);
            results.push(move);
        }

        let leftX = movingPiece.x;
        let leftY = movingPiece.y - 3;
        let pieceLeft = this.getPiece(leftX,leftY);
        if(pieceLeft){
            leftY -= 3;
            pieceLeft = this.getPiece(leftX,leftY);
        }
        //If it doesn't exist any piece, then we can create a move
        if(!pieceLeft){
            let move = new Move(this.scene, movingPiece, leftX,leftY);
            results.push(move);
        }

        return results;
    }


    getPiece(x,y){
        for(let i = 0 ; i < this.pieces.length; i++){
            let tempPiece = this.pieces[i];
            if(tempPiece.x == x && tempPiece.y == y){
                return tempPiece;
            }
        }
        return null;
    }
}