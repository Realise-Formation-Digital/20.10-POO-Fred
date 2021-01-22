import Game from './class/game.class.js';
import Player from './class/player.class.js';

const game = new Game();

// Clic sur "Action start" pour démarrer le jeu".
document.getElementById("action-start").addEventListener("click", () => {
  document.getElementById("intro").style.display = 'none';
  game.start();
});

// Clic sur "Action List" pour lister les sauvegarder existantes à charger".
document.getElementById("action-list").addEventListener("click", () => {
  document.getElementById("start-page").style.display = 'none';
  document.getElementById("save-page").style.display = 'none';
  document.getElementById("load-page").style.display = 'block';
  (async () => {

    /// Récupère la liste des sauvegardes.
    const names = await game.list();
    const ul = document.getElementById("list-saved");
    ul.innerHTML = "";

    // Construit la liste HTML en affichant le nom de chaque sauvegarde.
    names.map((item) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.appendChild(document.createTextNode(item.name));
      li.setAttribute("id", "load-" + item.name);

      // Ajoute un listener sur chaque élément de liste permettant de cliquer dessus.
      li.addEventListener('click', (event) => {
        const id = event.target.id;

        // Lance le chargement de la sauvegarde choisie.
        game.load(id.split('-')[1]);
        document.getElementById("intro").style.display = 'none';
      });
      ul.appendChild(li);
    });
  })();
});

// Clic sur "Action start page" pour retourner sur la page d'accueil.
document.getElementById("action-startpage").addEventListener("click", () => {
  document.getElementById("load-page").style.display = 'none';
  document.getElementById("save-page").style.display = 'none';
  document.getElementById("start-page").style.display = 'block';
});

// Clic sur "Action save page" pour afficher la page permettant de sauvegarder la partie.
document.getElementById("action-savepage").addEventListener("click", () => {
  document.getElementById("intro").style.display = 'block';
  document.getElementById("load-page").style.display = 'none';
  document.getElementById("start-page").style.display = 'none';
  document.getElementById("save-page").style.display = 'block';

  // Affiche le nom, si la personne sauvegarde une partie qui a préalablement été chargée.
  document.getElementById("save-name").value = game.getPlayerName();
});

// Clic sur "Action save" pour lancer la sauvegarde du jeu.
document.getElementById("action-save").addEventListener("click", () => {
  const name = document.getElementById("save-name").value;
  (async () => {
    await game.save(name);
    document.getElementById("intro").style.display = 'none';
  })();
});

// Clic sur "Action exit" pour revenir sur la page d'accueil.
document.getElementById('action-exit').addEventListener("click", () => {
  document.getElementById("intro").style.display = 'block';
  document.getElementById("start-page").style.display = 'block';
  document.getElementById("load-page").style.display = 'none';
  document.getElementById("save-page").style.display = 'none';
});

// Clic sur "Action next" pour lancer la prochaine action du joueur.
document.getElementById("action-next").addEventListener("click", () => {
  (async () => {
    await game.next();
  })();
});

// Clic sur "Action flee" pour lancer la fuite du joueur face à un monstre.
document.getElementById("action-flee").addEventListener("click", () => {
  (async () => {
    await game.fleeMonster();
  })();
});

// Clic sur "Action leave" pour quitter le PNJ.
document.getElementById("action-leave").addEventListener("click", () => {
  (async () => {
    await game.leavePNJ();
  })();
});

// Clic sur "Action attack" pour lancer l'attaque du joueur face à un monstre.
document.getElementById("action-attack").addEventListener("click", () => {
  (async () => {
    await game.attackMonster();
  })();
});

// Clic sur "Action buy" pour lancer la demander d'achat du joueur face à un PNJ.
document.getElementById("action-buy").addEventListener("click", () => {
  (async () => {
    await game.buyToPnj();
  })();
});

// Clic sur "Action sell" pour lancer la demander de vente du joueur face à un PNJ.
document.getElementById("action-sell").addEventListener("click", () => {
  (async () => {
    await game.selectWeaponToSell();
  })();
});

// Souscrit l'observable joueur => A chaque changement du joueur, lancé par la méthode next(), les données vont être raffraichies.
Player.player$.subscribe(player => {
  if (player) {
    const ul = document.getElementById("inventory");
    ul.innerHTML = "";

    // Construit la liste HTML en affichant la liste de l'inventaire.
    player.getInventory().map((item, key) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.setAttribute("id", "itemselect-" + key);
      li.appendChild(document.createTextNode(item.weapon.getName() + ' '));

      // Pour chaque arme qui n'est pas équipée, affiche un bouton permettant d'équiper l'arme au joueur.
      if (!item.equiped) {
        let button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-secondary");
        button.classList.add("equip");
        button.appendChild(document.createTextNode("Equiper"));
        button.setAttribute("id", "inventory-" + key);

        // Ajoute un listener sur chaque bouton permettant de cliquer dessus.
        button.addEventListener('click', (event) => {
          const id = event.target.id;

          // Equipe l'arme au joueur.
          player.setEquipedWeapon(parseInt(id.split('-')[1], 10));
        });
        li.appendChild(button);
      }
      ul.appendChild(li);
    });

    // Récupère les autres caractéristiques du joueur pour les afficher.
    const weaponStr = player.getWeapon().getStr();
    const weaponSta = player.getWeapon().getSta();
    document.getElementById("player-life").innerHTML = player.getLife();
    document.getElementById("player-xp").innerHTML = player.getXp();
    document.getElementById("player-str").innerHTML = player.getStr() + (weaponStr ? ' (+' + weaponStr + ')' : '');
    document.getElementById("player-sta").innerHTML = player.getSta() + (weaponSta ? ' (+' + weaponSta + ')' : '');
    document.getElementById("player-gold").innerHTML = player.getGold() + " ";
    document.getElementById("player-weapon").innerHTML = player.getWeapon().getName();

    if (player.getGold() > 100) {
      let buttonAddXP = document.createElement("button");
      buttonAddXP.classList.add("btn");
      buttonAddXP.classList.add("btn-secondary");
      buttonAddXP.appendChild(document.createTextNode("+1 XP"));
      buttonAddXP.setAttribute("id", "addXP");
      
      // Ajoute un listener sur le bouton permettant de cliquer dessus.
      buttonAddXP.addEventListener('click', (event) => {

        // Ajoute un point d'expérience au joueur. 
        player.removeGold(100);
        player.addXp()
      });

      document.getElementById("player-gold").appendChild(buttonAddXP);
    }
  }
});
