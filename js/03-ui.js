/**
 * Le jeu !
 */

"use strict";

/* global Directions faireAvancerSiPossible faireAvancerLesMechants creerJeu placerAleatoirement placerVieSup */

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
    posJoueur = placerAleatoirement("joueur");
    for (let i = 0; i < configDeJeu.nbMechants; i++) {
        placerAleatoirement("mechant");
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
    creerJeu();


    console.assert($(".mechant").length === configDeJeu.nbMechants, "Il devrait y avoir tous les méchants");
    console.assert($(".joueur").length === 1, "Il devrait y avoir un seul joueur");

    $("#demarrer").click(gererBoutonDemarrer);
    $("#rejouer").click(gererBoutonRejouer);

    $("#selectable").selectable();

}


$(document).ready(initialisation);