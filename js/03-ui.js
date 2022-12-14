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

/**
 * Gère le bouton Démarrer
 */
function gererBoutonDemarrer() {
    // TODO
    let btn = $("#demarrer");

    if (btn.text() === "Démarrer") {
        posJoueur = $(".joueur");
        min = setInterval(faireAvancerLesMechants, 100);//1000
        $(document).keydown(gererClavier);

        btn.text("Arreter");
        btn.attr("class","btn btn-danger");
    } else {
        btn.text("Démarrer");
        btn.attr("class","btn btn-primary");
        $(document).off("keydown",gererClavier);

        clearInterval(min);
    }


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

    // a placer au premier demarrer
    setTimeout(placerVieSup, 10000);

    $("#demarrer").click(gererBoutonDemarrer);


    $("#selectable").selectable();

}

$(document).ready(initialisation);