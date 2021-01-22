import Weapon from './weapon.class.js';
import Perso from './perso.class.js';

export default class Pnj extends Perso {

  // Initialisation des propriétés du PNJ.
  _stand = document.getElementById("pnj-stand");

  /**
   * Constructeur du PNJ.
   */
  constructor(playerXp) {
    super();
    // Détermine le nombre de point d'expérience en fonction du niveau du joueur.
    const maxXp = ((playerXp + 1) * 2) <= 50 ? (playerXp + 1) * 2 : 50;
    this._xp = Math.floor(Math.random() * maxXp);

    // Rajoute les armes à PNJ.
    const nbWeapons = Math.floor(Math.random() * 5) + 1;
    for (let n = 0; n < nbWeapons;n++) {
      const weapon = new Weapon();
      weapon.random(this._xp + 10, true);

      // Ajoute l'arme uniquement si le même type d'arme n'a pas encore été rajouté dans l'inventaire.
      if (this._inventory.length > 0) {
        const weaponFound = this._inventory.filter(i => {
          if (i.weapon.getName() === weapon.getName()) {
            return i.weapon;
          }
        });
        if (weaponFound.length === 0) {
          this._inventory.push({weapon, equiped: false});
        }
      } else {
        this._inventory.push({weapon, equiped: false});
      }
    }
    this.show(this._stand, true);
  }

}
