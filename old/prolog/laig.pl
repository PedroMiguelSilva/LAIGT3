validFirstPosition(Board, Player, Row, Col, MoveRow, MoveCol, Valid) :-
    column(Col, Let),
    column(MoveCol, MoveLet),
    Num is Row,
    MoveNum is MoveRow,
    validFirstPositionAux(Board, Player, Num, Let, MoveNum, MoveLet, Valid).

validFirstPositionAux(Board, Player, Num, Let, MoveNum, MoveLet, 1) :-
    validFirstMove(Board, Player, [Num, Let], [MoveNum, _, MoveLet], _).

validFirstPositionAux(Board, Player, Num, Let, MoveNum, MoveLet, 0) :-
    \+validFirstMove(Board, Player, [Num, Let], [MoveNum, _, MoveLet], _).


updateBoard(Board, Player, Row, Col, MoveRow, MoveCol, Type, NewBoard) :-
    column(Col, Let),
    column(MoveCol, MoveLet),
    Num is Row,
    MoveNum is MoveRow,
    move(Player, Num, Let, Type, MoveNum, MoveLet, Board, NewBoard).


b([['X','X','X','C','X','X','X'],['X','X','e','e','e','X','X'],['X','e','e','e','e','e','X'],['e','e','B','e','B','e','e'],['e','b','b','b','b','b','e'],['e','e','e','e','e','e','e'],['e','e','e','e','e','e','e'],['e','e','e','e','e','e','e'],['e','w','w','w','w','w','e'],['e','e','W','e','W','e','e'],['X','e','e','e','e','e','X'],['X','X','e','e','e','X','X'],['X','X','X','C','X','X','X']]).