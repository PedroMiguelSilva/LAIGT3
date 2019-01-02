/**
 * Bot
 * @constructor
 */
class Bot {
    
    constructor(scene, player){
        this.scene = scene;
        this.player = player;

        this.state = {
            STOP: 0,
            MOVING: 1,
            NEXT: 2,
        }
        
        this.currentState = this.state.STOP;
        this.currentTurn = [];
        this.currentMove = 0;

        //this.playing = false;
        //this.nextMove = false;
        //this.currentMove = 0;

        //test
        //this.botTurnParser('[[18,C],[[7,Jump,C],[7,Jump,A],[13,Canter,B]]]');
        //this.botPlay([9,2],[]);
        //console.log(parseInt("20,B]"));
        //var str = "A]";
        //var str1 = "B]";
        //console.log(str.charCodeAt(0));
        //console.log(str1.charCodeAt(0));
        console.log(this.currentState);
    }

    /**
     * 
     */
    updateState(moveDone) {

        switch(this.currentState){

            case this.state.STOP:
                //console.log("STOP");
                this.turn = [];
                this.currentMove = 0;
                break;

            case this.state.MOVING:
                //console.log("MOVING");
                if(moveDone == -1)
                    this.currentState = this.state.NEXT;
                break;

            case this.state.NEXT:
                //console.log("NEXT");
                this.currentMove++;
                console.log(this.currentMove);
                if(this.currentMove >= this.turn.length)
                    this.currentState = this.state.STOP;

                this.applyMove(this.turn[this.currentMove]);
                this.currentState = this.state.MOVING;
                break;

        }

        //console.log(this.currentState);
    }

    /**
     * 
     */
    applyMove(movePosition) {
        var game = this.scene.graph.game;
        var moveX = this.getX(movePosition[2]);
        var moveZ = this.getZ(movePosition[0]);

        var move = new Move(this.scene, game.selectedPiece, moveX, moveZ);
        move.execute();
    }

    /**
     * 
     */
    getPrologBoard() {
        var game = this.scene.graph.game;
        var prologBoard = "[";

        for(var i = 13; i >= 1; i--){
        var line = "";

            if(i != 13)
                line += ",";

            line += "["
            for(var j = 1; j <= 7; j++){
                var cell;
                
                if(j!=1)
                    line += ",";

                //Out of boards (if not assumes empty)
                cell = "e";
                if(i==13 || i==1){
                    if(j!=4)
                        cell = "'X'";
                }
                else if(i==12 || i==2){
                    if(j<3 || j>5)
                        cell = "'X'";
                }
                else if(i==11 || i==3){
                    if(j==1 || j==7)
                        cell = "'X'";
                }

                //Has piece
                var x = this.getX(j);
                var z = this.getZ(i);

                var piece = game.getPiece(x,z);
                if(piece != null){
                    if(piece.color == "White"){
                        if(piece.type == "Man")
                            cell = "w";
                        else
                            cell = "'W'";
                    }
                    else{
                        if(piece.type == "Man")
                            cell = "b";
                        else
                            cell = "'B'";
                    }
                }
                
                
                line += cell;
            }
            line += "]";
            prologBoard += line;
        }

        prologBoard += "]";
        console.log(prologBoard);
        return prologBoard;
    }

    
     
    /**
     * 
     */
    botTurn() {
        
        var this_bot = this;
        var board = this.getPrologBoard();
        var player = this.player;

        this.currentState = this.state.MOVING;
    
        var command = "bot_turn(" + board + "," + player + ")";
        console.log(command);
        this.scene.client.getPrologRequest(command,
            function(data){
                var turnString = data.target.response;
                var turnBot = this_bot.botTurnParser(turnString);
                this_bot.botPlay(turnBot[0], turnBot[1]);
            },
            function(data){
                console.log("Connection error: botBoard");
            }
        );
    }

    /**
     * 
     */
    botTurnParser(turnString){
        var turn = [];
        var piece = [];
        var moves = [];
       
        //Auxiliar
        var pos = 2;
        var num;
        var col;
        var type;

        //Piece
        num = parseInt(turnString.substring(pos));
        if(num >= 10) pos += 3;
        else pos += 2;
        col = turnString[pos].charCodeAt(0) - 64;
     
        piece.push(num);
        piece.push(col);
        pos += 5;
       
        //Moves
        while(pos < turnString.length){
            var move = [];

            num = parseInt(turnString.substring(pos));
            if(num >= 10) pos += 3;
            else pos += 2;

            if(turnString[pos] == 'J'){
                type = 'Jump';
                pos += 5;
            }
            else if(turnString[pos] == 'C'){
                type = 'Canter';
                pos += 7;
            }
            else{
                type = 'Plain';
                pos += 6;
            }
            col = turnString[pos].charCodeAt(0) - 64;
            pos += 4;

            move.push(num);
            move.push(type);
            move.push(col);
            moves.push(move);
        }

        turn.push(piece);
        turn.push(moves);

        console.log(turn)
        return turn;
    }


    /**
     * 
     */
    botPlay(piecePosition, moves) {
        var game = this.scene.graph.game;
        this.turn = moves;
       
        //Select Piece
        var pieceX = this.getX(piecePosition[1]);
        var pieceZ = this.getZ(piecePosition[0]);
        var piece = game.getPiece(pieceX, pieceZ);
        if(piece == null)
            return;

        game.selectedPiece = piece; //game.getPiece(pieceX, pieceZ);

        this.applyMove(this.turn[0]);
        //this.currentState = this.state.MOVING;
        /*
        //Move Piece
        for(var i = 0; i < moves.length; i++){
            var movePosition = moves[i];
            var moveX = this.getX(movePosition[2]);
            var moveZ = this.getZ(movePosition[0]);
         
            game.selectedPiece.move(moveX, moveZ);
        }
        */

    }

    /**
     * 
     */
    getX(col) {
        return 12 - 3*col;
    }

    /**
     * 
     */
    getZ(row) {
        return -21 + 3*row;
    }

}