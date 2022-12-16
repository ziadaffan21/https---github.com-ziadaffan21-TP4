/**
 * Le jeu !
 */

"use strict";

/* global Directions faireAvancerSiPossible faireAvancerLesMechants creerJeu placerAleatoirement */
let listeModeJeu = $("li");
const configDeJeu = {
    taille: {
        "x": 15,
        "y": 10,
        "largeurTuile": 50
    },
    nbMechants: 10,
};


let posJoueur = null;


/**
 * 
 */
function ChoisirViveau() {
    if (listeModeJeu.eq(0).hasClass("ui-selected") && listeModeJeu.eq(0).text() == "Facile") {
        configDeJeu.taille.x = 8;
        configDeJeu.taille.y = 4;
        configDeJeu.nbMechants = 5;
    } else if (listeModeJeu.eq(1).hasClass("ui-selected") && listeModeJeu.eq(1).text() == "Moyen") {
        configDeJeu.taille.x = 10;
        configDeJeu.taille.y = 7;
        configDeJeu.nbMechants = 7;
    } else if (listeModeJeu.eq(2).hasClass("ui-selected") && listeModeJeu.eq(2).text() == "Difficile") {
        configDeJeu.taille.x = 14;
        configDeJeu.taille.y = 10;
        configDeJeu.nbMechants = 10;
    } else if (listeModeJeu.eq(3).hasClass("ui-selected") && listeModeJeu.eq(3).text() == "Extrême") {
        configDeJeu.taille.x = 16;
        configDeJeu.taille.y = 12;
        configDeJeu.nbMechants = 15;
    }
}

/**
 * Gère les flèches au clavier
 * @param {Event} evenement Pour avoir le code
 */
function gererClavier(evenement) {
    if ((evenement.which >= Directions.MIN) && (evenement.which <= Directions.MAX)) {
        evenement.preventDefault();

        const newPos = faireAvancerSiPossible(posJoueur, "joueur", evenement.which);
        if (newPos) {
            posJoueur = newPos;
        }
    }
}

let min = null;
let minVie = null;

/**
 * Gère le bouton Démarrer
 */
function gererBoutonDemarrer() {
    let btn = $("#demarrer");
    if ($("#jeu").children().length == 0) {
        ChoisirViveau();
        creerJeu();
        posJoueur = placerAleatoirement("joueur");

        for (let i = 0; i < configDeJeu.nbMechants; i++) {
            placerAleatoirement("mechant");
        }
    }

    if (btn.text() === "Démarrer") {
        posJoueur = $(".joueur");
        min = setInterval(faireAvancerLesMechants, 1000);
        $("#selectable").selectable({"disabled" : true});
        $(document).keydown(gererClavier);
        btn.text("Arreter");
        btn.attr("class", "btn btn-danger");
    } else {
        btn.text("Démarrer");
        btn.attr("class", "btn btn-primary");
        $(document).off("keydown", gererClavier);
        clearInterval(min);
    }
}

/**
 * 
 */
function gererBoutonRejouer() {
    $("#jeu").children().replaceWith("");
    let divInfos = document.getElementById("infos");
    while (divInfos.firstChild) {
        divInfos.firstChild.remove();
    }
    $(".ui-selected").removeClass("ui-selected");
    $("#demarrer").text("Démarrer");
    $("#demarrer").attr("class", "btn btn-primary");
    $("#selectable").selectable({"disabled" : false});
    $(document).off("keydown", gererClavier);
    clearTimeout(minVie);
    clearInterval(min);
}



/**
 * Initialisation de la page.
 */
function initialisation() {
    $("#demarrer").click(gererBoutonDemarrer);
    $("#rejouer").click(gererBoutonRejouer);

    $("#selectable").selectable();

}
$(document).ready(initialisation);