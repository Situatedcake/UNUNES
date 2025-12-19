import express from 'express';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Data files
const usersFile = path.join(__dirname, 'data', 'users.json');
const productsFile = path.join(__dirname, 'data', 'products.json');
const cartFile = path.join(__dirname, 'data', 'cart.json');
const sessionsFile = path.join(__dirname, 'data', 'sessions.json');

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Helper functions
const ensureDataDir = () => {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const readJSON = (filePath, defaultValue = []) => {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return defaultValue;
  }
};

const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Initialize data
ensureDataDir();

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  const users = readJSON(usersFile, []);

  if (users.find(u => u.email === email || u.username === username)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: uuidv4(),
    username,
    email,
    password, // In production, hash this!
    createdAt: new Date().toISOString(),
    isAdmin: false
  };

  users.push(newUser);
  writeJSON(usersFile, users);

  const sessionId = uuidv4();
  const sessions = readJSON(sessionsFile, {});
  sessions[sessionId] = { userId: newUser.id, createdAt: new Date().toISOString() };
  writeJSON(sessionsFile, sessions);

  res.cookie('sessionId', sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ success: true, user: { id: newUser.id, username, email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = readJSON(usersFile, []);
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const sessionId = uuidv4();
  const sessions = readJSON(sessionsFile, {});
  sessions[sessionId] = { userId: user.id, createdAt: new Date().toISOString() };
  writeJSON(sessionsFile, sessions);

  res.cookie('sessionId', sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ success: true, user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('sessionId');
  res.json({ success: true });
});

app.get('/api/auth/user', (req, res) => {
  const { sessionId } = req.cookies;
  if (!sessionId) return res.json({ user: null });

  const sessions = readJSON(sessionsFile, {});
  const session = sessions[sessionId];
  if (!session) return res.json({ user: null });

  const users = readJSON(usersFile, []);
  const user = users.find(u => u.id === session.userId);
  if (!user) return res.json({ user: null });

  res.json({ user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
});

// Products Routes
app.get('/api/products', (req, res) => {
  const products = readJSON(productsFile, []);
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const { sessionId } = req.cookies;
  const sessions = readJSON(sessionsFile, {});
  const session = sessions[sessionId];
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const users = readJSON(usersFile, []);
  const user = users.find(u => u.id === session.userId);
  if (!user || !user.isAdmin) return res.status(403).json({ error: 'Forbidden' });

  const { name, price, description, image, category } = req.body;
  const products = readJSON(productsFile, []);
  const newProduct = {
    id: uuidv4(),
    name,
    price,
    description,
    image,
    category,
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);
  writeJSON(productsFile, products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const { sessionId } = req.cookies;
  const sessions = readJSON(sessionsFile, {});
  const session = sessions[sessionId];
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const users = readJSON(usersFile, []);
  const user = users.find(u => u.id === session.userId);
  if (!user || !user.isAdmin) return res.status(403).json({ error: 'Forbidden' });

  const products = readJSON(productsFile, []);
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });

  products[productIndex] = { ...products[productIndex], ...req.body, id: req.params.id };
  writeJSON(productsFile, products);
  res.json(products[productIndex]);
});

app.delete('/api/products/:id', (req, res) => {
  const { sessionId } = req.cookies;
  const sessions = readJSON(sessionsFile, {});
  const session = sessions[sessionId];
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const users = readJSON(usersFile, []);
  const user = users.find(u => u.id === session.userId);
  if (!user || !user.isAdmin) return res.status(403).json({ error: 'Forbidden' });

  const products = readJSON(productsFile, []).filter(p => p.id !== req.params.id);
  writeJSON(productsFile, products);
  res.json({ success: true });
});

// Cart Routes
app.get('/api/cart', (req, res) => {
  const { sessionId } = req.cookies;
  const sessions = readJSON(sessionsFile, {});
  const session = sessions[sessionId];
  if (!session) return res.json([]);

  const carts = readJSON(cartFile, {});
  res.json(carts[session.userId] || []);
});

app.post('/api/cart', (req, res) => {
  const { sessionId } = req.cookies;
  const sessions = readJSON(sessionsFile, {});
  const session = sessions[sessionId];
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const { productId, quantity } = req.body;
  const carts = readJSON(cartFile, {});
  if (!carts[session.userId]) carts[session.userId] = [];

  const existingItem = carts[session.userId].find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[session.userId].push({ productId, quantity, addedAt: new Date().toISOString() });
  }

  writeJSON(cartFile, carts);
  res.json(carts[session.userId]);
});

app.delete('/api/cart/:productId', (req, res) => {
  const { sessionId } = req.cookies;
  const sessions = readJSON(sessionsFile, {});
  const session = sessions[sessionId];
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const carts = readJSON(cartFile, {});
  if (carts[session.userId]) {
    carts[session.userId] = carts[session.userId].filter(item => item.productId !== req.params.productId);
    writeJSON(cartFile, carts);
  }

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
