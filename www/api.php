<?php

  // Définit les constantes de connexion.
  define("HOST", "maria_db");
  define("DATABASE", "combatgentil_db");
  define("USER", "CF");
  define("PASSWORD", "digital2021");

  // Crée l'objet database.
  $db = new Database(HOST, DATABASE, USER, PASSWORD);

  // Vérifie le content type de la variable $_SERVER
  $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

  // S'il s'agit d'un appel JSON, récupère le JSON et effectue la sauvegarde.
  if ($contentType === "application/json") {

    // Récupère le POST data (petit tricks : https://codepen.io/dericksozo/post/fetch-api-json-php).
    $content = trim(file_get_contents("php://input"));

    // Transforme le JSON en objet PHP.
    $decoded = json_decode($content, true);

    // Vérifie si le JSON est correct.
    if (is_array($decoded)) {
      // Sauvegarde l'application.
      try {
        echo json_encode($db->save($decoded));
      } catch(PDOException $Exception) {
        echo json_encode(['error' => 'Une erreur est survenue lors de la sauvegarde']); 
      }
    } else {
      echo json_encode(['error' => 'Problème dans la requête']); 
    }
  } elseif (isset($_GET['list'])) {
    // Retourne les sauvegardes disponibles.
    echo json_encode($db->list());
  } elseif (isset($_GET['load'])) {
    // Charge le jeu
    echo json_encode($db->load($_GET['load']));
  } else {
    echo json_encode(['error' => 'Problème dans la requête']);
  }


  /**
   * Class Database
   */
  class Database {

    private $pdo;

    /**
     * Initialise la base de données.
     */ 
    public function __construct($host, $database, $user, $password) {
      $dsn = "mysql:host=$host;dbname=$database";
      $this->pdo = new PDO($dsn, $user, $password);
      $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    /**
     * Sauvegarde les données dans la base de données.
     */ 
    public function save($player) {

      try {
        $playerObj = (object) $player;

        // Vide préalablement les données du joueur.
        $result = $this->pdo->query("SELECT id FROM `player` WHERE name = '$playerObj->name'")->fetch(PDO::FETCH_OBJ);
        if ($result) {
          $this->pdo->prepare("DELETE FROM playerweapon WHERE idplayer = " . $result->id)->execute();
          $this->pdo->prepare("DELETE FROM player WHERE id = " . $result->id)->execute();
        }

        // Insérer le joueur.
        $this->pdo->prepare("INSERT INTO `player` (name, life, xp, str, sta, gold)
                              VALUES (?, ?, ?, ?, ?, ?)")
                  ->execute([$playerObj->name, $playerObj->life, $playerObj->xp, $playerObj->str, $playerObj->sta, $playerObj->gold]);
        $playerObj->id = $this->pdo->lastInsertId();

        // Insérer les armes du joueur.
        $active_weapon_id = null;
        $equiped_weapon_found = null;
        
        foreach($playerObj->inventory as $item) {
          $weaponObj = (object) $item['weapon'];
          $this->pdo->prepare("INSERT INTO `weapon` (name, str, sta, price)
                              VALUES (?, ? , ?, ?)")
                    ->execute([$weaponObj->name, $weaponObj->str, $weaponObj->sta, $weaponObj->price]);
          $weaponObj->id = $this->pdo->lastInsertId();

          // Vérifie s'il s'agit de l'arme équipée.
          $is_active_weapon = $item['equiped'] ? 1 : 0;

          // Insérer le lien entre les armes et le joueur.
          $this->pdo->prepare("INSERT INTO playerweapon (idplayer, idweapon, equiped)
                              VALUES (?, ?, ?)")
                    ->execute([$playerObj->id, $weaponObj->id, $is_active_weapon]);
        }


        return $playerObj;
      } catch(PDOException $Exception) {
        throw $Exception;
      }
    }

    /**
     * Liste les jeux sauvegardés.
     */ 
    public function list() {
      try {

        // Récupère le nom de tous les joueurs.
        $games = $this->pdo->query("SELECT name FROM `player`")->fetchAll(PDO::FETCH_OBJ);

        // Retourne la liste des noms.
        return $games;
      } catch(PDOException $Exception) {
        throw $Exception;
      }
    }

    /**
     * Charge les données depuis la base de données.
     */ 
    public function load($name) {
      try {

        // Récupère les données du joueur.
        $player = $this->pdo->query("SELECT * FROM `player` WHERE name = '$name'")->fetch(PDO::FETCH_OBJ);

        // Récupère les armes du joueurs.
        $playerWeapons = $this->pdo->query("SELECT w.*, pw.equiped FROM `playerweapon` pw 
                                            INNER JOIN `weapon` w ON pw.idweapon = w.id
                                            WHERE pw.idplayer = $player->id")->fetchAll(\PDO::FETCH_OBJ);

        // Ajoute les armes trouvé à l'inventaire.
        $player->inventory = [];
        foreach($playerWeapons as $item) {
          $player->inventory[] = ['weapon' => ['name' => $item->name,
                                               'str' => $item->str,
                                               'sta' => $item->sta,
                                               'price' => $item->price
                                              ],
                                  'equiped' => $item->equiped
                                 ];
        }

        // Retourne le joueur.
        return $player;
      } catch(PDOException $Exception) {
        throw $Exception;
      }
    }

  }

