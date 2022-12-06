/**
 * Les fonctions pour le jeu
 */

"use strict";

/* eslint-disable no-unused-vars */
/* global Directions Data entierAleatoire configDeJeu */


let jeu = null;


/**
 * Retourne la liste des directions possibles.
 * @param {*} position Une division du jeu.
 * @returns {Direction[]} Liste des directions possibles.
 */
function getDirectionsPossibles(position) {
    const dirs = [];

    // TODO 

    return dirs;
}


/**
 * Applique la direction sur la position pour obtenir la nouvelle position.
 * @param {*} position Position actuelle
 * @param {*} direction Direction voulue
 * @returns La nouvelle position
 */
function getNouvellePosition(position, direction) {
    console.assert(getDirectionsPossibles(position).includes(direction));

    let newPos = null;

    // TODO

    return newPos;
}

/**
 * Gère l'attaque de attaquant sur sa victime
 * @param {*} posAttaquant L'attaquant
 * @param {*} posVictime La victime
 */
function gererAttaque(posAttaquant, posVictime) {

    // TODO

}


/**
 * Gère un combat entre deux personnage.
 * @param {*} pos1 Position d'un personnage.
 * @param {*} pos2 Position d'un autre personnage.
 */
function gererCombat(pos1, pos2) {
    gererAttaque(pos1, pos2);

    // TODO : vérifier pos2 est encore vivant. Si oui :
    gererAttaque(pos2, pos1);
}


/**
 * Essaie de faire avancer un personnage dans une direction
 * @param {*} position Position courante
 * @param {*} classe La classe du personnage
 * @param {*} direction La direction désirée
 * @returns La nouvelle position si le mouvement est possible, null sinon.
 */
function faireAvancerSiPossible(position, classe, direction) {
    let newPos = null;

    // TODO

    return null;
}



/**
 * Fait avancer tous les méchants
 */
function faireAvancerLesMechants() {
    for (const m of jeu.find(".mechant")) {
        faireAvancerSiPossible(
            $(m), "mechant", entierAleatoire(Directions.MIN, Directions.MAX));
    }
}



/**
 * Créer la planche de jeu.
 */
function creerJeu() {
    jeu = $("#jeu");
    let divLigne;
    let champ;
    // TODO
    for (let i = 0; i < configDeJeu.taille.y; i++) {

        divLigne = $('<div class="ligne"></div>');
        jeu.append(divLigne);
        for (let j = 0; j < configDeJeu.taille.x; j++) {
            champ = $('<div></div>');
            champ.data("x", j);
            champ.data("y", i);
            divLigne.append(champ);
        }
    }

}

/**
 * Retourne un nouveau personnage.
 * @param classe La classe du nouveau personnage
 * @returns Objet avec les caractéristiques d'un personnage
 */
function creerPersonnage(classe) {
    const perso = {
        "vie": 50,
        "dommage": 10,
        "armure": 6,
        "or": 20,
        "classe": classe
    };

    if (classe === "joueur") {
        perso.dommage = 15;
    }

    return perso;
}
let i = 0;
/**
 * Place aléatoirement une classe sur une tuile libre du jeu
 * @param {*} classe La classe à mettre sur la tuile.
 * @returns La nouvelle position
 */
function placerAleatoirement(classe) {
    let newPos = null;
    let trouve = false;

    // TODO
    while (!trouve) {
        let x = entierAleatoire(0, configDeJeu.taille.x - 1);
        let y = entierAleatoire(0, configDeJeu.taille.y - 1);
        let div = $(".ligne").eq(y).children().eq(x);
        if (!(div.hasClass("joueur") || div.hasClass("mechant"))) {
            trouve = true;
            div.addClass(classe);
            let lePerso = creerPersonnage(classe);
            div.data("personnage", lePerso);
        }
    }

    return newPos;
}


