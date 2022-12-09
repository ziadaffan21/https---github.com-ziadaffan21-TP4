/**
 * Le jeu !
 */

"use strict";

/* global Directions faireAvancerSiPossible faireAvancerLesMechants creerJeu placerAleatoirement */

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
/**
 * Gère le bouton Démarrer
 */
function gererBoutonDemarrer() {
    // TODO
    posJoueur = $(".joueur");
    min = setInterval(faireAvancerLesMechants,1000);
}

/**
 * Gère le button Arreter
 */
function gererBoutonArreter(){
    posJoueur = null;
    clearInterval(min);
}


/**
 * Initialisation de la page.
 */
function initialisation() {
    creerJeu();
    posJoueur = placerAleatoirement("joueur");
    for (let i = 0; i < configDeJeu.nbMechants; i++) {
        placerAleatoirement("mechant");
    }

    console.assert($(".mechant").length === configDeJeu.nbMechants, "Il devrait y avoir tous les méchants");
    console.assert($(".joueur").length === 1, "Il devrait y avoir un seul joueur");


    $("#demarrer").click(gererBoutonDemarrer);
    $("#arrter").click(gererBoutonArreter);
    $(document).keydown(gererClavier);
}

$(document).ready(initialisation);