class Game {
    
    constructor(scene){
        this.scene = scene;

        //Piece geometric identifiers
        this.pieceGeoIdentMan = ["man"]
        this.pieceGeoIdentKnight = ["knight"]
        this.pieceGeoIdent_Index = 0;

        this.board = this.scene.graph.primitives['board'];

        this.material = this.scene.graph.materials["dark tiles"];

        this.materialBlack = this.scene.graph.materials["dark tiles"];
        this.materialWhite = this.scene.graph.materials["light tiles"];

        //Create the pieces and set their initial positions
        this.pieces = [
            new Man(this.scene,-6,-6,"White"),
            new Man(this.scene,-3,-6,"White"),
            new Man(this.scene, 0,-6,"White"),
            new Man(this.scene, 3,-6,"White"),
            new Man(this.scene, 6,-6,"White"),
            0,
            0,
            new Man(this.scene,-6,6,"Black"),
            new Man(this.scene,-3,6,"Black"),
            new Man(this.scene, 0,6,"Black"),
            new Man(this.scene, 3,6,"Black"),
            new Man(this.scene, 6,6,"Black"),
            0,
            0
        ] // 7 first for white, 7 last for black, in order: MMMMMKKmmmmmkk

        /**
         * Possible States of the Game
         */
        this.state = {
            START : "Please select a game mode",
            PLAYER_1_SELECT_PIECE: "WHITE: Select a piece to move",
            PLAYER_1_MOVE_PIECE_CANTER: "WHITE: Select a destination of move",
            PLAYER_1_MOVE: "WHITE: Select a destination of move",
            PLAYER_2_SELECT_PIECE: "BLACK: Select a piece to move",
            PLAYER_2_MOVE: "BLACK: Select a destination of move",
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
        this.currentState = this.state.PLAYER_1_SELECT_PIECE;
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

        this.whiteAlivePieces = [1,2,3,4,5,6,7];
        this.blackAlivePieces = [8,9,10,11,12,13,14];

        // Castle coordinates
        this.whiteCastle = new Object();
        this.whiteCastle.x = 0;
        this.whiteCastle.y = -18;
        this.blackCastle = new Object();
        this.blackCastle.x = 0;
        this.blackCastle.y = 18;
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

    /**
     * State machine that handles the state of the game
     */
    stateMachine(customId, piecePicked, comp){
        console.log("==============================");
        console.log(this.currentState);

        var validMoves = [];

        switch(this.currentState){
            case this.state.START:
                break;
            case this.state.PLAYER_1_SELECT_PIECE:
                //Valid piece for selection
                if(this.whiteAlivePieces.includes(customId)){
                    //Select piece
                    this.selectedPiece = this.pieces[customId-1];
                    this.currentMovementState = this.movementState.START;
                    validMoves = this.getValidMoves(piecePicked);
                    console.log(validMoves)
                    //Update Game state
                    this.currentState = this.state.PLAYER_1_MOVE;
                }
                break;
            case this.state.PLAYER_1_MOVE:
                //Chose another white piece
                if(this.whiteAlivePieces.includes(customId)){
                    this.selectedPiece = this.pieces[customId-1];
                    this.currentMovementState = this.movementState.START;
                    validMoves = this.getValidMoves(piecePicked);
                    console.log(validMoves)
                }
                //Chose destination tile
                else if(customId >= 15 && customId <= 81){
                    //Need to add logic here
                    this.selectedPiece.move(comp.x,comp.y);
                    //Check for game over
                    if(this.isGameOver()){
                        this.currentState = this.state.END_GAME;
                        return;
                    }
                    //Some more logic to check if it has stoped playing or not 
                    this.currentState = this.state.PLAYER_2_SELECT_PIECE;
                }
                break;
            case this.state.PLAYER_2_SELECT_PIECE:
                //Valid piece for selection
                if(this.blackAlivePieces.includes(customId)){
                    //Select piece
                    this.selectedPiece = this.pieces[customId-1];
                    this.currentMovementState = this.movementState.START;
                    validMoves = this.getValidMoves(piecePicked);
                    console.log(validMoves)
                    //Update Game state
                    this.currentState = this.state.PLAYER_2_MOVE;
                }
                break;
            case this.state.PLAYER_2_MOVE:
                //Chose another black piece
                if(this.blackAlivePieces.includes(customId)){
                    this.selectedPiece = this.pieces[customId-1];
                    validMoves = this.getValidMoves(piecePicked);
                    console.log(validMoves)
                    this.currentMovementState = this.movementState.START;
                }
                //Chose destination tile
                else if(customId >= 15 && customId <= 81){
                    validMoves = this.getValidMoves(piecePicked);
                    console.log(validMoves)
                    //Need to add logic here
                    this.selectedPiece.move(comp.x,comp.y);
                    //Check for game over
                    if(this.isGameOver()){
                        this.currentState = this.state.END_GAME;
                        return;
                    }
                        
                    //Some more logic to check if it has stoped playing or not 
                    this.currentState = this.state.PLAYER_1_SELECT_PIECE;
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