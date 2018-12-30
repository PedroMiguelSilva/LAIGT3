class Game {
    
    constructor(scene){
        this.scene = scene;

        //Piece geometric identifiers
        this.pieceGeoIdentMan = ["man"]
        this.pieceGeoIdentKnight = ["knight"]
        this.pieceGeoIdent_Index = 0;

        this.material = this.scene.graph.materials["dark tiles"];

        this.materialBlack = this.scene.graph.materials["dark tiles"];
        this.materialWhite = this.scene.graph.materials["light tiles"];

        //Create the pieces and set their initial positions
        this.pieces = [
            new Piece(this.scene,-6, 6),
            new Piece(this.scene,-3, 6),
            new Piece(this.scene, 0, 6),
            new Piece(this.scene, 3, 6),
            new Piece(this.scene, 6, 6),
            new Piece(this.scene, 0, 0),
            new Piece(this.scene, 0, 0),
            new Piece(this.scene,-6,-6),
            new Piece(this.scene,-3,-6),
            new Piece(this.scene, 0,-6),
            new Piece(this.scene, 3,-6),
            new Piece(this.scene, 6,-6),
            new Piece(this.scene, 0,0),
            new Piece(this.scene, 0,0)
        ] // 7 first for white, 7 last for black, in order: MMMMMKKmmmmmkk

        this.selectedPiece = null;
        this.changedPiece = false;
        /*
        this.pieces = [
            new Man(this.scene,-6,-6),
            new Man(this.scene,-3,-6),
            new Man(this.scene, 0,-6),
            new Man(this.scene, 3,-6),
            new Man(this.scene, 6,-6),
            0,
            0,
            new Man(this.scene,-6,6),
            new Man(this.scene,-3,6),
            new Man(this.scene, 0,6),
            new Man(this.scene, 3,6),
            new Man(this.scene, 6,6),
            0,
            0
        ] // 7 first for white, 7 last for black, in order: MMMMMKKmmmmmkk
        */


        /**
         * Possible States of the Game
         */
        this.state = {
            START : "Please select a game mode",
            PLAYER_1_SELECT_PIECE: "Select a piece to move",
            PLAYER_1_MOVE_PIECE: "Select a destination of move",
            PLAYER_2_SELECT_PIECE: "Select a piece to move",
            PLAYER_2_MOVE_PIECE: "Select a destination of move",
            WON_GAME: "Congrats, game won",
            QUIT_GAME: "Quit Game",
            MOVIE: "Showing game movie, please wait",
            CONNECTION_ERROR: "Error connecting with game engine"
        };

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


        /**
         * Game Variables
         */
        this.board;
        this.currentPlayer;
        this.currentState;

        this.initBoard();
    }


    /**
     * 
     */
    initBoard() {
        var game = this;

        this.scene.client.getPrologRequest("initial_board",
            function(data){
                game.board = data.target.response;
            },
            function(data){
                console.log("Connection error: initBoard");
            }
        );
    }

    /**
     * 
     */
    boardToProlog() {
        var stringBoard = "";

        for(var i=0; i < this.board.length; i++) {
            var char = this.board[i];

            if(char == 'X' || char == 'C' || char == 'W' || char == 'B'){
                var encapsulated = "'" + char + "'";
                stringBoard += encapsulated;
            }
            else {
                stringBoard += char;
            }
        }

        return stringBoard;
    }


    /**
     * 
     * @param {*} pieceID 
     */
    selectPiece(pieceID) {

        if(pieceID >= 1 && pieceID <= this.pieces.length) {
            //this.selectedPiece = this.pieces[pieceID - 1];
            
            var selectedPiece = this.pieces[pieceID - 1];
            if(selectedPiece != this.selectPiece){
                this.selectedPiece = selectedPiece;
                this.changedPiece = true;
            }
        }
    }

    /**
     * 
     */
    movePiece(cellID, cell){
        console.log(cell);

        if(cellID <= this.pieces.length)
            return;
    
        if(this.selectedPiece == null || this.selectedPiece == undefined)
            return;

        if(!cell.active)
            return;

        var pieceRow = this.selectedPiece.getRow();
        //var pieceCol = this.scelece
        this.selectedPiece.move(cell.x,cell.z);

        this.updatePrologBoard("white", this.selectedPiece.getRow(), this.selectedPiece.getColumn(), cell.row, cell.column);
        console.log(this.board);
    }


    /**
     *  
     */
    updatePrologBoard(player, row, col, moveRow, moveCol){
        var this_game = this;

        var board = this.boardToProlog();
 
        //update_board(Board, Player, Row, Col, MoveRow, MoveCol)
        var command = "update_board(" + board + "," + player + "," + row + "," + col + "," + moveRow + "," + moveCol + ")"; 

        this.scene.client.getPrologRequest(command,
            function(data){
                this_game.board = data.target.response;
            },
            function(data){
                console.log("Connection error: updateBoard");
            }
        );


    }


    update(delta){ 

        for(var i = 0; i < this.pieces.length; i++){
            if(this.pieces[i].animation != undefined){
                this.pieces[i].animation.update(delta);
            }
        }
       
    }

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
            this.scene.registerForPick(i+1,this.scene.graph.components[nameOfMan] );
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

        //for loop percorre dos man, e depois dos cavaleiros por causa da diferença das geometrias

        // animaçoes de houver

        // posiçao fixa se nao houver
    }




}