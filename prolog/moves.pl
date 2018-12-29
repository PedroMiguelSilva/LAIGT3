/* VALID MOVES FUNCTIONS */

/*
Functions to verify if there are Cells around (Row,Column) with given Piece
*/     
verifyPosition(Board, Piece, Row, Column, FoundRow, FoundColumn) :-
                                    getCell(Board, Row, Column, Piece),
                                    FoundRow = Row, FoundColumn = Column.

verifyRow(Board, Piece, Row, Column, FoundRow, FoundColumn) :-
                                    LeftColumn is Column - 1, RightColumn is Column + 1,
                                    (
                                        verifyPosition(Board, Piece, Row, LeftColumn, FoundRow, FoundColumn);
                                        verifyPosition(Board, Piece, Row, Column, FoundRow, FoundColumn);
                                        verifyPosition(Board, Piece, Row, RightColumn, FoundRow, FoundColumn)
                                    ).

verifyOwnRow(Board, Piece, Row, Column, FoundRow, FoundColumn) :-
                                    LeftColumn is Column - 1, RightColumn is Column + 1,
                                    (
                                        verifyPosition(Board, Piece, Row, LeftColumn, FoundRow, FoundColumn);
                                        verifyPosition(Board, Piece, Row, RightColumn, FoundRow, FoundColumn)
                                    ).

findPieceAround(Board, Piece, Row, Column, FoundRow, FoundColumn) :-
                                    UpRow is Row + 1, DownRow is Row - 1,
                                    (
                                        verifyRow(Board, Piece, UpRow, Column, FoundRow, FoundColumn);
                                        verifyOwnRow(Board, Piece, Row, Column, FoundRow, FoundColumn);
                                        verifyRow(Board, Piece, DownRow, Column, FoundRow, FoundColumn)
                                    ).

/*
Function to verify if Piece is trying to go to own Castle
*/
goOwnCastle(Cell, MoveNumber, MoveLetter) :-
                                    (
                                        (Cell == 'w' ; Cell == 'W'), (MoveNumber == 1, MoveLetter == 'D')
                                    );
                                    (
                                        (Cell == 'b' ; Cell == 'B'), (MoveNumber == 13, MoveLetter == 'D')
                                    ).
                        
/*
Function to verify if there are possible jump moves from Cell (Number, Letter).
Possible Jump moves will be returned as (MoveNumber, MoveLetter) pairs.
*/
possibleJumpMoves(Board, Number, Letter, MoveNumber, MoveLetter) :-
                                                        getBoardCell(Board, Number, Letter, Cell),
                                                        column(Column, Letter), Row is Number,
                                                        (
                                                            (
                                                                (
                                                                    Cell == 'w' ; Cell == 'W'
                                                                ),
                                                                (
                                                                    findPieceAround(Board, 'b', Row, Column, FoundRow, FoundColumn);
                                                                    findPieceAround(Board, 'B', Row, Column, FoundRow, FoundColumn)
                                                                )
                                                            );
                                                            (
                                                                (
                                                                    Cell == 'b' ; Cell == 'B'
                                                                ),
                                                                (
                                                                    findPieceAround(Board, 'w', Row, Column, FoundRow, FoundColumn);
                                                                    findPieceAround(Board, 'W', Row, Column, FoundRow, FoundColumn)
                                                                )
                                                            )
                                                        ),
                                                        (
                                                            (FoundRow > Row, MoveRow is FoundRow + 1);
                                                            (FoundRow == Row, MoveRow is FoundRow);
                                                            (FoundRow < Row, MoveRow is FoundRow - 1)
                                                        ),
                                                        (
                                                            (FoundColumn > Column, MoveColumn is FoundColumn + 1);
                                                            (FoundColumn == Column, MoveColumn is FoundColumn);
                                                            (FoundColumn < Column, MoveColumn is FoundColumn - 1)
                                                        ),
                                                        MoveNumber = MoveRow,
                                                        column(MoveColumn, MoveLetter),
                                                        (
                                                            getBoardCell(Board, MoveNumber, MoveLetter, 'e');
                                                            getBoardCell(Board, MoveNumber, MoveLetter, 'C')
                                                        ).


/*
Function to verify if there are possible plain moves from Cell (Number, Letter).
Possible plain moves will be returned as (MoveNumber, MoveLetter) pairs.
*/
possiblePlainMoves(Board, Number, Letter, MoveNumber, MoveLetter) :-
                                            getBoardCell(Board, Number, Letter, Cell),
                                            (Cell == 'b' ; Cell == 'B' ; Cell == 'w' ; Cell == 'W'),
                                            column(Column, Letter), Row is Number,
                                            (
                                                findPieceAround(Board, 'e', Row, Column, FoundRow, FoundColumn);
                                                findPieceAround(Board, 'C', Row, Column, FoundRow, FoundColumn)
                                            ),
                                            MoveNumber = FoundRow,
                                            column(FoundColumn, MoveLetter),
                                            \+ goOwnCastle(Cell, MoveNumber, MoveLetter).

/*
Function to verify if there are possible canter moves from Cell (Number, Letter).
Possible canter moves will be returned as (MoveNumber, MoveLetter) pairs.
*/
possibleCanterMoves(Board, Number, Letter, MoveNumber, MoveLetter) :-
                                            getBoardCell(Board, Number, Letter, Cell),
                                            (Cell == 'b' ; Cell == 'B' ; Cell == 'w' ; Cell == 'W'),
                                            column(Column, Letter), Row is Number,
                                            (
                                                (
                                                    (
                                                        Cell == 'b' ; Cell == 'B'
                                                    ),
                                                    (
                                                        findPieceAround(Board, 'b', Row, Column, FoundRow, FoundColumn);
                                                        findPieceAround(Board, 'B', Row, Column, FoundRow, FoundColumn)
                                                    )
                                                );
                                                (
                                                    (
                                                        Cell == 'w' ; Cell == 'W'
                                                    ),
                                                    (
                                                        findPieceAround(Board, 'w', Row, Column, FoundRow, FoundColumn);
                                                        findPieceAround(Board, 'W', Row, Column, FoundRow, FoundColumn)
                                                    )
                                                )
                                            ),
                                            (
                                                (FoundRow > Row, MoveRow is FoundRow + 1);
                                                (FoundRow == Row, MoveRow is FoundRow);
                                                (FoundRow < Row, MoveRow is FoundRow - 1)
                                            ),
                                            (
                                                (FoundColumn > Column, MoveColumn is FoundColumn + 1);
                                                (FoundColumn == Column, MoveColumn is FoundColumn);
                                                (FoundColumn < Column, MoveColumn is FoundColumn - 1)
                                            ),
                                            MoveNumber = MoveRow,
                                            column(MoveColumn, MoveLetter),
                                            (
                                                getBoardCell(Board, MoveNumber, MoveLetter, 'e');
                                                getBoardCell(Board, MoveNumber, MoveLetter, 'C')
                                            ),
                                            \+ goOwnCastle(Cell, MoveNumber, MoveLetter).

/*
Auxiliar functions to validMoves.
*/
validCellMoves(Board, Row, Col, Player, Number, Letter, Type, MoveNumber, MoveLetter) :- 
                                Number = Row, column(Col, Letter),
                                (
                                    (
                                        Player == white,
                                        getBoardCell(Board, Number, Letter, Cell), (Cell == 'w' ; Cell == 'W')
                                    );
                                    (
                                        Player == black,
                                        getBoardCell(Board, Number, Letter, Cell), (Cell == 'b' ; Cell == 'B')
                                    )
                                ),
                                (
                                    (possiblePlainMoves(Board, Row, Letter, MoveNumber, MoveLetter), Type = 'Plain');
                                    (possibleCanterMoves(Board, Row, Letter, MoveNumber, MoveLetter), Type = 'Canter');
                                    (possibleJumpMoves(Board, Row, Letter, MoveNumber, MoveLetter), Type = 'Jump')
                                ).

validMovesAuxLine(Board, Row, Col, Player, Number, Letter, Type, MoveNumber, MoveLetter) :-
                                Col < 8,
                                NextCol is Col + 1,
                                (
                                    validCellMoves(Board, Row, Col, Player, Number, Letter, Type, MoveNumber, MoveLetter);
                                    validMovesAuxLine(Board, Row, NextCol, Player, Number, Letter, Type, MoveNumber, MoveLetter)
                                ).

validMovesAux(Board, 0, Col, Player, Number, Letter, Type, MoveNumber, MoveLetter).
validMovesAux(Board, Row, Col, Player, Number, Letter, Type, MoveNumber, MoveLetter) :-
                                Row > 0,
                                NextRow is Row - 1,
                                (
                                    validMovesAuxLine(Board, Row, 1, Player, Number, Letter, Type, MoveNumber, MoveLetter);
                                    validMovesAux(Board, NextRow, 1, Player, Number, Letter, Type, MoveNumber, MoveLetter)
                                ).

/*
validMoves: Function that using the auxiliar functions validMovesAux, validMovesAuxLine and validCellMoves goes through
all board cells, verifying for each cell all possible plain, canter or jump moves (using the functions possibleJumpMoves, 
possiblePlainMoves and possibleCanterMoves).
NOTE: Don't verify the game rules, that verification is done at the logic level.
*/
validMoves(Board, Player, Number, Letter, Type, MoveNumber,MoveLetter) :-
                                validMovesAux(Board, 13, 1, Player, Number, Letter, Type, MoveNumber, MoveLetter).


/* MOVES FUNCTIONS */

/*
Auxiliar function to use at move function.
Moves the piece at the position (Number, Letter) of the Board to the position (MoveNumber, MoveLetter), changing the Board's pieces/symbols,
depending on the move type. The resultant board is saved at NewBoard.
Type == 'Plain' : replaces piece symbol at (Number,Letter) with 'e' and sets (MoveNumber,MoveLetter) with piece symbol.
Type == 'Canter' : replaces piece symbol at (Number, Letter) with 'e' and sets (MoveNumber, MoveLetter) with piece symbol.
Type == 'Jump' : replaces piece symbol at (Number, Letter) with 'e', sets (MoveNumber, MoveLetter) with piece symbol and resets enemie at middle
                position replacing it with 'e'.
*/
movePiece(Board, Number, Letter, 'Plain', MoveNumber, MoveLetter, NewBoard) :-
                                    getBoardCell(Board, Number, Letter, Piece),
                                    setBoardCell(Board, MidBoard, Number, Letter, 'e'),
                                    setBoardCell(MidBoard, NewBoard, MoveNumber, MoveLetter, Piece).

movePiece(Board, Number, Letter, 'Canter', MoveNumber, MoveLetter, NewBoard) :-
                                    getBoardCell(Board, Number, Letter, Piece),
                                    setBoardCell(Board, MidBoard, Number, Letter, 'e'),
                                    setBoardCell(MidBoard, NewBoard, MoveNumber, MoveLetter, Piece).

movePiece(Board, Number, Letter, 'Jump', MoveNumber, MoveLetter, NewBoard) :-
                                    column(Col, Letter), column(MoveCol, MoveLetter),
                                    (
                                        (MoveNumber > Number, EnemNum is Number + 1);
                                        (MoveNumber == Number, EnemNum is Number);
                                        (MoveNumber < Number, EnemNum is Number - 1)
                                    ),
                                    (
                                        (MoveCol > Col, EnemCol is Col + 1);
                                        (MoveCol == Col, EnemCol is Col);
                                        (MoveCol < Col, EnemCol is Col - 1)
                                    ),
                                    column(EnemCol, EnemLetter),
                                    getBoardCell(Board, Number, Letter, Piece),
                                    setBoardCell(Board, SecBoard, Number, Letter, 'e'),
                                    setBoardCell(SecBoard, ThrBoard, EnemNum, EnemLetter, 'e'),
                                    setBoardCell(ThrBoard, NewBoard, MoveNumber, MoveLetter, Piece).

/*
Function that moves piece in the Board at posistion (Number, Letter) to the position (MoveNumber, MoveLetter)
Verifies if Player can do the move is possible at the Board using the function validMoves.
If possible, moves the piece using movePiece function.
NOTE: Does not verify the game rules, only verifies if move is possible with the pieces disposition at the Board.
      The rules verification is done at the logic level (logic.pl).
*/
move(Player, Number, Letter, Type, MoveNumber, MoveLetter, Board, NewBoard) :-
                                    validMoves(Board, Player, Number, Letter, FoundType, FoundNumber,FoundLetter),
                                    MoveNumber == FoundNumber, MoveLetter == FoundLetter, Type = FoundType,
                                    movePiece(Board, Number, Letter, Type, MoveNumber, MoveLetter, NewBoard).