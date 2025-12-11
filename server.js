import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
function saveDB() {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}
app.get('/', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CookBook Database Explorer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; margin-bottom: 30px; text-align: center; }
    .db-explorer { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .collection { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px; }
    .collection h2 { color: #e74c3c; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #e74c3c; padding-bottom: 10px; }
    .items-list { max-height: 400px; overflow-y: auto; }
    .item { background: #f9f9f9; padding: 10px; margin: 8px 0; border-radius: 4px; border-left: 3px solid #e74c3c; word-break: break-all; font-size: 12px; }
    .count { background: #e74c3c; color: white; display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
    pre { background: #f0f0f0; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 11px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 CookBook Database Explorer</h1>
    <div class="db-explorer" id="explorer"></div>
  </div>

  <script>
    async function loadDB() {
      try {
        const response = await fetch('/db-data');
        const db = await response.json();
        
        const explorer = document.getElementById('explorer');
        explorer.innerHTML = '';
        
        for (const [key, items] of Object.entries(db)) {
          const collection = document.createElement('div');
          collection.className = 'collection';
          collection.innerHTML = \`
            <h2>\${key} <span class="count">\${Array.isArray(items) ? items.length : Object.keys(items).length}</span></h2>
            <div class="items-list">
              <pre>\${JSON.stringify(items, null, 2)}</pre>
            </div>
          \`;
          explorer.appendChild(collection);
        }
      } catch (error) {
        console.error('Error loading DB:', error);
      }
    }
    
    loadDB();
    setInterval(loadDB, 2000); // Refresh every 2 seconds
  </script>
</body>
</html>
  `;
  res.type('html').send(html);
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.get('/db-data', (req, res) => {
  res.json(db);
});
app.get('/recipes', (req, res) => {
  res.json(db.recipes);
});
app.get('/recipes/:id', (req, res) => {
  const recipe = db.recipes.find(r => r.id === req.params.id);
  if (recipe) res.json(recipe);
  else res.status(404).json({ error: 'Recipe not found' });
});

app.post('/recipes', (req, res) => {
  const newRecipe = {
    id: Date.now().toString(),
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.recipes.push(newRecipe);
  saveDB();
  res.status(201).json(newRecipe);
});

app.put('/recipes/:id', (req, res) => {
  const index = db.recipes.findIndex(r => r.id === req.params.id);
  if (index !== -1) {
    db.recipes[index] = {
      ...db.recipes[index],
      ...req.body,
      updated_at: new Date().toISOString(),
    };
    saveDB();
    res.json(db.recipes[index]);
  } else {
    res.status(404).json({ error: 'Recipe not found' });
  }
});

app.delete('/recipes/:id', (req, res) => {
  const index = db.recipes.findIndex(r => r.id === req.params.id);
  if (index !== -1) {
    db.recipes.splice(index, 1);
    saveDB();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Recipe not found' });
  }
});

// FAVORITES ENDPOINTS
app.get('/favorites', (req, res) => {
  res.json(db.favorites || []);
});

app.post('/favorites', (req, res) => {
  const newFavorite = {
    id: Date.now().toString(),
    recipeId: req.body.recipeId,
    title: req.body.title,
    image_url: req.body.image_url,
  };
  if (!db.favorites) db.favorites = [];
  db.favorites.push(newFavorite);
  saveDB();
  res.status(201).json(newFavorite);
});

app.delete('/favorites/:id', (req, res) => {
  if (!db.favorites) db.favorites = [];
  const index = db.favorites.findIndex(f => f.id === req.params.id);
  if (index !== -1) {
    db.favorites.splice(index, 1);
    saveDB();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Favorite not found' });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ JSON Server is running`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`\n📚 Available endpoints:`);
  console.log(`   GET    /recipes`);
  console.log(`   GET    /recipes/:id`);
  console.log(`   POST   /recipes`);
  console.log(`   PUT    /recipes/:id`);
  console.log(`   DELETE /recipes/:id`);
  console.log(`   GET    /favorites`);
  console.log(`   POST   /favorites`);
  console.log(`   DELETE /favorites/:id\n`);
});
