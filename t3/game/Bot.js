/**
 * Bot
 * @constructor
 */
class Bot {
    
    constructor(scene, player){
        this.scene = scene;
        this.player = player;


        //test
        this.botTurnParser('[[18,C],[[7,Jump,C],[7,Jump,A],[13,Canter,B]]]');
        //this.botPlay([9,2],[]);
        //console.log(parseInt("20,B]"));
        //var str = "A]";
        //var str1 = "B]";
        //console.log(str.charCodeAt(0));
        //console.log(str1.charCodeAt(0));
    }


    /**
     * 
     */
    getPrologBoard() {
        var game = this.scene.graph.game;
        var prologBoard = "[";

        for(var i = 13; i >= 1; i--){
            var line = "["
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
                            cell = "W";
                    }
                    else{
                        if(piece.type == "Man")
                            cell = "b";
                        else
                            cell = "B";
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
        var this_game = this.scene.graph.game;
        var this_bot = this;
    
        var command = "bot_turn(" + this_game.prologBoard + "," + this.player + ")";
        //console.log(command);
        this.scene.client.getPrologRequest(command,
            function(data){
                var turnString = data.target.response;
                console.log(turnString);
                var turnBot = this_bot.botTurnParser(turnString);
                //this_bot.botPlay(turnBot[1], turnBot[2]);
                console.log(turnBot);
            },
            function(data){
                console.log("Connection error: initBoard");
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
        console.log("Welcome to Parser");
        console.log(turnString);
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

        //Select Piece
        var pieceX = this.getX(piecePosition[1]);
        var pieceZ = this.getZ(piecePosition[0]);
        var piece = game.getPiece(pieceX, pieceZ);
        if(piece == null)
            return;

        game.selectedPiece = piece; //game.getPiece(pieceX, pieceZ);

        //Move Piece
        for(var i = 0; i < moves.length; i++){
            var movePosition = moves[i];
            var moveX = this.getX(movePosition[2]);
            var moveZ = this.getZ(movePosition[0]);
         
            game.selectedPiece.move(moveX, moveZ);
        }

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