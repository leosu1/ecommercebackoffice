# ecommercebackoffice

Une application web de démonstration de back office en nodejs avec expressjs.

## Utilisation de l'application :

- Des fichiers *.sql* sont fournies dans le dossier *db_building*.
- Créer votre base de données **mysql** et appelez la comme vous voulez.
- Dans un terminal ouvert dans le repertoire de l'application, taper la commande :

    `mysql -u *votrenomdutilisateur* -p *nom_de_la_bdd* < db_building/ecommerceapp.sql`

- Pour ajouter des données de test, dans le même terminal, taper la commande :

    `mysql -u *votrenomdutilisateur* -p *nom_de_la_bdd* < db_building/ecommerceappdump.sql`

- A la racine du répertoire, créer un fichier *.env* dans lequel il faut renseigner les données suivantes :

    > DATABASE_NAME = "*nom_de_la_bdd*"\
      DATABASE_USERNAME = "*nom_d_utilisateur_de_la_bdd*"\
      DATABASE_PASSWORD = "*mot_de_passe_de_la_bdd*"\
      DATABASE_HOST = "*port_ou_hote_de_la_bdd*"

- Installer les dépendances à l'aide de **npm** avec la commande :

    `npm install`

- Une fois la base de données créée et configurée, les dépendances installées, taper la commande :

    `npm run dev`

- L'application démarera alors à l'adresse 

    `localhost:3000/`

**- Vous pouvez maintenant vous créer un compte et commencer à manipuler les données de la base de données!** 

## Documentation de l'application

Le code est séparée en 2 principales parties :

**Front end dans le dossier views**
**Back end dans le dossier src**

### Le back end:
- Le fichier *db_utils.js* comprend toutes les fonctions necessaires à la gestion de la base de données. Dans le fichier, les fonctions sont séparées par des commentaires et catégorisées selon la table sur laquelle elles interviennent. La gestion de la base de données est faite avec le package *mysql2*.

- Le fichier *form_validators.js* comprend tous les middlewares dont le but est de traiter les données envoyées par l'utilisateur et s'assurer que les données soient conformes pour ensuite les envoyer en base de données. Ceci est fait avec le package *express-validator*. Si les données ne sont pas validées, l'utilisateur est redirigée vers une page d'erreur avec un code 400.

- Le fichier *middlewares.js* comprend tous les middlewares globaux, qui sont utilisées à travers toute l'application. Pour l'instant seulement un seul; celui qui vérifie l'authentification. L'authentification à travers le site fonctionne grâce à un système de sessions à l'aide de *express-session*:
    - A chaque requête de l'utilisateur, le middleware commence par vérifier si c'est une route protégée. Si c'est le cas, il vérifie ensuite qu'un utilisateur est présent dans la session. Si c'est le cas, il vérifie enfin que l 'utilisateur dans la session est bien un utilisateur présent dans la base de données.
    - Si toutes ces conditions sont respectées, l'utilisateur peut accéder à la page demandée, sinon, il est redirigé vers une page d'erreur avec un code 403.

- Le fichier *app.js* est le fichier principal du fonctionnement de l'application. C'est dans ce fichier que les routes sont déclarées, que les middlewares sont mis en places et que toutes les fonctions des fichiers précédents sont appelées. C'est aussi dans ce fichier que la gestion des routes et leur logique est faite.

### Le front end:
Le front end est fait grâce au moteur de template *ejs*. On a une template par page, qui est appelé dans sa route respective. De manière générale le nom de chaque template reflète la route à laquelle elle correspond. Dans la logique de la route des données sont ensuite envoyées à la template (généralement les données demandées à la base de données) et traitées dans la template.

Dans le futur il est possible d'intégrer du css grâce à tailwind en injection javascript, il n'y aurait pas besoin de dossier public, pour une application de cette taille, c'est suffisant.
