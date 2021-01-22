import Weapon from './weapon.class.js';
import Perso from './perso.class.js';

const { BehaviorSubject } = rxjs;

export default class Player extends Perso {

  // Initialisation des propriétés du joueur.
  _stand = document.getElementById("player-stand");
  _attack = document.getElementById("player-attack");

  #flee = document.getElementById("player-walk");
  #walk = document.getElementById("player-walk");

  // Propriété statique pour gérer l'observable.
  static player$ = new BehaviorSubject(null);

  /**
   * Constructeur du joueur.
   */
  constructor() {
    super();

    // Lance les commande d'initialisation uniquement si l'instance (singleton) n'a pas été créée.
    if (!Player._instance) {

      // Ajoute l'objet Player en cours dans l'instance (singleton).
      Player._instance = this;
    }

    // Retourne l'instance (singleton).
    return Player._instance;
  }

  /**
   * Définit une propriété statique pour l'instance (singleton).
   */
  static getInstance() {
    return this._instance;
  }

  /**
   * Retourne l'arme équipée du joueur.
   */
  getWeapon() {
    const weaponFound = this._inventory.filter(i => {
      if (i.equiped) {
        return i;
      }
    })[0];
    return weaponFound.weapon;
  }

  /**
   * Retourne un objet simple de l'inventaire.
   */
  getInventoryObject() {
    return [...this._inventory.map(i => {return {weapon: i.weapon.getObject(), equiped: i.equiped}})];
  }

  /**
   * Réinitialise les paramètres principaux du personnage.
   */
  reset() {
    // Initialise les paramètres de base du joueur.
    this._name = "";
    this._life = 10;
    this._xp = 0;
    this._str = 1;
    this._sta = 1;
    this._gold = 20;

    // Ajoute une épée en bois à l'inventaire.
    const weapon = new Weapon();
    weapon.setWeaponType(0);
    this._inventory.push({weapon, equiped: true});

    // Affiche le joueur.
    this.show(this._stand, true);
    this._stand.style.left = '100px';

    // Ajoute l'objet Player en cours à l'observable.
    Player.player$.next(this);
  }

  /**
   * Initialise les paramètres principaux du personnage.
   */
  set(name, life, xp, str, sta, gold, inventory) {
    this._name = name;
    this._life = life;
    this._xp = xp;
    this._str = str;
    this._sta = sta;
    this._gold = gold;
    this._inventory = inventory;

    // Affiche le joueur.
    this.show(this._stand, true);
    this._stand.style.left = '100px';

    // Ajoute l'objet Player en cours à l'observable.
    Player.player$.next(this);
  }

  /**
   * Equipe une arme de l'inventaire du joueur.
   */
  setEquipedWeapon(index) {
    this._inventory.map((item, key) => {
      item.equiped = key === index;
    });

    // Ajoute l'objet Player en cours à l'observable.
    Player.player$.next(this);
  }

  /**
   * Achète une arme.
   */
  buyWeapon(weapon) {
    console.log(weapon);
  }

  /**
   * Lance la marche.
   */
  async walk() {
    this.show(this._stand, false);
    this.show(this.#walk, true);
    this.reloadAnim(this.#walk);
    const position = await this.move(this.#walk, 20, 100, true);
    this.show(this.#walk, false);
    this._stand.style.left = position + 'px';
    this.show(this._stand, true);
  }

  /**
   * Lance la fuite.
   */
  async flee() {
    this.show(this._stand, false);
    this.show(this.#flee, true);
    this.reloadAnim(this.#flee);
    const standPosition = parseInt(this._stand.style.left.substring(0, this._stand.style.left.length - 2), 10);
    const position = await this.move(this.#flee, 20, standPosition, false);
    this.show(this.#flee, false);
    this._stand.style.left = position + 'px';
    this.show(this._stand, true);
  }

  /**
   * Retire un point d'expérience.
   */
  looseXp() {
    if (this._xp > 0) {
      this._xp--;
    }

    // Ajoute l'objet Player en cours à l'observable.
    Player.player$.next(this);
  }

  /**
   * Retire un point de vie.
   */
  looseLife() {
    if (this._life > 0) {
      this._life--;
    }

    // Ajoute l'objet Player en cours à l'observable.
    Player.player$.next(this);
  }

  /**
   * Ajoute une arme dans l'inventaire.
   */
  addToInventory(weapon) {
    this._inventory.push({weapon: weapon, equiped: false});

    // Ajoute l'objet Player en cours à l'observable.
    Player.player$.next(this);
  }

  /**
   * Ajoute des pièces d'or.
   */
  addGold(gold) {
    this._gold += gold;

    // Ajoute l'objet Player en cours à l'observable.
    Player.player$.next(this);
  }

  /**
   * Retire des pièces d'or.
   */
  removeGold(gold) {
    this._gold -= gold;

    // Ajoute l'objet Player en cours à l'observable.
    Player.player$.next(this);
  }

  /**
   * Ajoute un point d'expérience.
   */
  addXp() {
    this._xp++;

    // Ajoute l'objet Player en cours à l'observable.
    Player.player$.next(this);
  }

}
