/* GAME ENDING VERIFICATION */

/*
Functions to search two type of pieces at the board.
Used to search check if there are pieces of one player at the board.
*/
findPiecesLine([Piece1|Rest], Piece1, Piece2).
findPiecesLine([Piece2|Rest], Piece1, Piece2).
findPiecesLine([Cell|Rest], Piece1, Piece2) :- findPiecesLine(Rest, Piece1, Piece2).


findPiecesGame([Line|Rest], Piece1, Piece2) :- findPiecesLine(Line, Piece1, Piece2).
findPiecesGame([Line|Rest], Piece1, Piece2) :- findPiecesGame(Rest, Piece1, Piece2).

/*
Function to verify if one of the players already won the game.
Winner returned if there no pices of the other player at the board.
Winner returned if one of its pieces reached the opposite castle. 
*/
gameOver(Board, white) :- 
                        \+ findPiecesGame(Board, 'b', 'B') ;
                        getBoardCell(Board, 13, 'D', 'w') ;
                        getBoardCell(Board, 13, 'D', 'W').

gameOver(Board, black) :-
                        \+ findPiecesGame(Board, 'w', 'W') ;
                        getBoardCell(Board, 1, 'D', 'b') ;
                        getBoardCell(Board, 1, 'D', 'B').



/* FIRST PLAYER MOVE FUNCTIONS*/                   

/*
Verify if exists a possible jump move
*/
existPriorityJump(Player, Board) :-
                        validMoves(Board, Player, Number, Letter, FoundType, FoundNumber,FoundLetter),
                        FoundType == 'Jump'.

/*
Verify if there's a piece at own castle's position
*/
pieceOwnCastle(Player, Board) :-
                            (
                                Player == white,
                                (
                                    getBoardCell(Board, 1, 'D', 'w'); getBoardCell(Board, 1, 'D', 'W')
                                )
                            );
                            (
                                Player == black,
                                (
                                    getBoardCell(Board, 13, 'D', 'b'); getBoardCell(Board, 13, 'D', 'B')
                                )
                            ).

/*
Verifies if Player is trying to do an invalid first move given Type from (Num,Let) to (MoveNum,MoveLet) at Board.
The move is invalid if there exists a possible jump move to be made by player (verified using existPriorityJump) and player is not doing a jump.
(Type not equals 'Jump'), or if there is a piece at the own castle position (verifies using pieceOwnCastle) and player is not moving the piece
from it (verified Num and Let of the piece the Player is moving), or if the move is invalid (not possible move given the Board state).
*/
invalidFirstMove(Player, Num, Let, Type, MoveNum, MoveLet, Board):-
                            (
                                pieceOwnCastle(Player, Board),
                                (
                                    (
                                        Player == white, 
                                        (Num \= 1; Let \= 'D')
                                    ) ;
                                    (
                                        Player == black,
                                        (Num \= 13; Let \= 'D')
                                    )
                                ),
                                write('There is a piece above the castle... Move it !!!'), nl
                                
                            );
                            (
                                \+ pieceOwnCastle(Player, Board),
                                existPriorityJump(Player, Board),
                                \+move(Player, Num, Let, 'Jump', MoveNum, MoveLet, Board, NewBoard),
                                write('There exists a priority jump move to be done !!!'), nl
                            );
                            (
                                \+ pieceOwnCastle(Player, Board),
                                \+ existPriorityJump(Player, Board),
                                \+move(Player, Num, Let, Type, MoveNum, MoveLet, Board, NewBoard),
                                write('Not valid move !!!'), nl
                            ).

/*
Auxiliar functions to verifyFirstMove.
*/
verifyFirstMove(Player, Num, Let, Type, MoveNum, MoveLet, Board, NewBoard, ChosenN, ChosenL, ChosenT, ChosenMN, ChosenML) :-
                            invalidFirstMove(Player, Num, Let, Type, MoveNum, MoveLet, Board),
                            playerFirstMove(Player, ChosenN, ChosenL, ChosenT, ChosenMN, ChosenML, Board, NewBoard).

verifyFirstMove(Player, Num, Let, Type, MoveNum, MoveLet, Board, NewBoard, ChosenN, ChosenL, ChosenT, ChosenMN, ChosenML) :-
                            \+ invalidFirstMove(Player, Num, Let, Type, MoveNum, MoveLet, Board),
                            move(Player, Num, Let, Type, MoveNum, MoveLet, Board, NewBoard),
                            ChosenN = Num, ChosenL = Let, ChosenT = Type, ChosenMN = MoveNum, ChosenML = MoveLet.

/*
Player chooses first move
*/
playerFirstMove(Player, ChosenN, ChosenL, ChosenT, ChosenMN, ChosenML, Board, NewBoard) :-
                        readInput(Num, 'Piece Number > '),
                        readInput(Let, 'Piece Letter > '),
                        readInput(MoveNum, 'Move Number > '),
                        readInput(MoveLet, 'Move Letter > '),
                        validMoves(Board, Player, Num, Let, Type, MoveNum, MoveLet),
                        verifyFirstMove(Player, Num, Let, Type, MoveNum, MoveLet, Board, NewBoard, ChosenN, ChosenL, ChosenT, ChosenMN, ChosenML).



/* PLAYER TURN FUNCTIONS */

/*
Verifies if specific piece, at position (Number,Letter) of received Board can jump.
*/
pieceCanJump(Board, Player, Number, Letter) :-
                        validMoves(Board, Player, Number, Letter, FoundType, FoundNumber, FoundLetter),
                        FoundType == 'Jump'.

/*
Verifies if Player's turn end automatically. That happens if the last move was a plain move (LastType == 'Plain'), or if
the last move was a jump and the piece can't do more jump moves (uses pieceCanJump function to do this verification).
*/
automEndTurn(Player, LastType, LastNum, LastLet, LastBoard, FinalBoard) :-
                        (
                            LastType == 'Plain',
                            FinalBoard = LastBoard
                        );
                        (
                            LastType == 'Jump',
                            \+ pieceCanJump(LastBoard, Player, LastNum, LastLet),
                            FinalBoard = LastBoard
                        ).

/*
Verifies if move chosen by Player at middle of turn is invalid, receiving the last move information (LastType, LastNum, LastLet) and the 
information of the move the Player is trying to do.
This verifies if Player tries to do a move that is not a 'Jump' after a 'Jump', or if Player is moving man and tries to do a move that
is not a 'Canter' after a 'Canter', or if Player is moving a Knight and tries to do a move that is nos a 'Canter' or a 'Jump' after a 'Canter'.
*/
invalidMoveTurn(Player, LastType, LastNum, LastLet, LastBoard, NewNum, NewLet) :-
                        (
                            LastType == 'Jump',
                            \+ move(Player, LastNum, LastLet, 'Jump', NewNum, NewLet, LastBoard, Ignore),
                            write('Only jump moves allowed after jump...'), nl
                        );
                        (
                            LastType == 'Canter',
                            getBoardCell(LastBoard, LastNum, LastLet, Cell),
                            (Cell == 'w' ; Cell == 'b'),
                            \+ move(Player, LastNum, LastLet, 'Canter', NewNum, NewLet, LastBoard, Ignore),
                            write('Only allowed more canters...'), nl
                        );
                        (
                            LastType == 'Canter',
                            getBoardCell(LastBoard, LastNum, LastLet, Cell),
                            (Cell == 'W' ; Cell == 'B'),
                            \+ move(Player, LastNum, LastLet, 'Canter', NewNum, NewLet, LastBoard, Ignore),
                            \+ move(Player, LastNum, LastLet, 'Jump', NewNum, NewLet, LastBoard, Ignore2),
                            write('Only allowed more canters or jumps...'), nl
                        ).

/*
Receives the initial position of the piece being moved, the last move and a CouldJump flag.
Verifies if player can NOT end turn.
That happens if player is trying to end a sequence of canters at the initial position (InitNum, InitLet), or if player is moving
a knight and passed near an enemie without jumping (Cell == 'W' or Cell == 'B', and CouldJump == 1).
*/
playerInvalidEndTurn(InitNum, InitLet, LastBoard, LastNum, LastLet, CouldJump) :-
                        (
                            (
                                InitNum == LastNum , InitLet == LastLet
                            ),
                            write('Sequence of counters cannot end at the initial position...'), nl
                        );
                        (
                            getBoardCell(LastBoard, LastNum, LastLet, Cell),
                            (Cell == 'W' ; Cell == 'B'),
                            CouldJump == 1,
                            write('Knight already passed an enemie, now you need to jump at least one time...'), nl
                        ).


playerNextMove(Player, InitNum, InitLet, LastType, LastNum, LastLet, LastBoard, FinalBoard, CouldJump) :-
                        (
                            (
                                LastType == 'Jump'
                            );
                            (
                                LastType == 'Canter',
                                (
                                    (
                                        pieceCanJump(LastBoard, Player, LastNum, LastLet),
                                        NewCouldJump is 1
                                    );
                                    (
                                        \+ pieceCanJump(LastBoard, Player, LastNum, LastLet),
                                        NewCouldJump is CouldJump
                                    )
                                    
                                ),
                                readInput(Continue, 'Move same piece? (yes to confirm) > ')
                            )
                        ),
                        (
                            (
                                LastType == 'Canter', Continue \= yes,
                                \+ playerInvalidEndTurn(InitNum, InitLet, LastBoard, LastNum, LastLet, NewCouldJump),
                                FinalBoard = LastBoard
                            );
                            (
                                LastType == 'Canter', Continue \= yes,
                                playerInvalidEndTurn(InitNum, InitLet, LastBoard, LastNum, LastLet, NewCouldJump),
                                playerMoveLoop(Player, InitNum, InitLet, LastType, LastNum, LastLet, LastBoard, FinalBoard, NewCouldJump)
                            );
                            (
                                readInput(MoveNum, 'Move Number > '),
                                readInput(MoveLet, 'Move Letter > '),
                                (
                                    (
                                        \+ invalidMoveTurn(Player, LastType, LastNum, LastLet, LastBoard, MoveNum, MoveLet),
                                        move(Player, LastNum, LastLet, Type, MoveNum, MoveLet, LastBoard, NewBoard),
                                        printBoard(NewBoard, 13),
                                        playerMoveLoop(Player, InitNum, InitLet, Type, MoveNum, MoveLet, NewBoard, FinalBoard, NewCouldJump)
                                    );
                                    (
                                        invalidMoveTurn(Player, LastType, LastNum, LastLet, LastBoard, MoveNum, MoveLet),
                                        playerMoveLoop(Player, InitNum, InitLet, LastType, LastNum, LastLet, LastBoard, FinalBoard, NewCouldJump)
                                    )
                                )
                            )
                        ).
                                        

/*
Auxiliar function to playerTurn. 
Receives the initial position of the piece being moved at (InitNum,InitLet), the last move information at LastType, LastNum, LastLet
and verifies if turn aumotatically ends with last move done (if automEndTurn is true).
If loop doesn't end automatically, calls playerNextMove so the Player can choose the next move of the turn.
*/
playerMoveLoop(Player, InitNum, InitLet, LastType, LastNum, LastLet, LastBoard, FinalBoard, CouldJump) :-
                        automEndTurn(Player, LastType, LastNum, LastLet, LastBoard, FinalBoard).

playerMoveLoop(Player, InitNum, InitLet, LastType, LastNum, LastLet, LastBoard, FinalBoard, CouldJump) :-
                        \+ automEndTurn(Player, LastType, LastNum, LastLet, LastBoard, FinalBoard),
                        playerNextMove(Player, InitNum, InitLet, LastType, LastNum, LastLet, LastBoard, FinalBoard, CouldJump).


/*
Function to Player choose its turn (sequence of moves).
Receives the current Board (with all pieces displayed).
Uses playerFirstMove: make the player chooses its first move, saving the move is at Type, MoveNumber, MoveLetter, the
                        resultant Board at MidBoard and the moved Piece at Number and Letter.
Uses playerMoveLoop: using the first move information, keeps the move/turn loop, verifying if each move is possible
                        given the last move done. The final Board is saved at NewBoard. CouldJump is used to check
                        Knight's Charge obligations.
The board resultant of Player's turn is saved/returned at NewBoard.

*/
playerTurn(Player, Board, NewBoard) :- 
                        write('Player '), write(Player), write( ' turn : '), nl,
                        CouldJump is 0,
                        playerFirstMove(Player, Number, Letter, Type, MoveNumber, MoveLetter, Board, MidBoard),
                        printBoard(MidBoard, 13),
                        playerMoveLoop(Player, Number, Letter, Type, MoveNumber, MoveLetter, MidBoard, NewBoard, CouldJump).


/* GAME LOOP */

/*
Game loop to HUMAN vs HUMAN mode
*/
gameLoop(Board, Player, _, _) :-
                        gameOver(Board, Winner),
                        write('WINNER : '), write(Winner), write(' !!!!!!'), nl.

gameLoop(Board, Player, _, _, _) :-
                        gameOver(Board, Winner),
                        write('WINNER : '), write(Winner), write(' !!!!!!'), nl.


gameLoop(Board, Player, 'h', 'h') :-
                        playerTurn(Player, Board, NewBoard),
                        (
                            (
                                Player == white, NextPlayer = black
                            );
                            (
                                Player == black, NextPlayer = white
                            )
                        ),
                        write('Player '), write(Player), write(' end turn...'), nl, nl, nl,
                        gameLoop(NewBoard, NextPlayer, 'h', 'h').

/*
Game loop to HUMAN vs COMPUTER mode 
*/
gameLoop(Board, Player, Level, 'h', 'c') :-
                        (
                            (
                                Player == white,
                                playerTurn(Player, Board, NewBoard),
                                NextPlayer = black
                            );
                            (
                                Player == black,
                                chooseTurn(Board, Player, Level, Turn),
                                botTurn(Board, Player, Turn, NewBoard, 1),
                                NextPlayer = white
                            )
                        ),
                        write('Player '), write(Player), write(' end turn...'), nl, nl, nl,
                        gameLoop(NewBoard, NextPlayer, Level, 'h', 'c').

/*
Game loop to COMPUTER vs COMPUTER mode
*/
gameLoop(Board, Player, 'c', 'c') :-
                        chooseTurn(Board, Player, hard, Turn),
                        botTurn(Board, Player, Turn, NewBoard, 1),
                        (
                            (
                                Player == white, NextPlayer = black
                            );
                            (
                                Player == black, NextPlayer = white
                            )
                        ),
                        write('Player '), write(Player), write(' end turn...'), nl, nl, nl,
                        gameLoop(NewBoard, NextPlayer, 'c', 'c').
