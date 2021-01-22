import Monster from './monster.class.js';
import Player from './player.class.js';
import Weapon from './weapon.class.js';
import Pnj from './pnj.class.js';

const APIFILE = '/api.php';

export default class Game {
  
  // Initialisation des propriétés du jeu.
  #player;
  #monster;
  #pnj;
  #name = "";
  #actionNext = document.getElementById("action-next");
  #actionAttack = document.getElementById("action-attack");
  #actionFlee = document.getElementById("action-flee");
  #actionBuy = document.getElementById("action-buy");
  #actionSell = document.getElementById("action-sell");
  #message = document.getElementById("message");

  /**
   * Retourne le nom du jeu.
   */
  getName() {
    return this.#name;
  }

  /**
   * Démarre le jeu et créée le joueur.
   */
  start() {
    this.#player = new Player();
    this.#player.reset();

    // Affiche le message de bienvenue.
    this.displayMessage("Bienvenue hero!");

    // Cache les éléments qui n'aurait pas été caché avant (hack).
    document.getElementById("monster-stand").style.display = "none";
    document.getElementById("pnj-stand").style.display = "none";
    document.getElementById("inventory-pnj").style.display = "none";

    // Affiche le bouton next.
    this.#actionNext.style.display = 'block';
  }

  /**
   * Action du bouton "Suivant" qui déclenche le choix entre la recontre d'un monstre ou d'un PNJ.
   */
  async next() {
    await this.#player.walk();
    this.#actionNext.style.display = 'none';
    const action = Math.floor(Math.random() * 2);
    if (action === 0) {
      await this.interactPnj();
    } else {
      await this.interactMonster();
    }
  }

  /**
   * Rencontrer le PNJ (Crée le PNJ).
   */
  async interactPnj() {
    this.#pnj = new Pnj();
    this.#actionBuy.style.display = 'block';
    this.#actionSell.style.display = 'block';
    this.displayMessage("C'est Guybrush, le marchant pirate. Que faites-vous ?");
  }

  /**
   * Démarrer l'achat avec le PNJ.
   */
  async buyToPnj() {
    this.#actionBuy.style.display = 'none';
    this.#actionSell.style.display = 'none';

    // Vérifie si le joueur a au moins autant d'expérience que le PNJ pour démarrer la négociation.
    if (this.#player.getXp() >= this.#pnj.getXp()) {
      this.#message.innerHTML = "Voici tous les articles que je peux te proposer.";

      // Parcoure l'inventaire du PNG pour l'afficher.
      const ul = document.getElementById("inventory-pnj");
      ul.style.display = "block";
      ul.innerHTML = "";
      this.#pnj.getInventory().map((item, key) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.appendChild(document.createTextNode(item.weapon.getName() + ' '));

        // Pour chaque arme qui n'est pas du PNJ, affiche un bouton permettant d'acheter l'arme au joueur.
        let button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-secondary")
        button.appendChild(document.createTextNode("Acheter"));
        button.setAttribute("id", "inventory-" + key);

        // Ajoute un listener sur chaque bouton permettant de cliquer dessus.
        button.addEventListener('click', (event) => {
          const id = event.target.id;

          // Vérifie si le joueur a suffisamment d'argent pour l'acheter.
          const gold = this.#player.getGold();
          if (gold > item.weapon.getPrice()) {

            // Equipe l'arme au joueur.
            this.#player.addToInventory(item.weapon);
            this.#player.removeGold(item.weapon.getPrice());
            this.displayMessage("Voilà ton arme l'ami. Reviens me voir quand tu veux!");
          } else {
            this.displayMessage("Désolé, trop cher pour toi! A bientôt.");
          }

          // Le joueur revient à sa position initiale.
          document.getElementById("inventory-pnj").style.display = "none";
          (async () => {
            await this.#player.flee();
            this.#pnj.hide();
            this.#pnj = null;
            this.#actionNext.style.display = 'block';
          })();

        });
        li.appendChild(button);
        ul.appendChild(li);
      });
    } else {
      this.#message.innerHTML = "Navré, je peux rien vendre à un novice comme toi, reviens plus tard.";
      await this.#player.flee();
      this.#pnj.hide();
      this.#pnj = null;
      this.#actionNext.style.display = 'block';
    }
  }

  /**
   * Démarrer la ventre avec le PNJ.
   * 
   * TODO.
   */
  async sellToPnj() {
    this.#actionBuy.style.display = 'none';
    this.#actionSell.style.display = 'none';

    // Vérifie si le joueur a au moins autant d'expérience que le PNJ pour démarrer la négociation.
    if (this.#player.getXp() >= this.#pnj.getXp()) {
      this.#message.innerHTML = "J'ai rien envie d'acheter, laisse-moi tranquille.";
      // this.#message.innerHTML = "Que souhaites-tu me vendres l'ami";

      // Retourne au point de départ et le PNJ disparaît.
      await this.#player.flee();
      this.#pnj.hide();
      this.#pnj = null;
      this.#actionNext.style.display = 'block';
    } else {
      this.#message.innerHTML = "Je ne suis pas intéressé par tes pacotilles, reviens quand t'auras plus d'expérience.";
      
      // Retourne au point de départ et le PNJ disparaît.
      await this.#player.flee();
      this.#pnj.hide();
      this.#pnj = null;
      this.#actionNext.style.display = 'block';
    }
  }

  /**
   * Rencontrer avec le monstre (Crée le monstre).
   */
  async interactMonster() {
    this.#monster = new Monster();
    this.#actionAttack.style.display = 'block';
    this.#actionFlee.style.display = 'block';
    this.#message.innerHTML = "Vous êtes face à un monstre de niveau " + this.#monster.getXp() + ". Que faites-vous ?";
  }

  /**
   * Attaque le monstre.
   */
  async attackMonster() {
    this.#actionAttack.style.display = 'none';
    this.#actionFlee.style.display = 'none';
    let monsterWin = false;
    let playerWin = false;

    // Sélectionne aléatoirement qui commence le combat.
    const action = Math.floor(Math.random() * 2);
    if (action === 0) {

      // Le monstre commence à attaquer.
      this.displayMessage("Le monstre vous attaque");
      monsterWin = await this.#monster.attack(this.#player);

      // Si le monstre n'a pas réussi à vaincre le joueur, c'est au joueur d'attaquer.
      if (!monsterWin) {
        this.displayMessage("Vous attaquez le monstre");
        playerWin = await this.#player.attack(this.#monster);
      }
    } else {

      // Le joeur commence à attaquer.
      this.displayMessage("Vous attaquez le monstre");
      playerWin = await this.#player.attack(this.#player);

      // Si le joueur n'a pas réussi à vaincre le monstre, c'est au monstre d'attaquer.
      if (!playerWin) {
        this.displayMessage("Le monstre vous attaque");
        monsterWin = await this.#monster.attack(this.#monster);
      }
    }

    // Vérification, qui a gagné
    if (monsterWin) {

      // Si le monstre gagne, vérifie si le joueur a plus d'une vie restante.
      if (this.#player.getLife() > 1) {

        // Retire un point de vie au joueur.
        this.#player.looseLife();
        this.displayMessage("Le monstre vous a battu, vous perdez un point de vie");
      } else {

        // Sinon termine la partie.
        this.endGame();        
      }
    } else if (playerWin) {

      // Si le joeur gagne, récupère l'arme, les pièces d'or du monstre.
      let message = "";
      const weaponWon = this.#monster.getWeapon();
      const goldWon = this.#monster.getGold();

      // Ajoute l'arme à l'inventaire.
      if (weaponWon.getName()) {
        message = " 1 " + weaponWon.getName() + " et " + goldWon + " pièces d'or";
        this.#player.addToInventory(weaponWon);
      } else {
        message = " aucune arme et " + goldWon + " pièces d'or";
      }

      // Ajoute les pièces d'or et un point d'XP au joueur.
      this.#player.addGold(goldWon);
      this.#player.addXp();
      this.displayMessage("Vous avez battu le monstre et récupérez " + message);
    } else {

      // Match nul.
      this.displayMessage("Match nul, le monstre s'enfuit et vous continuez votre aventure");
    }

    // Retourne au point de départ et le monstre disparaît.
    this.#monster.hide();
    this.#monster = null;
    await this.#player.flee();
    this.#actionNext.style.display = 'block';
  }

  /**
   * Fuit le monstre.
   */
  async fleeMonster() {
    this.#actionAttack.style.display = 'none';
    this.#actionFlee.style.display = 'none';

    // Retire un point d'expérience au joueur.
    this.#player.looseXp();
    this.displayMessage("Vous avez perdu 1 point d'expérience");

    // Retourne au point de départ et le monstre disparaît.
    await this.#player.flee();
    this.#monster.hide();
    this.#monster = null;
    this.#actionNext.style.display = 'block';
  }

  /**
   * Affiche un message.
   */
  displayMessage(message) {
    this.#message.innerHTML = message;
  }

  /**
   * Retourne la liste de toutes les sauvegardes
   */
  async list() {
    // Lance une requête au serveur.
    return fetch(APIFILE + '?list=0', {
      method: "GET",
    }).then(response => {
      return response.json()
    }).then(json => {
      return json;
    })
    .catch(error => console.error(error));
  }

  /**
   * Charge la dernière partie sauvegardée.
   */
  async load(name) {
    // Lance une requête au serveur.
    return fetch(APIFILE + '?load=' + name, {
      method: "GET",
    }).then(response => {
      return response.json()
    }).then(json => {

      // Une fois les données récupées, crée le joueur.
      this.#player = new Player();

      // Prépare l'inventaire.
      const inventory = json.inventory.map(i => {
        const weapon = new Weapon();
        weapon.set(
          i.weapon.name,
          parseInt(i.weapon.str, 10),
          parseInt(i.weapon.sta, 10),
          parseInt(i.weapon.price, 10)
        );
        return {weapon, equiped: i.equiped === "1"};
      });

      // Assigne les données au nouveau joueur créé.
      this.#player.set(
        json.name,
        parseInt(json.life, 10),
        parseInt(json.xp, 10),
        parseInt(json.str, 10),
        parseInt(json.sta, 10),
        parseInt(json.gold, 10),
        inventory
      );

      // Affiche le message de bienvenue.
      this.displayMessage("Heureux de te revoir " + name + "!");
      this.#actionNext.style.display = 'block';

      // Cache les éléments qui n'aurait pas été caché avant (hack).
      document.getElementById("monster-stand").style.display = "none";
      document.getElementById("pnj-stand").style.display = "none";
      document.getElementById("inventory-pnj").style.display = "none";

      // Ajoute l'objet Player en cours à l'observable.
      Player.player$.next(this.#player);
    })
    .catch(error => console.error(error));
  }

  /**
   * Sauvegarde la partie en cours.
   */
  async save(name) {
    this.displayMessage("");

    // Prépare les données qui seront envoyées au serveur.
    const data = {
      name,
      life: this.#player.getLife(),
      xp: this.#player.getXp(),
      str: this.#player.getStr(),
      sta: this.#player.getSta(),
      weapon: this.#player.getWeapon().getObject(),
      inventory: this.#player.getInventoryObject(),
      gold: this.#player.getGold(),
    };

    // Lance une requête au serveur.
    return fetch(APIFILE, {
      method: "POST",
      body: JSON.stringify(data),
      mode: "same-origin",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      this.displayMessage("La partie a été sauvegardée");
      return response.json();
    }).then(json => json.id)
    .catch(error => console.error(error));
  }

  /**
   * Retourne le nom du joueur.
   */
  getPlayerName() {
    return this.#player.getName();
  }

  /**
   * Fin de partie.
   */
  async endGame() {
    this.displayMessage("Vous avez perdu!");
    await this.wait(2000);
    document.getElementById("intro").style.display = 'block';
    document.getElementById("start-page").style.display = 'block';
    document.getElementById("load-page").style.display = 'none';
    document.getElementById("save-page").style.display = 'none';
  }

  /**
   * Attends un certain temps (async => synchrone).
   */
  async wait(time) {
    return new Promise(resolve => {setTimeout(resolve, time);});
  }

}