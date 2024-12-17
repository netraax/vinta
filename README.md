# Vinted Analyzer

Un outil d'analyse de texte Vinted avec une interface modulaire.

## Prérequis

- Node.js (version 12 ou supérieure)

## Installation

1. Clonez ce dépôt
2. Ouvrez un terminal dans le dossier du projet

## Démarrage

1. Lancez le serveur :
```bash
node server.js
```

2. Ouvrez votre navigateur et accédez à :
```
http://localhost:3000
```

## Structure du Projet

```
/vinta/
  ├── index.html          # Page principale
  ├── server.js           # Serveur local
  ├── package.json        # Configuration du projet
  └── /src/              # Code source
      ├── main.js        # Point d'entrée
      ├── analyzer.js    # Logique d'analyse
      ├── dataStore.js   # Gestion des données
      ├── regexPatterns.js # Patterns d'extraction
      ├── uiManager.js   # Gestion de l'interface
      └── /modules/      # Modules d'analyse
          └── ProfileModule.js
```

## Utilisation

1. Collez votre texte Vinted dans la zone de texte
2. Cliquez sur "Analyser"
3. Visualisez les résultats dans le dashboard
