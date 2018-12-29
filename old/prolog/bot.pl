/* VALUE BOARD FUNCTIONS */

/*
Functions to give the pontuation relative to the present enemies at the board
*/
valueByEnemiesLine([], Player, CurrentValue, UpdatedValue) :- UpdatedValue is CurrentValue.
valueByEnemiesLine([Cell|Rest], Player, CurrentValue, UpdatedValue) :-
                        (
                            (
                                (
                                    (Player == white, Cell == 'b') ; (Player == black, Cell == 'w')
                                ),
                                NewCurrentValue is CurrentValue - 20
                                
                            );
                            (
                                (
                                    (Player == white, Cell == 'B') ; (Player == black, Cell == 'W')
                                ),
                                NewCurrentValue is CurrentValue - 30   
                            );
                            NewCurrentValue is CurrentValue
                        ),
                        valueByEnemiesLine(Rest, Player, NewCurrentValue, UpdatedValue).
                        

valueByEnemies([], Player, CurrentValue, Value) :- Value is CurrentValue.
valueByEnemies([Line|Rest], Player, CurrentValue, Value) :-
                        valueByEnemiesLine(Line, Player, CurrentValue, UpdatedValue),
                        valueByEnemies(Rest, Player, UpdatedValue, Value).

            
/*
Functions to give the pontuation relative to the closest position to the castle
*/
valueByClosestLine([], Row, Col, Player, CurMinRowDist, CurMinColDist, MinRowDist, MinColDist) :-
                                                                        MinRowDist is CurMinRowDist,
                                                                        MinColDist is CurMinColDist.

valueByClosestLine([Cell|Rest], Row, Col, Player, CurMinRowDist, CurMinColDist, MinRowDist, MinColDist) :-
                        (
                            (Player == white, CastleRow is 13) ; 
                            (Player == black, CastleRow is 1)
                        ),
                        CastleCol is 4,
                        (
                            
                            (
                               (
                                    (
                                        Player == white, (Cell == 'w' ; Cell == 'W')
                                    ) ; 
                                    (
                                        Player == black, (Cell == 'b' ; Cell == 'B')
                                    )
                               ),
                               (
                                    abs(Row - CastleRow, RowDist),
                                    min(RowDist, CurMinRowDist, NewMinRowDist)
                               ),
                               (
                                   (
                                       RowDist == CurMinRowDist,
                                       abs(Col - CastleCol, ColDist),
                                       min(ColDist, CurMinColDist, NewMinColDist)
                                   );
                                   (
                                       RowDist \= CurMinRowDist,
                                       abs(Col - CastleCol, NewMinColDist)
                                   )
                               )
                            );
                            (
                                (
                                    (Player == white, Cell \= 'w', Cell \= 'W') ; 
                                    (Player == black, Cell \= 'b', Cell \= 'B')
                                ),
                                NewMinRowDist is CurMinRowDist,
                                NewMinColDist is CurMinColDist
                            )
                        ),
                        NextCol is Col + 1,
                        valueByClosestLine(Rest, Row, NextCol, Player, NewMinRowDist, NewMinColDist, MinRowDist, MinColDist).

valueByClosest([], Player, 0, MinRowDist, MinColDist, Value) :- Value is 160 - MinRowDist * 10 - MinColDist * 5.
valueByClosest([Line|Rest], Player, Row, MinRowDist, MinColDist, Value) :-
                        valueByClosestLine(Line, Row, 1, Player, MinRowDist, MinColDist, NewMinRowDist, NewMinColDist),
                        NextRow is Row - 1,
                        valueByClosest(Rest, Player, NextRow, NewMinRowDist, NewMinColDist, Value).


/*
Function to calculate the total pontuation of the board, using the previous functions
*/
value(Board, Player, Value) :-
                        valueByEnemies(Board, Player, 160, ValueByEnemies),
                        valueByClosest(Board, Player, 13, 100, 100, ValueByClosest),
                        Value is ValueByEnemies + ValueByClosest.
                        

/* VALID TURN FUNCTIONS */

/*
Function to check valid first move in a turn: receives current Board, Player, and saves the
possible first moves in the turn at [Num, Let, Type, MoveNum, MoveLet], saves the move of the
chosen piece at [MoveNum, Type, MoveLet] and saves the new board after that move at NewBoard
*/
validFirstMove(Board, Player, [Num, Let], [MoveNum, Type, MoveLet], NewBoard) :- 
                    validMoves(Board, Player, Num, Let, Type, MoveNum, MoveLet),
                    \+ invalidFirstMove(Player, Num, Let, Type, MoveNum, MoveLet, Board),
                    move(Player, Num, Let, Type, MoveNum, MoveLet, Board, NewBoard).

/*
Function to check next move in a turn: receives current Board, Player moving the piece, 
the last move of the piece [LastNum, LastType,LastLet] and saves next possible moves at
[MoveNum, Type, MoveLetter] and the new board resulting from the move at NewBoard
*/
validNextMove(Board, Player, [LastNum, LastType, LastLet], [MoveNum, Type, MoveLet], NewBoard) :-
                    (
                        getBoardCell(Board, LastNum, LastLet, Cell)
                    ),
                    (
                        (
                            LastType == 'Jump',
                            validMoves(Board, Player, LastNum, LastLet, Type, MoveNum, MoveLet),
                            Type == 'Jump'
                        );
                        (
                            LastType == 'Canter',
                            (
                                (
                                    (Cell \= 'W', Cell \= 'B'),
                                    validMoves(Board, Player, LastNum, LastLet, Type, MoveNum, MoveLet),
                                    Type == 'Canter'
                                );
                                (
                                    (Cell == 'W' ; Cell =='B'),
                                    validMoves(Board, Player, LastNum, LastLet, Type, MoveNum, MoveLet),
                                    (Type == 'Canter' ; Type == 'Jump')
                                )
                            )
                        )
                    ),
                    move(Player, LastNum, LastLet, Type, MoveNum, MoveLet, Board, NewBoard).

/*
Function to verify end of bot turn
*/
endBotTurn(Board, Player, [LastNum, LastType, LastLet], CanterCount) :-
                    (
                        LastType == 'Plain'
                    );
                    (
                        LastType == 'Jump',
                        \+ pieceCanJump(Board, Player, LastNum, LastLet)
                    );
                    (
                        LastType == 'Canter',
                        CanterCount == 1
                    ).


/*
Functions to fill turn with next moves
*/
validNextMoves(Board, Player, LastMove, [], CanterCount, FinalBoard) :-
                    endBotTurn(Board, Player, LastMove, CanterCount),
                    FinalBoard = Board.

validNextMoves(Board, Player, LastMove, [Move|NextMoves], CanterCount, FinalBoard) :-
                    \+ endBotTurn(Board, Player, LastMove, CanterCount),
                    validNextMove(Board, Player, LastMove, Move, NewBoard),
                    NewCanterCount is CanterCount - 1,
                    validNextMoves(NewBoard, Player, Move, NextMoves, NewCanterCount, FinalBoard).

/*
Function to return valid turns.
*/
validTurn(Board, Player, [Piece, [FirstMove|Moves]]) :-
                    validFirstMove(Board, Player, Piece, FirstMove, NewBoard),
                    (
                        validNextMoves(NewBoard, Player, FirstMove, Moves, 1, FinalBoard);
                        validNextMoves(NewBoard, Player, FirstMove, Moves, 2, FinalBoard);
                        validNextMoves(NewBoard, Player, FirstMove, Moves, 3, FinalBoard);
                        validNextMoves(NewBoard, Player, FirstMove, Moves, 4, FinalBoard);
                        validNextMoves(NewBoard, Player, FirstMove, Moves, 5, FinalBoard) 
                    ).
                
                    
                

/* BOT TURN FUNCTIONS */

/*
Auxiliar botTurn functions to move piece
*/
firstMove(Board, Player, [Num, Let], [MoveNum, Type, MoveLet], NewBoard, Print) :-
                    move(Player, Num, Let, Type, MoveNum, MoveLet, Board, NewBoard),
                    (
                        (Print == 1, printBoard(NewBoard,13));
                        Print == 0
                    ).

nextMove(Board, Player, [LastNum, _, LastLet], [MoveNum, Type, MoveLet], NewBoard) :-
                    move(Player, LastNum, LastLet, Type, MoveNum, MoveLet, Board, NewBoard).

nextMoves(Board, Player, LastMove, [], Board, Print).
nextMoves(Board, Player, LastMove, [Move|Moves], FinalBoard, Print) :-
                    nextMove(Board, Player, LastMove, Move, NewBoard),
                    (
                        (Print == 1, printBoard(NewBoard, 13));
                        Print == 0
                    ),
                    nextMoves(NewBoard, Player, Move, Moves, FinalBoard, Print).
                    
/*
Function to bot execute turn, moving the piece at the board
*/
botTurn(Board, Player, [Piece,[FirstMove|Moves]], FinalBoard, Print) :-
                    firstMove(Board, Player, Piece, FirstMove, NewBoard, Print),
                    nextMoves(NewBoard, Player, FirstMove, Moves, FinalBoard, Print).


/*
Auxiliar function to choose random play/turn at chooseTurn with level easy
*/
randomChoose(1, [Turn|Turns], Turn).
randomChoose(Num, [Turn|Turns], RandTurn) :- 
                                NextNum is Num - 1,
                                randomChoose(NextNum, Turns, RandTurn).


/*
Auxiliar function to choose best play/turn at chooseTurn with level hard
*/
update(Turn, Value, [Turn1, Value1], [Turn1, Value1]) :-
                    \+ (Value > Value1).

update(Turn, Value, [Turn1, Value1], [Turn, Value]) :-
                    Value > Value1.

evaluateAndChoose(Board, Player, [], [Turn, Value], Turn).
evaluateAndChoose(Board, Player, [Turn|Turns], Record, BestTurn) :-
                    botTurn(Board, Player, Turn, FinalBoard, 0),
                    value(FinalBoard, Player, Value),
                    update(Turn, Value, Record, NewRecord),
                    evaluateAndChoose(Board, Player, Turns, NewRecord, BestTurn).

/*
Choose turn function
*/
chooseTurn(Board, Player, hard, Turn) :-
                    findall(T, validTurn(Board, Player, T), Turns),
                    evaluateAndChoose(Board, Player, Turns, [nill, -1000], Turn).

chooseTurn(Board, Player, easy, Turn) :-
                    findall(T, validTurn(Board, Player, T), Turns),
                    Min is 1, length(Turns, 0, Max),
                    random(Min, Max, Num),
                    randomChoose(Num, Turns, Turn).