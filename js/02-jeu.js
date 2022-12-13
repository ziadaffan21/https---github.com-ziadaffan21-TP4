/**
 * Les fonctions pour le jeu
 */

"use strict";

/* eslint-disable no-unused-vars */
/* global Directions Data entierAleatoire configDeJeu */


let jeu = null;

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
 * Retourne la liste des directions possibles.
 * @param {*} position Une division du jeu.
 * @returns {Direction[]} Liste des directions possibles.
 */
function getDirectionsPossibles(position) {
    const dirs = [];

    if (position.data("x") > 0) {
        dirs.push(Directions.GAUCHE);
    }
    if (position.data("x") < configDeJeu.taille.x - 1) {
        dirs.push(Directions.DROIT);
    }
    if (position.data("y") > 0) {
        dirs.push(Directions.HAUT);
    }
    if (position.data("y") < configDeJeu.taille.y - 1) {
        dirs.push(Directions.BAS);
    }

    return dirs;
}


/**
 * Applique la direction sur la position pour obtenir la nouvelle position.
 * @param {*} position Position actuelle
 * @param {*} direction Direction voulue
 * @returns La nouvelle position
 */
function getNouvellePosition(position, direction) {
    console.assert(getDirectionsPossibles(position).includes(direction), "getDirectionsPossibles n'a pas marché");
    let index = position.index();
    let newPos = null;

    switch (direction) {
        case Directions.HAUT:
            newPos = position.parent().prev().children().eq(index);
            break;
        case Directions.BAS:
            newPos = position.parent().next().children().eq(index);
            break;
        case Directions.DROIT:
            newPos = position.next();
            break;
        case Directions.GAUCHE:
            newPos = position.prev();
            break;
    }

    return newPos;
}

/**
 * Verification si fin de partie.
 */
function gererFinPartie() {
    // verifier nombre de mechant
    // si nombre de mechant > 0  et joueur.vie < 0
    let mechant = $(".mechant");
    let joueur = $(".joueur");
    if (mechant.length > 0 && joueur.data("personnage").vie < 0) {

    }
    // demander stopper le deplacement des mechants
    // demander si rejouer
    // si oui "creer jeu"
    //garder score ? 
    // si nombre de mechant <= 0 et joueur.vie > 0
    // donner les stats
    // demander si rejouer
    // si oui "creer jeu "
    // garder les scores ?
}

// eslint-disable-next-line require-jsdoc
function changerValeur() {
    let joueur = jeu.find(".joueur");
    $("#vie").empty().append("Vie :" + joueur.data("personnage").vie);
    $("#armure").empty().append("Armure :" + joueur.data("personnage").armure);
    $("#or").empty().append("Or :" + joueur.data("personnage").or);
    $("#power").empty().append("Power :" + joueur.data("personnage").dommage);

}

/**
 * Gère l'attaque de attaquant sur sa victime
 * @param {*} posAttaquant L'attaquant
 * @param {*} posVictime La victime
 */
function gererAttaque(posAttaquant, posVictime) {

    // TODO
    let dataAttanquant = posAttaquant.data("personnage");
    let dataVictime = posVictime.data("personnage");
    let forceAttaque = entierAleatoire(0, dataAttanquant.dommage);
    if (forceAttaque > dataVictime.armure) {
        dataVictime.vie -= forceAttaque;
    }

    if (dataVictime.vie <= 0) {
        dataAttanquant.dommage++;
        dataAttanquant.or += dataVictime.or;
        //disparition du mechant avec effet ?
        posVictime.removeClass(dataVictime.classe);
        posVictime.removeData("personnage");
        //gererFinPartie();
    }
    if ((posVictime.classe == "joueur" || posAttaquant.classe == "joueur") && forceAttaque > dataVictime.armure) {
        changerValeur();
    }
    gererFinPartie();


}


/**
 * Gère un combat entre deux personnage.
 * @param {*} pos1 Position d'un personnage.
 * @param {*} pos2 Position d'un autre personnage.
 */
function gererCombat(pos1, pos2) {
    gererAttaque(pos1, pos2);

    // TODO : vérifier pos2 est encore vivant. Si oui :
    if (pos2.vie > 0) {
        gererAttaque(pos2, pos1);
    }
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
    let positionPossible = getNouvellePosition(position, direction);
    let listDirPossible = getDirectionsPossibles(position);

    // TODO
    for (let i = 0; i < listDirPossible.length; i++) {
        if (direction === listDirPossible[i] && !(positionPossible.hasClass("mechant") || positionPossible.hasClass("joueur"))) {
            let lePersoData = $(position).data("personnage");
            position.removeData("personnage");
            positionPossible.data("personnage", lePersoData);
            position.removeClass(classe);
            positionPossible.addClass(classe);
            newPos = positionPossible;
            return newPos;
        } else if (direction === listDirPossible[i] && (positionPossible.hasClass("mechant") || positionPossible.hasClass("joueur"))) {
            gererCombat(position, positionPossible);
        }
    }
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
    $("#vie").empty().append("Vie :" + jeu.find(".joueur").data("personnage").vie);
    $("#armure").empty().append("Armure :" + jeu.find(".joueur").data("personnage").armure);
    $("#or").empty().append("Or :" + jeu.find(".joueur").data("personnage").or);
    $("#power").empty().append("Power :" + jeu.find(".joueur").data("personnage").dommage);

    return newPos;
}


