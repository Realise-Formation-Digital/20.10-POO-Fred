import Weapon from './weapon.class.js';
import Perso from './perso.class.js';

export default class Pnj extends Perso {

  // Initialisation des propriétés du PNJ.
  _stand = document.getElementById("pnj-stand");

  /**
   * Constructeur du PNJ.
   */
  constructor() {
    super();
    this._xp = Math.floor(Math.random() * 50) + 1;
    const nbWeapons = Math.floor(Math.random() * 5) + 1;
    for (let n = 0; n < nbWeapons;n++) {
      const weapon = new Weapon();
      weapon.random(true);
      this._inventory.push({weapon, equiped: false});
    }
    this.show(this._stand, true);
  }

}
