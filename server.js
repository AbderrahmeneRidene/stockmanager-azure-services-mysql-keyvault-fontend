const express = require('express');
const path = require('path');

const app = express();

// Sert le contenu buildé Angular
app.use(express.static(path.join(__dirname, 'dist/stockmanager-front-css/browser')));

// Redirige toutes les routes vers index.html (SPA)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/stockmanager-front-css/browser/index.html'));
});

// Démarre le serveur
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
