/**
 * Les fonctions pour le jeu
 */

"use strict";

/* eslint-disable no-unused-vars */
/* global Directions Data entierAleatoire configDeJeu min gererClavier minVie*/


let jeu = null;

/**
 * Créer la planche de jeu.
 */
function creerJeu() {
    jeu = $("#jeu");
    let divLigne;
    let champ;

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
 * 
 */
function monterPage() {
    $('html, body').animate({ scrollTop: '0px'}, 500);
}
/**
 * Verification si fin de partie.
 */
function gererFinPartie() {

    let mechant = $(".mechant");
    let joueur = $(".joueur");
    if (mechant.length == 0 || joueur.length == 0) {
        clearInterval(min);
        $(document).off("keydown", gererClavier);
    }
    if (mechant.length == 0) {
        $("#infos").empty().append("Félicitation pour votre victoire ! <br/> Cliquer sur rejouer pour faire une nouvelle partie.");
        monterPage();
    }
    if (joueur.length == 0) {
        $("#infos").empty().append("Dommage mais bonne nouvelle vous pouvez encore essayer ! <br/> Cliquer sur rejouer pour faire une nouvelle partie.");
        monterPage();
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
 * Méthode pour placer une vie supplementaire
 */
function placerVieSup() {
    let trouve = false;
    console.log("placerVieSup");
    while (!trouve) {
        let x = entierAleatoire(0, configDeJeu.taille.x - 1);
        let y = entierAleatoire(0, configDeJeu.taille.y - 1);
        let div = $(".ligne").eq(y).children().eq(x);
        if (!(div.hasClass("joueur") || div.hasClass("mechant"))) {
            trouve = true;
            div.addClass("vie_sup");
        }
    }

}

/**
 * Méthode pour mettre à jour l'affichage des données du joueur
 */
function changerValeur() {
    let joueur = jeu.find(".joueur");
    if (joueur.data("personnage") != undefined && joueur.data("personnage").vie > 0) {
        $("#vie").empty().append(joueur.data("personnage").vie);
        $("#armure").empty().append(joueur.data("personnage").armure);
        $("#or").empty().append(joueur.data("personnage").or);
        $("#power").empty().append(joueur.data("personnage").dommage);

    }
    else {
        $("#vie").empty().append("0");
    }
    if (joueur.data("personnage") != undefined && joueur.data("personnage").vie < 20 && $("#jeu").find(".vie_sup").length < 1) {
        placerVieSup();
        $("#effetVie20").effect("shake", 500);
    }
}

/**
 * Gère l'attaque entre deux personnages
 * @param {*} posAttaquant L'attaquant
 * @param {*} posVictime La victime
 */
function gererAttaque(posAttaquant, posVictime) {

    let dataAttaquant = posAttaquant.data("personnage");
    let dataVictime = posVictime.data("personnage");
    let forceAttaque = entierAleatoire(0, dataAttaquant.dommage);
    if (forceAttaque > dataVictime.armure) {
        dataVictime.vie -= forceAttaque;
        if (dataAttaquant.classe == "joueur" || dataVictime.classe == "joueur") {
            changerValeur();
        }
    }

    if (dataVictime.vie <= 0) {
        dataAttaquant.dommage++;
        dataAttaquant.or += dataVictime.or;
        posVictime.attr("id", "effetHighlight");
        if (dataVictime.classe == "mechant") {
            $("#effetHighlight").effect("highlight", 500);
        }
        posVictime.removeClass(dataVictime.classe);
        posVictime.removeData("personnage");
        posVictime.removeAttr("id");
        changerValeur();
    }

    gererFinPartie();

}


/**
 * Gère un combat entre deux personnages.
 * @param {*} pos1 Position d'un personnage.
 * @param {*} pos2 Position d'un autre personnage.
 */
function gererCombat(pos1, pos2) {
    gererAttaque(pos1, pos2);

    if (pos2.data("personnage") != undefined) {
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

    for (let i = 0; i < listDirPossible.length; i++) {
        if (direction === listDirPossible[i] && !(positionPossible.hasClass("mechant") || positionPossible.hasClass("joueur"))) {
            if ((position.hasClass("joueur")) && positionPossible.hasClass("vie_sup")) {
                position.data("personnage").vie += 20;
                $("#vie").empty().append(position.data("personnage").vie);
                positionPossible.removeClass("vie_sup");
            }
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

    while (!trouve) {
        let x = entierAleatoire(0, configDeJeu.taille.x - 1);
        let y = entierAleatoire(0, configDeJeu.taille.y - 1);
        let div = $(".ligne").eq(y).children().eq(x);
        if (!(div.hasClass("joueur") || div.hasClass("mechant") || div.hasClass("vie_sup"))) {
            trouve = true;
            div.addClass(classe);
            let lePerso = creerPersonnage(classe);
            div.data("personnage", lePerso);
        }
    }
    $("#vie").empty().append(jeu.find(".joueur").data("personnage").vie);
    $("#armure").empty().append(jeu.find(".joueur").data("personnage").armure);
    $("#or").empty().append(jeu.find(".joueur").data("personnage").or);
    $("#power").empty().append(jeu.find(".joueur").data("personnage").dommage);

    return newPos;
}


