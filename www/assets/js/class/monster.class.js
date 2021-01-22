import Weapon from './weapon.class.js';
import Perso from './perso.class.js';

export default class Monster extends Perso {

  // Initialisation des propriétés du monstre.
  _xp = 0;
  _str = 1;
  _sta = 1;
  _gold = 20;
  _stand = document.getElementById("monster-stand");
  _attack = document.getElementById("monster-attack");
  #weapon;

  /**
   * Constructeur du monstre.
   */
  constructor(playerXp) {
    super();
    // Détermine le nombre de point d'expérience en fonction du niveau du joueur.
    const maxXp = ((playerXp + 1) * 5) <= 50 ? (playerXp + 1) * 5 : 50;
    this._xp = Math.floor(Math.random() * maxXp);

    // Créé les caractéristiques du monstres en fonction du nombre de points d'expérience.
    this._str = Math.floor(Math.random() * this._xp) + 1;
    this._sta = Math.floor(Math.random() * this._xp) + 1;
    this._gold = Math.floor(Math.random() * this._xp) + 5;

    // Sélectionne l'arme en fonction du nombre de points d'expérience.
    this.#weapon = new Weapon();
    this.#weapon.random(this._xp);

    // Affiche le monstre.
    this.show(this._stand, true);
  }

  // Retourne l'arme du monstre.
  getWeapon() {
    return this.#weapon;
  }

}
