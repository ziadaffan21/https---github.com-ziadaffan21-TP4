/**
 * Constantes et utilitaires pour le jeu.
 * 
 * 
 * N E   P A S   M O I F I E R   C E   F I C H I E R  ! ! ! 
 * 
 */

"use strict";

/* eslint-disable no-unused-vars */


/**
 * Constantes représentants les directions possibles.
 * 
 * Les valeurs numériques correspondent aux valeurs 
 * des flèches sur le clavier.
 */
const Directions = {
    GAUCHE : 37,
    HAUT   : 38,
    DROIT  : 39,
    BAS    : 40,
    MIN    : 37,
    MAX    : 40
};


/**
 * Constantes pour identifier les clés utilisées pour jQuery .data(... , ...)
 */
const Data = {
    X: "x",
    Y: "y",
    PERSONNAGE: "personnage"
};


/**
 * Retourne un entier choisi aléatoirement entre min et max, tous deux inclus.
 * @param min Nombre minimum pour le choix aléatoire
 * @param max Nombre maximum pour le choix aléatoire
 * @returns Un entier aléatoire entre min et max, tous deux inclus.
 */
function entierAleatoire(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}