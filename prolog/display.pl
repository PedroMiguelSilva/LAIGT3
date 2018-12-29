:- dynamic board/1.

/* BOARD */

board([

['X', 'X', 'X', 'C', 'X', 'X', 'X'],
['X', 'X', 'e', 'e', 'e', 'X', 'X'],
['X', 'e', 'e', 'e', 'e', 'e', 'X'],
['e', 'e', 'B', 'e', 'B', 'e', 'e'],
['e', 'b', 'b', 'b', 'b', 'b', 'e'],
['e', 'e', 'e', 'e', 'e', 'e', 'e'],
['e', 'e', 'e', 'e', 'e', 'e', 'e'],
['e', 'e', 'e', 'e', 'e', 'e', 'e'],
['e', 'w', 'w', 'w', 'w', 'w', 'e'],
['e', 'e', 'W', 'e', 'W', 'e', 'e'],
['X', 'e', 'e', 'e', 'e', 'e', 'X'],
['X', 'X', 'e', 'e', 'e', 'X', 'X'],
['X', 'X', 'X', 'C', 'X', 'X', 'X']

]).

test([

['X', 'X', 'X', 'C', 'X', 'X', 'X'],
['X', 'X', 'e', 'e', 'e', 'X', 'X'],
['X', 'e', 'e', 'e', 'e', 'e', 'X'],
['e', 'e', 'B', 'e', 'B', 'e', 'e'],
['e', 'b', 'b', 'b', 'b', 'b', 'e'],
['e', 'e', 'e', 'e', 'e', 'e', 'e'],
['e', 'e', 'e', 'e', 'e', 'e', 'e'],
['e', 'e', 'B', 'e', 'e', 'e', 'e'],
['e', 'w', 'w', 'w', 'w', 'w', 'e'],
['e', 'e', 'W', 'e', 'W', 'e', 'e'],
['X', 'e', 'e', 'e', 'e', 'e', 'X'],
['X', 'X', 'e', 'e', 'e', 'X', 'X'],
['X', 'X', 'X', 'C', 'X', 'X', 'X']

]).



/* DISPLAY FUNCTIONS */

/*
Function to print one board Cell/Symbol.
*/
printCell('e') :-  write('| '), write(' '), write(' ').
printCell(Cell) :- 
                (Cell == 'C'; Cell == 'B'; Cell == 'b'; Cell == 'W'; Cell == 'w'),
                write('| '), write(Cell), write(' ').

printCell(Cell):- 
                Cell == 'X', write('    ').

/*
Function to print one board Line (corresponding to one of the lists of the list).
*/
printLine([]) :- write('|').
printLine([Cell | ['X'|_]]) :- Cell\='X', printCell(Cell), write('|').
printLine([Cell|Rest]) :- 
                printCell(Cell), printLine(Rest).


/*
Function to print the limiter/separator of each line (used to seperate the lines).
*/
printLimiter([]) :- write('*').
printLimiter([Cell|['X'|_]]) :- Cell\='X', write('*---*').
printLimiter([Cell|Rest]) :- Cell\='X', write('*---'), printLimiter(Rest).
printLimiter(['X'|Rest]) :- printCell('X'), printLimiter(Rest). 
printLimiter([Cell|Rest]) :- 
                printLimiter(Rest).


/*
Function to print the columns header.
*/
printColumnsHeader :- 
                write('       *---*---*---*---*---*---*---*'), nl,
                write('       | A | B | C | D | E | F | G |'), nl,
                write('       *---*---*---*---*---*---*---*'), nl, nl.

/*
Function to print the limiter of each line heade.
*/
printLineHeaderLimiter(N) :- write('*---*   ').
printLineHeaderNumber(N) :- N < 10, N\=(10-1), write('| '), write(N), write(' |   ').
printLineHeaderNumber(N) :- N == (10-1), write('| 9'), write(' |   ').
printLineHeaderNumber(N) :- N >= 10, N\=(10-1), write('| '), write(N), write('|   ').

/*
Main function to print the board, receive the Board and the number of lines (13).
Go throught the lines of the boards and used the previous functions to print it at the console.
*/
printBoard([], _) :- printColumnsHeader.
printBoard([Line|Rest], N) :-
                N > 10,
                Next is N-1,
                printLineHeaderLimiter(N), printLimiter(Line), nl,
                printLineHeaderNumber(N), printLine(Line), nl,
                printBoard(Rest,Next).
printBoard([Line|Rest], N) :-
                N == 10,
                Next = N-1,
                printLineHeaderLimiter(N), printLimiter(Line), nl,
                printLineHeaderNumber(N), printLine(Line), nl,
                printLineHeaderLimiter(N), printLimiter(Line), nl,
                printBoard(Rest,Next).
printBoard([Line|Rest], N) :-
                N < 10,
                Next is N-1,
                printLineHeaderNumber(N), printLine(Line), nl,
                printLineHeaderLimiter(N), printLimiter(Line), nl, 
                printBoard(Rest,Next).


displayBoard :- board(Board), printColumnsHeader, printBoard(Board, 13).

/* COLUMNS (LETTER, NUMBER) */
columnLetter(Number, Letter) :-
    column(Number, Letter).

column(1, 'A').
column(2, 'B').
column(3, 'C').
column(4, 'D').
column(5, 'E').
column(6, 'F').
column(7, 'G').