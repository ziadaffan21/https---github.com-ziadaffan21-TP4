/**
 * Le jeu !
 */

"use strict";

/* global Directions faireAvancerSiPossible faireAvancerLesMechants creerJeu placerAleatoirement placerVieSup */
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
        configDeJeu.taille.y = 5;
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
        configDeJeu.nbMechants = 16;
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
        min = setInterval(faireAvancerLesMechants, 1000);//1000
        minVie = setTimeout(placerVieSup, 100);//10000
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
    creerJeu();
    posJoueur = placerAleatoirement("joueur");
    for (let i = 0; i < configDeJeu.nbMechants; i++) {
        placerAleatoirement("mechant");
    }
    $("#demarrer").text("Démarrer");
    $("#demarrer").attr("class", "btn btn-primary");
    $(document).off("keydown", gererClavier);
    clearTimeout(minVie);
    clearInterval(min);
}



/**
 * Initialisation de la page.
 */
function initialisation() {




    console.assert($(".mechant").length === configDeJeu.nbMechants, "Il devrait y avoir tous les méchants");
    console.assert($(".joueur").length === 1, "Il devrait y avoir un seul joueur");

    $("#demarrer").click(gererBoutonDemarrer);
    $("#rejouer").click(gererBoutonRejouer);

    $("#selectable").selectable();

}


$(document).ready(initialisation);