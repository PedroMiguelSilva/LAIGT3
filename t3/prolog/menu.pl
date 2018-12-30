printMenu :-
    nl,nl,
    write(' _______________________________________________________________________ '),nl,
    write('|                                                                       |'),nl,
    write('|                          ____ _____    _____                          |'),nl,
    write('|                        _/ ___\\__   \\  /     \\                         |'),nl,
    write('|                        \\  \\___ / __ \\|  Y Y  \\                        |'),nl,
    write('|                         \\___  >____  /__|_|  /                        |'),nl,
    write('|                             \\/     \\/      \\/                         |'),nl,
    write('|                                                                       |'),nl,
    write('|                          1. Player vs Player                          |'),nl,
    write('|                          2. Player vs Computer                        |'),nl,
	write('|                          3. Computer vs Computer                      |'),nl,
    write('|                          0. Exit                                      |'),nl,
    write('|                                                                       |'),nl,
    write('|                       Joao Miguel && Pedro Silva                      |'),nl,
	write('|                           Turma 1 - Grupo 5                           |'),nl,
    write(' _______________________________________________________________________ '),nl,nl,nl.

startMenu :-
    printMenu,
    readInput(Option, 'Choose your option > '), nl, nl, nl,
    startGame(Option).

startGame(1) :- board(Board), printBoard(Board,13), gameLoop(Board, white, 'h', 'h'), startMenu.
startGame(2) :- board(Board), chooseLevel(Level), printBoard(Board,13), gameLoop(Board, white, Level, 'h', 'c'), startMenu.
startGame(3) :- board(Board), printBoard(Board,13), gameLoop(Board, white, 'c', 'c'), startMenu.
startGame(0) :- write('Exiting game......'), nl,
                write('..................'), nl,
                write('..................'), nl,
                write('..................'), nl,
                write('..................'), nl,
                write('..................'), nl.

chooseLevel(Level) :-
                readInput(Option, 'Choose level (0 - easy ; 1 - hard) > '),
                (
                    (Option == 0, Level = easy);
                    (Option == 1, Level = hard)
                ).