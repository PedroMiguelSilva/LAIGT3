/* CONSULT ALL PL FILES */

:-consult('input.pl').
:- consult('display.pl').
:- consult('utils.pl').
:- consult('moves.pl').
:- consult('logic.pl').
:- consult('bot.pl').
:- consult('menu.pl').
:- use_module(library(random)).
:- use_module(library(system)).

:- startMenu.