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
  constructor() {
    super();
    this._xp = Math.floor(Math.random() * 50) + 1;
    this._str = Math.floor(Math.random() * this._xp) + 1;
    this._sta = Math.floor(Math.random() * this._xp) + 1;
    this.#weapon = new Weapon();
    this.#weapon.random();
    this._gold = Math.floor(Math.random() * 50) + 1;
    this.show(this._stand, true);
  }

  // Retourne l'arme du monstre.
  getWeapon() {
    return this.#weapon;
  }

}
