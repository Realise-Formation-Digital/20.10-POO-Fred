// Liste des types d'arme
const WEAPONTYPES = [
  {
    name: 'Epée en bois',
    str: 1,
    sta: 0,
    price: 5
  },
  {
    name: 'Fourche',
    str: 2,
    sta: 0,
    price: 7
  },
  {
    name: 'Bouclier en bois',
    str: 0,
    sta: 1,
    price: 5
  },
  {
    name: 'Poignard',
    str: 7,
    sta: 0,
    price: 10
  },
  {
    name: 'Glaive',
    str: 10,
    sta: 3,
    price: 20
  },
  {
    name: 'Bouclier métal',
    str: 1,
    sta: 10,
    price: 25
  },
  {
    name: 'Epée magique',
    str: 20,
    sta: 8,
    price: 100
  },
  {
    name: 'Bouclier magique',
    str: 4,
    sta: 20,
    price: 150
  },
  {
    name: 'Epée de Légende',
    str: 40,
    sta: 15,
    price: 1000
  },
  {
    name: 'Arc de lumière',
    str: 50,
    sta: 2,
    price: 200
  },  
]

export default class Weapon {

  // Initialisation des propriétés de l'arme.
  _name = '';
  _str = 0;
  _sta = 0;
  #price = 0;

  /**
   * Détermine le type d'arme.
   */
  setWeaponType(type) {
    const weaponType = WEAPONTYPES[type];
    this._name = weaponType.name;
    this._str = weaponType.str;
    this._sta = weaponType.sta;
    this.#price = weaponType.price;
  }

  /**
   * Séléctionne aléatoirement le type d'arme.
   */
  random(persoXp, onlyReturnWeapons = false) {
    const maxXp = Math.ceil(persoXp / 4) < WEAPONTYPES.length - 1 ? Math.ceil(persoXp / 4) : WEAPONTYPES.length - 1;
    const type = Math.floor(Math.random() * maxXp);

    // Si l'option onlyReturnWeapons est fausse, permet aléatoirement de ne pas retourner d'arme.
    if (!onlyReturnWeapons) {
      const hasWeapon = Math.floor(Math.random() * 2);
      if (hasWeapon === 1) {
        this.setWeaponType(type);
      }
    } else {
      this.setWeaponType(type);
    }
  }

  /**
   * Retourne le nom.
   */
  getName() {
    return this._name;
  }

  /**
   * Retourne le nombre de point de force.
   */
  getStr() {
    return this._str;
  }

  /**
   * Retourne le nombre de point d'endurance. 
   */
  getSta() {
    return this._sta;
  }

  /**
   * Retourne le prix.
   */
  getPrice() {
    return this.#price;
  }

  /**
   * Retoune un objet simple de l'arme.
   */
  getObject() {
    return {
      name: this._name,
      str: this._str,
      sta: this._sta,
      price: this.#price
    }
  }

  /**
   * Initialise les paramètres principaux de l'arme.
   */
  set(name, str, sta, price) {
    this._name = name;
    this._str = str;
    this._sta = sta;
    this.#price = price;
  }

}
