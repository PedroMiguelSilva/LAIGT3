class Game {
    
    constructor(scene){
        this.scene = scene;

        //Piece geometric identifiers
        this.pieceGeoIdentMan = ["man"]
        this.pieceGeoIdentKnight = ["horse"]
        this.pieceGeoIdent_Index = 0;

        this.board = this.scene.graph.primitives['board'];
        this.timer = this.scene.graph.primitives['timer'];

        this.material = this.scene.graph.materials["dark tiles"];

        this.materialBlack = this.scene.graph.materials["dark tiles"];
        this.materialWhite = this.scene.graph.materials["light tiles"];

        //Create the pieces and set their initial positions
        this.pieces = [
            new Piece(this.scene,-6,-6,"Man","White",1),
            new Piece(this.scene,-3,-6,"Man","White",2),
            new Piece(this.scene, 0,-6,"Man","White",3),
            new Piece(this.scene, 3,-6,"Man","White",4),
            new Piece(this.scene, 6,-6,"Man","White",5),
            new Piece(this.scene,-3,-9,"Knight","White",6),
            new Piece(this.scene, 3,-9,"Knight","White",7),
            new Piece(this.scene,-6,6,"Man","Black",8),
            new Piece(this.scene,-3,6,"Man","Black",9),
            new Piece(this.scene, 0,6,"Man","Black",10),
            new Piece(this.scene, 3,6,"Man","Black",11),
            new Piece(this.scene, 6,6,"Man","Black",12),
            new Piece(this.scene,-3, 9,"Knight","Black",13),
            new Piece(this.scene, 3, 9,"Knight","Black",14)
        ] // 7 first for white, 7 last for black, in order: MMMMMKKmmmmmkk

        /**
         * Possible States of the Game
         */
        this.state = {
            START : "Please select a game mode",

            /**
             * HUMAN
             */
            PLAYER_1_SELECT_PIECE: "WHITE: Select a piece to move",
            PLAYER_1_MOVE: "WHITE: Select a destination for first move",
            PLAYER_1_CONTINUE_MOVE: "WHITE: Select a destination of move",
            PLAYER_1_WASTING_TIME: "WHITE: Click the button !",

            PLAYER_2_SELECT_PIECE: "BLACK: Select a piece to move",
            PLAYER_2_MOVE: "BLACK: Select a destination for first move",
            PLAYER_2_CONTINUE_MOVE: "BLACK: Select a destination of move",
            PLAYER_2_WASTING_TIME: "BLACK: Click the button !",

            /**
             * BOT
             */
            BOT_1_TURN: "WHITE: Bot turn",
            BOT_2_TURN: "BLACK: Bot turn",
            BOT_1_WAIT_RESPONSE: "WHITE: Bot choosing move",
            BOT_2_WAIT_RESPONSE: "BLACK: Bot choosing move",
            BOT_1_PLAYING: "WHITE: Bot playing",
            BOT_2_PLAYING: "BLACK: Bot playing",
            BOT_1_WAIT_EXIT: "WHITE: Exiting game",
            BOT_2_WAIT_EXIT: "BLACK: Exiting game",
            BOTVBOT_EXIT: "Exiting game",

            /**
             * GAME
             */
            WHITE_WON : "White player won",
            BLACK_WON : "Black player won",
            QUIT_GAME: "Quit Game",
            MOVIE: "Showing game movie, please wait"
        };

        this.movementState = {
            START : "no move",
            PLAIN : "plain move",
            CANTER : "canter move",
            JUMP : "jump move",
            KNIGHTS_CHARGE : "charge move"
        }

        this.currentMovementState = this.movementState.START;
        this.currentState = this.state.START;   
        this.selectedPiece = null;

        /**
         * Possible Game Modes
         */
        this.game_mode = {
            PVP: "Human vs Human",
            PVBOT: "Human vs Bot",
            BOTVBOT: "Bot vs Bot"
        };

        this.mode = this.game_mode.PVP;
        this.dificulty = "Easy";
        this.speed = 5;

        this.whiteAlivePieces = [1,2,3,4,5,6,7];
        this.blackAlivePieces = [8,9,10,11,12,13,14];
        // Each piece must regist themselves in this list when moving and remove themselves when their movement ends
        this.isAnyPieceMoving = false;

        // Castle coordinates
        this.whiteCastle = new Object();
        this.whiteCastle.x = 0;
        this.whiteCastle.y = -18;
        this.blackCastle = new Object();
        this.blackCastle.x = 0;
        this.blackCastle.y = 18;

        this.validMoves = [];
        
        /* Movie of the game - Array of objects of 'Move' which contain the information to create each move of the movie */
        this.movie = []
        this.movieActive = false;
        this.movieCounter = 0;

        /* Message that is going to be printed */
        this.blackScore = 0;
        this.whiteScore = 0;
        this.resultString = "";
        this.updateResultString();
        

        /**
         * Bot: using prolog
         */
        this.bot1 = new Bot(this.scene, "white");
        this.bot2 = new Bot(this.scene, "black");
    }

    updateResultString(){
        this.resultString = "WHITE " + this.whiteScore + " - " + this.blackScore + " BLACK";
    }

    /**
     * Undos the last play of the last few plays according to the state of the game and who called it
     */
    undo(){
        //If there was no move yet, do nothing
        if(this.movie.length == 0){
            return;
        }
        
        let player = this.currentState.substring(0,5).toLowerCase();
        let lastPlayerToMove = this.movie[this.movie.length-1].piece.color.toLowerCase();
        //console.log(this.movie[this.movie.length-1])
        //console.log("currnt player " + player + " and last played was " + lastPlayerToMove)
        if(player == lastPlayerToMove){
            this.reverseLastPlay();
        }
        else{
            this.reverseLastRound();
        }
    }

    /**
     * Plays the last move in reverse order and deletes it from the movie
     */
    reverseLastPlay(){
        let move = this.movie[this.movie.length-1];
        move.executeReverse();
        this.currentState = move.stateBeforeMove;
    }

    /**
     * Plays the last moves that constitue a round in reverse order
     */
    reverseLastRound(){
        // Check if its a 'White' player or 'Black'
        let firstPlayer = this.movie[this.movie.length-1].piece.color;
        let currentPlayer = firstPlayer;

        //While still in the opponent round
        while(firstPlayer == currentPlayer){
            //Undo play
            this.reverseLastPlay();

            //Update variables
            if(this.movie.length > 0){
                currentPlayer = this.movie[this.movie.length-1].piece.color;
            }
        }

        //If there is still a move left, reverse it, this allows the player that called the undo to play in the end of his/her turn
        if(this.movie.length > 0){
            this.reverseOneMorePlay = true;
        }
        
    }

    /**
     * Updates the values of the game
     * @param {Variation of time between 2 updates} delta 
     */
    update(delta){
        
        this.isAnyPieceMoving = false ;
        for(var i = 0; i < this.pieces.length; i++){
            if(this.pieces[i].animationController != undefined){
                var animationDone = this.pieces[i].animationController.update(delta);
                if(animationDone != -1){
                    this.isAnyPieceMoving = true;
                }

                //Update bots
                if(this.pieces[i] == this.selectedPiece){
                    this.bot1.updateState(animationDone);
                    this.bot2.updateState(animationDone);
                }
            }
        }

        this.timer.update(delta);

        //Update BOT vs BOR or HUMAN vs BOT machine 
        if(this.mode == this.game_mode.BOTVBOT || this.mode == this.game_mode.PVBOT)
            this.stateMachineBot(null);

            
        if(!this.isAnyPieceMoving && this.movieActive){
            this.nextMoveOnMovie();
        }

        if(!this.isAnyPieceMoving && this.reverseOneMorePlay){
            this.reverseLastPlay();
            this.reverseOneMorePlay = false;
        }
    }

    nextMoveOnMovie(){
        console.log(this.movie)
        this.movie[this.movieCounter].execute();
        this.movieCounter++;
        if(this.movieCounter == this.movie.length){
            console.log("End of video");
            this.movieActive = false;
        }
    }

    /**
     * Plays the movie, from start, stored in 'this.movie'
     */
    playMovie(){
        this.restartPieces();
        this.restartTimer();
        this.movieActive = true;

        
    }

   
    /**
     * Displays the scene
     */
    display(){
        //for each piece, performe their animations and then display it
        this.defaultMaterial = new CGFappearance(this.scene);
        //Get the name of the component to be printed
        let nameOfMan = this.pieceGeoIdentMan[this.pieceGeoIdent_Index];
        let nameOfKnight = this.pieceGeoIdentKnight[this.pieceGeoIdent_Index];

        // CHANGE 5 TO 7 ONCE THE KNIGHTS ARE DESINED AND WORKING
        for(var i = 0 ;  i < 5 ; i++ ){
            this.scene.pushMatrix();
            var anime = this.pieces[i].animationController;
            if(anime != null){
                anime.apply();
            }
            //de acordo com a state machine, registar ou nao a peça para picking
            this.scene.registerForPick(i+1,this.scene.graph.components[nameOfMan]);
            this.scene.graph.components[nameOfMan].display(this.materialWhite,null,null,0);
        
            this.scene.popMatrix();
        }
        for(var i = 5 ; i < 7; i++ ){
            this.scene.pushMatrix();
            var anime = this.pieces[i].animationController;
            if(anime!=null){
                anime.apply();
            }
            this.scene.registerForPick(i+1,this.scene.graph.components[nameOfKnight]);
            this.scene.graph.components[nameOfKnight].display(this.materialWhite,null,null,0);
        
            this.scene.popMatrix();
        }


        // CHANGE 5 TO 7 ONCE THE KNIGHTS ARE DESINED AND WORKING
        for(var i = 7 ;  i < 12 ; i++ ){
            this.scene.pushMatrix();
            var anime = this.pieces[i].animationController;
            if(anime != null)
                anime.apply();
                
            //de acordo com a state machine, registar ou nao a peça para picking
            this.scene.registerForPick(i+1,this.scene.graph.components[nameOfMan]);
            this.scene.graph.components[nameOfMan].display(this.materialBlack,null,null,0);
        
            this.scene.popMatrix();
        }

        for(var i = 12 ; i < 14; i++ ){
            this.scene.pushMatrix();
            var anime = this.pieces[i].animationController;
            if(anime!=null){
                anime.apply();
            }
            this.scene.registerForPick(i+1,this.scene.graph.components[nameOfKnight]);
            this.scene.graph.components[nameOfKnight].display(this.materialBlack,null,null,0);
        
            this.scene.popMatrix();
        }

        this.board.registerAllPieces();

        //for loop percorre dos man, e depois dos cavaleiros por causa da diferença das geometrias

        // animaçoes de houver

        // posiçao fixa se nao houver
    }

    restart(){
        console.log("chamou restart")
        console.log(this)
        this.restartPieces();
        this.restartTimer();
        this.restartMovieVariables();
    }

    restartPieces(){
        for(var i = 0 ; i < this.pieces.length; i++){
            if(this.pieces[i] != 0)
            this.pieces[i].restart();
        }
        
        this.whiteAlivePieces = [1,2,3,4,5,6,7];
        this.blackAlivePieces = [8,9,10,11,12,13,14];
    }

    restartTimer(){
        this.timer.restart();
    }

    restartMovieVariables(){
        //Movie variables
        this.movie = [];
        this.movieCounter = 0;
        this.movieActive = false;
    }

    /**
     * Uses game logic to filter the valid moves from the possible ones
     */
    filterMovesByGameLogic(validMoves){
        var result = [];
        //console.log("valid moves" + validMoves)
        
        var previousState = this.currentMovementState;
        //console.log("previous state :" + previousState)
        for(var i = 0 ; i < validMoves.length; i++){
            //for each move, check if it can be done based on type and previous type done
            let type = validMoves[i].moveType;
            //console.log("type of move:" + type)
            //console.log("Chegou aqui no " + i)
            if(previousState == "no move"){
                result.push(validMoves[i]);
                continue;
            }
            
            // Plain moves cannot be done in second round
            if(type == "plain move"){
                continue;
            }

            if(type == "canter move"){
                if(previousState == "canter move"){
                    result.push(validMoves[i]);
                }
            }

            if(type == "jump move"){
                if(previousState == "jump move"){
                    result.push(validMoves[i]);
                }
                if(previousState == "canter move" && this.selectedPiece.type == "Knight"){
                    result.push(validMoves[i]);
                    this.currentMovementState = "jump move";
                }
            }
        }
        //console.log(result)
        return result;
    }

    /**
     * 
     */
    stateMachine(customID, piecePicked, comp){

        if(this.mode == this.game_mode.PVP)
            this.stateMachinePlayer(customID, piecePicked, comp);

        if(this.mode == this.game_mode.BOTVBOT)
            this.stateMachineBot(customID);

        if(this.mode == this.game_mode.PVBOT){
            this.stateMachinePlayer(customID, piecePicked, comp);
            this.stateMachineBot(customID);
        }
    }

    /**
     * State machine that handles the state of the game
     */
    stateMachinePlayer(customId, piecePicked, comp){
        //this.bot1.botPlay([4,3],[[6,'Canter',3],[4,'Canter',3]]);
        //this.bot1.botTurn();

        // Restart game
        if(customId == 102 && this.currentState != this.state.START){
            console.log(this.pieces)
            this.restart();
            console.log(this.pieces)
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
                    this.board.highlightTiles(this.validMoves);
                    this.currentState = this.state.PLAYER_1_MOVE;
                }
                break;
            case this.state.PLAYER_1_MOVE:
                /* Chose another white piece */
                if(this.whiteAlivePieces.includes(customId)){
                    this.selectedPiece = this.pieces[customId-1];
                    this.currentMovementState = this.movementState.START;
                    this.validMoves = this.getValidMoves(this.selectedPiece);
                    this.board.highlightTiles(this.validMoves);
                }
                /* Chose destination tile */
                else if(customId >= 15 && customId <= 81){
                    let move = this.isMoveInValidMoves(comp.x,comp.y);
                    //console.log(move)
                    if(move){
                        move.execute();
                        /* Check for game over */
                        if(this.isGameOver()){
                            this.board.deactivateTiles();
                            //this.currentState = this.state.END_GAME;
                            return;
                        }

                        //this.movie.push(move);
                        this.board.deactivateTiles();
                        /* If it makes a plain move then don't allow to move again */
                        if(move.moveType == "plain move"){
                           this.currentState = this.state.PLAYER_1_WASTING_TIME;
                           break;
                        }
                        
                        /* Can make any other move as long as its the same one */
                        this.currentState = this.state.PLAYER_1_CONTINUE_MOVE;
                        this.currentMovementState = move.moveType;
                    }                   
                }
                break;
            case this.state.PLAYER_1_CONTINUE_MOVE:
                /* Red button is pressed */
                if(customId == 101){
                    this.timer.changePlayer();
                    if(this.mode == this.game_mode.PVP){
                        this.currentState = this.state.PLAYER_2_SELECT_PIECE;
                        this.currentMovementState = this.movementState.START;
                        this.board.deactivateTiles();
                    }
                    else{
                        this.currentState = this.state.BOT_2_TURN;
                        return;
                    }
                    
                }
                /* A tile of the board is pressed */
                if(customId >= 15 && customId <= 81){
                    this.validMoves = this.getValidMoves(this.selectedPiece);
                    this.board.highlightTiles(this.validMoves);
                    let move = this.isMoveInValidMoves(comp.x,comp.y)
                    
                    if(move){
                        move.execute();
                        /* Check for game over */
                        if(this.isGameOver()){
                            this.board.deactivateTiles();
                            //this.currentState = this.state.END_GAME;
                            return;
                        } 
                        //this.movie.push(move);
                        this.board.deactivateTiles();
                        this.currentMovementState = move.moveType;
                    }
                }
                break;
            case this.state.PLAYER_2_SELECT_PIECE:
                //Valid piece for selection
                if(this.blackAlivePieces.includes(customId)){
                    //Select piece
                    this.selectedPiece = this.pieces[customId-1];
                    this.currentMovementState = this.movementState.START;
                    this.validMoves = this.getValidMoves(this.selectedPiece)
                    this.board.highlightTiles(this.validMoves);
                    this.currentState = this.state.PLAYER_2_MOVE;
                }
                break;
            case this.state.PLAYER_2_MOVE:
                //Chose another black piece
                if(this.blackAlivePieces.includes(customId)){
                    this.selectedPiece = this.pieces[customId-1];
                    this.validMoves = this.getValidMoves(this.selectedPiece);
                    this.board.highlightTiles(this.validMoves);
                    this.currentMovementState = this.movementState.START;
                }
                //Chose destination tile
                else if(customId >= 15 && customId <= 81){
                    let move = this.isMoveInValidMoves(comp.x,comp.y)
                    if(move){
                        move.execute();
                        /* Check for game over */
                        if(this.isGameOver()){
                            //this.currentState = this.state.END_GAME;
                            this.board.deactivateTiles();
                            return;
                        } 

                        //this.movie.push(move);
                        this.board.deactivateTiles();
                        /* If it makes a plain move then don't allow to move again */
                        if(move.moveType == "plain move"){
                            this.currentState = this.state.PLAYER_2_WASTING_TIME;
                            break;
                        }

                        /* Can make any other move as long as its the same one */
                        this.currentState = this.state.PLAYER_2_CONTINUE_MOVE;
                        this.currentMovementState = move.moveType;
                     }
                }
                break;
            case this.state.PLAYER_2_CONTINUE_MOVE:
                /* Red button is pressed */
                if(customId == 100){
                    this.currentState = this.state.PLAYER_1_SELECT_PIECE;
                    this.timer.changePlayer();
                    this.currentMovementState = this.movementState.START;
                    this.board.deactivateTiles();
                }
                /* A tile is pressed */
                if(customId >= 15 && customId <= 81){
                    this.validMoves = this.getValidMoves(this.selectedPiece);

                    this.board.highlightTiles(this.validMoves);
                    let move = this.isMoveInValidMoves(comp.x,comp.y);
                    if(move){
                        move.execute();
                        /* Check for game over */
                        if(this.isGameOver()){
                            //this.currentState = this.state.END_GAME;~
                            this.board.deactivateTiles();
                            return;
                        } 
                        //this.movie.push(move);
                        this.board.deactivateTiles();
                        this.currentMovementState = move.moveType;
                    }
                }
                break;
            case this.state.PLAYER_1_WASTING_TIME:
                if(customId == 101){
                    this.timer.changePlayer();
                    if(this.mode == this.game_mode.PVP){
                        this.currentState = this.state.PLAYER_2_SELECT_PIECE;
                        this.currentMovementState = this.movementState.START;
                    }
                    else{
                        this.currentState = this.state.BOT_2_TURN;
                    }
                }
                break;
            case this.state.PLAYER_2_WASTING_TIME:
                if(customId == 100){
                    this.timer.changePlayer();
                    this.currentState = this.state.PLAYER_1_SELECT_PIECE;
                    this.currentMovementState = this.movementState.START;
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
     *  State machine to BOT turns
     */
    stateMachineBot(customID) {
        //console.log("BOT1 STATE: " + this.bot1.currentState);
        //console.log("GAME STATE: " + this.currentState);
    
            if(this.isGameOver()){
                this.board.deactivateTiles();
                //this.currentState = this.state.END_GAME;
                return;
            }
    
            switch(this.currentState){
                case this.state.START:
                    if(customID == 102 && this.mode == this.game_mode.BOTVBOT){
                        this.timer.start();
                        this.currentState = this.state.BOT_1_TURN;
                    }
                    break;
    
                case this.state.BOT_1_TURN:
                    if(customID == 102){
                        this.currentState = this.state.BOT_V_BOT_EXIT;
                        return;
                    }

                    this.selectedPiece = null;
                    this.bot1.botTurn();
                    this.currentState = this.state.BOT_1_WAIT_RESPONSE;
                    break;

                case this.state.BOT_1_WAIT_RESPONSE:
                    if(this.bot1.currentState == this.bot1.state.MOVING){
                        this.currentState = this.state.BOT_1_PLAYING;
                        return;
                    }
                        
                    if(customID == 102){
                        this.currentState = this.state.BOT_1_WAIT_EXIT;
                        return;
                    }
                    break;
    
                case this.state.BOT_1_PLAYING:
                    if(customID == 102){
                        this.currentState = this.state.BOT_V_BOT_EXIT;
                        return;
                    }

                    if(this.bot1.currentState == this.bot1.state.STOP){
                        this.timer.changePlayer();
                        this.currentState = this.state.BOT_2_TURN;
                    }
                    break;

                case this.state.BOT_1_WAIT_EXIT:
                    if(this.bot1.currentState == this.bot1.state.MOVING){
                        this.currentState = this.state.BOT_V_BOT_EXIT;
                    }
                    break;
    
                case this.state.BOT_2_TURN:
                    if(customID == 102){
                        this.currentState = this.state.BOT_V_BOT_EXIT;
                        return;
                    }

                    this.selectedPiece = null;
                    this.bot2.botTurn();
                    this.currentState = this.state.BOT_2_WAIT_RESPONSE;
                    break;

                case this.state.BOT_2_WAIT_RESPONSE:
                    if(this.bot2.currentState == this.bot2.state.MOVING){
                        this.currentState = this.state.BOT_2_PLAYING;
                        return;
                    }

                    if(customID == 102){
                        this.currentState = this.state.BOT_2_WAIT_EXIT;
                        return;
                    }
                    break;

                case this.state.BOT_2_PLAYING:
                    if(customID == 102){
                        this.currentState = this.state.BOT_V_BOT_EXIT;
                        return;
                    }
                    
                    if(this.bot2.currentState == this.bot2.state.STOP){
                        this.timer.changePlayer();

                        if(this.mode == this.game_mode.BOTVBOT)
                            this.currentState = this.state.BOT_1_TURN;
                        else
                            this.currentState = this.state.PLAYER_1_SELECT_PIECE;
                    }
                    break;

                case this.state.BOT_2_WAIT_EXIT:
                    if(this.bot2.currentState == this.bot2.state.MOVING){
                        this.currentState = this.state.BOT_V_BOT_EXIT;
                    }
                    break;

                case this.state.BOT_V_BOT_EXIT:
                    this.selectedPiece = null;
                    this.bot1.currentState = this.bot1.state.STOP;
                    this.bot2.currentState = this.bot2.state.STOP;
                    this.currentState = this.state.START;
                    this.restart();
                    break;

                case this.state.BLACK_WON:
                    break;

                case this.state.WHITE_WON:
                    break;
                
                default:
                    break;
    
            }
        }


    /**
     * Returns move if its valid, null otherwise
     */
    isMoveInValidMoves(x,y){
        for(let i = 0 ; i < this.validMoves.length; i++){
            let move = this.validMoves[i];
            if(move.destX == x && move.destY == y){
                return move;
            }
        }
        return null;
    }

    /**
     * Checks if the game is over
     * @returns true if game over, false otherwise
     */
    isGameOver(){
        
        //White has no pieces alive
        if(this.whiteAlivePieces.length === 0){
            this.wonGame("black");
            return true;
        }

        //Black has no pieces alive
        if(this.blackAlivePieces.length === 0){
            this.wonGame("white");
            return true;
        }

        //White conquered Black castle
        for(var i = 0 ; i < this.whiteAlivePieces.length; i++){
            var piece = this.pieces[this.whiteAlivePieces[i]-1];
            if(piece.x === this.blackCastle.x && piece.y === this.blackCastle.y){
                this.wonGame("white");
                return true;
            }
        }

        //Black conquered White castle
        for(var i = 0 ; i < this.blackAlivePieces.length; i++){
            var piece = this.pieces[this.blackAlivePieces[i]-1];
            if(piece.x === this.whiteCastle.x && piece.y === this.whiteCastle.y){
                this.wonGame("black");
                return true;
            }
        }
        
        return false;
    }

    /**
     * Updates values according to who won
     * @param {white or black} player 
     */
    wonGame(player){
        if(player == "white"){
            this.currentState = this.state.WHITE_WON;
            this.whiteScore++;
        }else{
            this.currentState = this.state.BLACK_WON;
            this.blackScore++;
        }
        this.updateResultString();
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
        
        
        let leftUpX = movingPiece.x + 3;
        let leftUpY = movingPiece.y - 3;
        let pieceLeftUp = this.getPiece(leftUpX,leftUpY);
        if(pieceLeftUp){
            leftUpY -= 3;
            leftUpX += 3;
            pieceLeftUp = this.getPiece(leftUpX,leftUpY);
        }
        //If it doesn't exist any piece, then we can create a move
        if(!pieceLeftUp){
            let move = new Move(this.scene, movingPiece, leftUpX,leftUpY);
            results.push(move);
        }

        
        let leftDownX = movingPiece.x - 3;
        let leftDownY = movingPiece.y - 3;
        let pieceLeftDown = this.getPiece(leftDownX,leftDownY);
        if(pieceLeftDown){
            leftDownX -= 3;
            leftDownY -= 3;
            pieceLeftDown = this.getPiece(leftDownX,leftDownY);
        }
        //If it doesn't exist any piece, then we can create a move
        if(!pieceLeftDown){
            let move = new Move(this.scene, movingPiece, leftDownX,leftDownY);
            results.push(move);
        }

        let rightUpX = movingPiece.x - 3;
        let rightUpY = movingPiece.y + 3;
        let pieceRightUp = this.getPiece(rightUpX,rightUpY);
        if(pieceRightUp){
            rightUpY += 3;
            rightUpX -= 3;
            pieceRightUp = this.getPiece(rightUpX,rightUpY);
        }
        //If it doesn't exist any piece, then we can create a move
        if(!pieceRightUp){
            let move = new Move(this.scene, movingPiece, rightUpX,rightUpY);
            results.push(move);
        }

        let rightDownX = movingPiece.x + 3;
        let rightDownY = movingPiece.y + 3;
        let pieceRightDown = this.getPiece(rightDownX,rightDownY);
        if(pieceRightDown){
            rightDownY += 3;
            rightDownX += 3;
            pieceRightDown = this.getPiece(rightDownX,rightDownY);
        }
        //If it doesn't exist any piece, then we can create a move
        if(!pieceRightDown){
            let move = new Move(this.scene, movingPiece, rightDownX,rightDownY);
            results.push(move);
        }
        

        for(var i = 0; i < results.length; i++){
            console.log(results[i].moveType);
            if(results[i].moveType == "jump move"){
                console.log(results[i])
            }
        }
        

        return this.filterMovesByGameLogic(results);
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