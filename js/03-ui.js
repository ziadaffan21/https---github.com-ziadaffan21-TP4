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


/**
 * Gère le bouton Démarrer/Pause
 */
function gererBoutonDemarrer() {
    // TODO
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

    $("#demarrer").click(gererBoutonDemarrer);

    $(document).keydown(gererClavier);
}

$(document).ready(initialisation);