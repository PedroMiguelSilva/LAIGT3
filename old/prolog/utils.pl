/* GET FUNCTION */

getCellList([Cell|Rest], Column, Value) :- Column == 1, Value = Cell.
getCellList([Cell|Rest], Column, Value) :-
                                        Column > 1,
                                        NextColumn is Column - 1,
                                        getCellList(Rest, NextColumn, Value).

getCell([Line|Rest], Row, Column, Value) :- 
                                    Row == 13,
                                    getCellList(Line, Column, Value).
getCell([Line|Rest], Row, Column, Value) :- 
                                        Row < 13,
                                        NextRow is Row + 1,
                                        getCell(Rest, NextRow, Column, Value).

getBoardCell(Board, Number, Letter, Cell) :-
                                    Row is Number,
                                    column(Column, Letter),
                                    getCell(Board, Row, Column, Cell).


/* SET FUNCTION */

setCellList([Cell|Rest], [Value|Rest], Column, Value) :- Column == 1.
setCellList([Cell|Rest], [Cell|NewRest], Column, Value) :-
                                    Column > 1,
                                    NewColumn is Column - 1,
                                    setCellList(Rest, NewRest, NewColumn, Value).

setCell([Line|Rest], [NewLine|Rest], Row, Column, Value) :-
                                        Row == 13,
                                        setCellList(Line, NewLine, Column, Value).
setCell([Line|Rest], [Line|NewRest], Row, Column, Value) :-
                                        Row < 13,
                                        NewRow is Row + 1,
                                        setCell(Rest, NewRest, NewRow, Column, Value).

setBoardCell(Board, NewBoard, Number, Letter, Cell) :-
                                        Row is Number,
                                        column(Column, Letter),
                                        setCell(Board, NewBoard, Row, Column, Cell).


/* COPY BOARD */

copyBoard([],_).
copyBoard([Cell|Rest], [CopyCell|CopyRest]) :-
                        CopyCell = Cell,
                        copyBoard(Rest, CopyRest).


/* ABSOLUTE VALUE */

abs(Value, Abs) :-
        Value >= 0,
        Abs is Value.

abs(Value, Abs) :-
        Value < 0,
        Abs is 0 - Value.

/* MIN VALUE */

min(Value, Value2, Min) :-
        \+(Value > Value2),
        Min is Value.

min(Value, Value2, Min) :-
        Value > Value2,
        Min is Value2.

/*FIND ELEMENT AT BOARD */
isMember(Elem, [Elem|T]).
isMember(Elem, [H|T]) :- isMember(Elem, T).

/* GET LIST LENGTH */
length([], Count, Count).
length([H|T], Count, Len) :- Next is Count+1, length(T, Next, Len). 

/* RANDOM */
writeRandom :- random(1,3,Num), write(Num), nl.