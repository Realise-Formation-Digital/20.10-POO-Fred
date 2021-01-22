export default class Perso {

  // Initialisation des propriétés du personnage.
  _name = "";
  _life = 0;
  _xp = 0;
  _str = 0;
  _sta = 0;
  _gold = 0;
  _inventory = [];
  _stand;
  _attack;

  /**
   * Retourne le nom du joueur. 
   */
  getName() {
    return this._name;
  }

  /**
   * Retourne le nombre de vie. 
   */
  getLife() {
    return this._life;
  }

  /**
   * Retourne le nombre de point d'expérience.
   */
  getXp() {
    return this._xp;
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
   * Retourne le nombre de pièce d'or.
   */
  getGold() {
    return this._gold;
  }

  /**
   * Retourne le contenu de l'inventaire.
   */
  getInventory() {
    return this._inventory;
  }

  /**
   * Fait bouger le personnage (async => synchrone).
   */
  async move(element, to, pos, walkRight) {

    // Retourne une promesse.
    return await new Promise(resolve => {
      let i = 0;
      let step = 5;
      let time = 100;

      // Lance l'intervale de marche pendant un certain temps
      const idInterval = setInterval(walk, time);

      // Fonction qui lance la marche (callback qui retourne une promesse).
      function walk() { 
        if (i < to) {
          pos = walkRight ? pos + step: pos - step;
          element.style.left = pos + 'px';
        } else {
          clearInterval(idInterval);
          resolve(pos);
        }
        i++;
      };

    });
  }

  /**
   * Attaque un opposant.
   */
  async attack(opponent) {
    this.show(this._stand, false);
    this.reloadAnim(this._attack);
    this.show(this._attack, true);
    await this.wait(2000);
    this.show(this._attack, false);
    this.show(this._stand, true);
    return this.checkWhoWon(opponent);
  }

  /**
   * Vérifie qui a gagné entre le personnage ou son opposant.
   */
  checkWhoWon(opponent) {
    const currentStrength = this._str + this.getWeapon().getStr();
    const opponentStamina = opponent.getSta() + opponent.getWeapon().getSta();
    return currentStrength > opponentStamina;
  }

  /**
   * Affiche ou cache un élément graphique du personnage.
   */
  show(element, show = false) {
    element.style.display = show ? 'block' : 'none';
  }

  /**
   * Cache l'élément graphique "stand" du personnage.
   */
  hide() {
    this.show(this._stand, false);
  }

  /**
   * Recharge l'animation d'une image GIF.
   */
  reloadAnim(element) {
    const src = element.src.split('?');
    element.src = src[0] + "?x=" + Math.floor(Math.random() * 100000);
  }

  /**
   * Attends un certain temps (async => synchrone).
   */
  async wait(time) {
    return new Promise(resolve => {setTimeout(resolve, time);});
  }

}
