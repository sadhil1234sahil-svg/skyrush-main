import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Determine active mode based on MONGODB_URI presence
const MONGODB_URI = process.env.MONGODB_URI;
const useMongo = !!MONGODB_URI;
const localDataPath = path.join(__dirname, '..', 'data', 'content.json');

console.log(`Backend mode selected: ${useMongo ? 'MongoDB Atlas (Production)' : 'Local File System (Development Fallback)'}`);

// MongoDB connection cache variables
let dbClient = null;
let dbInstance = null;

async function getDb() {
  if (!useMongo) return null;
  if (dbInstance) return dbInstance;

  try {
    dbClient = await MongoClient.connect(MONGODB_URI);
    dbInstance = dbClient.db();
    console.log('✔ Successfully connected to MongoDB Atlas database.');
    return dbInstance;
  } catch (err) {
    console.error('❌ MongoDB Atlas Connection Error:', err);
    throw err;
  }
}

// In-memory local session store (used in local JSON mode only)
const activeSessionsLocal = new Map();

// Hashing Utilities (identical to original structure to maintain password compatibility)
const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex');
};

const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
};

const verifyPassword = (password, salt, hash) => {
  return hashPassword(password, salt) === hash;
};

// Database seeding helper
async function seedDatabaseIfNeeded(db) {
  try {
    // 1. Seed website content
    const contentColl = db.collection('content');
    const contentCount = await contentColl.countDocuments({ key: 'site_content' });
    
    if (contentCount === 0) {
      if (fs.existsSync(localDataPath)) {
        const rawData = fs.readFileSync(localDataPath, 'utf8');
        const parsedData = JSON.parse(rawData);
        const siteContent = { ...parsedData };
        delete siteContent.users; // separated into users collection
        siteContent.key = 'site_content';
        await contentColl.insertOne(siteContent);
        console.log('✔ Seeded default website content to MongoDB Atlas.');
      } else {
        console.warn('⚠ Local content.json fallback not found. Starting with empty website database.');
      }
    }

    // 2. Seed default system users
    const usersColl = db.collection('users');
    const usersCount = await usersColl.countDocuments();
    
    if (usersCount === 0) {
      let defaultUsers = [
        { username: 'admin', password: 'skyrush2026', role: 'super_admin' },
        { username: 'blogger', password: 'blogger2026', role: 'blogger' },
        { username: 'manager', password: 'skyrush2026', role: 'tour_visa' }
      ];

      if (fs.existsSync(localDataPath)) {
        try {
          const rawData = fs.readFileSync(localDataPath, 'utf8');
          const parsedData = JSON.parse(rawData);
          if (parsedData.users && Array.isArray(parsedData.users) && parsedData.users.length > 0) {
            defaultUsers = parsedData.users;
          }
        } catch (e) {
          console.warn('Could not parse users from local content.json. Using standard default users.');
        }
      }

      // Hash plain-text accounts during migration
      const processedUsers = defaultUsers.map(u => {
        if (u.password) {
          const salt = generateSalt();
          const hash = hashPassword(u.password, salt);
          return {
            username: u.username,
            salt,
            hash,
            role: u.role
          };
        }
        return u;
      });

      await usersColl.insertMany(processedUsers);
      console.log('✔ Seeded default user accounts to users collection in MongoDB Atlas.');
    }
  } catch (err) {
    console.error('❌ Error seeding MongoDB database:', err);
  }
}

// Perform initial connection check and seeding if in MongoDB mode
if (useMongo) {
  getDb().then(async (db) => {
    if (db) {
      await seedDatabaseIfNeeded(db);
    }
  }).catch(err => {
    console.error('❌ Initial DB seeding failed:', err);
  });
}

// Session lookup helper
const getSession = async (token) => {
  if (useMongo) {
    const db = await getDb();
    return await db.collection('sessions').findOne({ token });
  } else {
    return activeSessionsLocal.get(token);
  }
};

// Express authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return res.status(401).json({ error: 'Access Denied: No session token provided.' });
  }
  
  try {
    const session = await getSession(token);
    if (!session) {
      return res.status(403).json({ error: 'Access Denied: Invalid or expired session token.' });
    }
    
    req.user = session; // Attach user metadata to request
    next();
  } catch (err) {
    console.error('Authentication Error:', err);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
};

// API Route: Get website content (Public)
app.get('/api/content', async (req, res) => {
  try {
    if (useMongo) {
      const db = await getDb();
      const content = await db.collection('content').findOne({ key: 'site_content' });
      if (!content) {
        return res.status(404).json({ error: 'Website content database entry not found.' });
      }
      const publicContent = { ...content };
      delete publicContent._id;
      delete publicContent.key;
      res.json(publicContent);
    } else {
      // Local development mode
      if (!fs.existsSync(localDataPath)) {
        return res.status(404).json({ error: 'Local data file content.json not found.' });
      }
      const raw = fs.readFileSync(localDataPath, 'utf8');
      const data = JSON.parse(raw);
      const publicContent = { ...data };
      delete publicContent.users; // Hide users array from public response
      res.json(publicContent);
    }
  } catch (err) {
    console.error('GET /api/content Error:', err);
    res.status(500).json({ error: 'Failed to retrieve website content.' });
  }
});

// API Route: Update website content (Authenticated)
app.post('/api/content', authenticateToken, async (req, res) => {
  const newContent = req.body;
  if (!newContent || typeof newContent !== 'object') {
    return res.status(400).json({ error: 'Invalid content data payload' });
  }

  try {
    if (useMongo) {
      const db = await getDb();
      // Remove database key parameters
      delete newContent._id;
      delete newContent.key;
      delete newContent.users;

      await db.collection('content').updateOne(
        { key: 'site_content' },
        { $set: newContent },
        { upsert: true }
      );
      res.json({ message: 'Content saved successfully!', content: newContent });
    } else {
      // Local development mode
      if (!fs.existsSync(localDataPath)) {
        return res.status(500).json({ error: 'Local database file not initialized.' });
      }
      const raw = fs.readFileSync(localDataPath, 'utf8');
      const existingData = JSON.parse(raw);
      newContent.users = existingData.users || []; // Preserve users list

      fs.writeFileSync(localDataPath, JSON.stringify(newContent, null, 2), 'utf8');
      res.json({ message: 'Content saved successfully!', content: newContent });
    }
  } catch (err) {
    console.error('POST /api/content Error:', err);
    res.status(500).json({ error: 'Failed to save configuration modifications.' });
  }
});

// API Route: User Authentication Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    let user = null;
    if (useMongo) {
      const db = await getDb();
      // Query case-insensitively
      user = await db.collection('users').findOne({ 
        username: { $regex: new RegExp('^' + username.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i') } 
      });
    } else {
      // Local development mode
      if (!fs.existsSync(localDataPath)) {
        return res.status(500).json({ error: 'Local data file not found.' });
      }
      const raw = fs.readFileSync(localDataPath, 'utf8');
      const data = JSON.parse(raw);
      user = (data.users || []).find(
        u => u.username.toLowerCase() === username.toLowerCase()
      );
    }

    if (!user || !verifyPassword(password, user.salt, user.hash)) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = crypto.randomBytes(32).toString('hex');

    if (useMongo) {
      const db = await getDb();
      await db.collection('sessions').insertOne({
        token,
        username: user.username,
        role: user.role,
        createdAt: new Date()
      });
    } else {
      // Local development mode
      activeSessionsLocal.set(token, { username: user.username, role: user.role });
    }

    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    console.error('POST /api/login Error:', err);
    res.status(500).json({ error: 'Connection failure during authorization.' });
  }
});

// API Route: Admin retrieve list of users (Requires super_admin)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Access Denied: Requires super_admin privilege.' });
  }

  try {
    if (useMongo) {
      const db = await getDb();
      const users = await db.collection('users').find({}).toArray();
      const sanitizedUsers = users.map(u => ({
        username: u.username,
        role: u.role
      }));
      res.json(sanitizedUsers);
    } else {
      // Local development mode
      if (!fs.existsSync(localDataPath)) {
        return res.status(500).json({ error: 'Local database not initialized.' });
      }
      const raw = fs.readFileSync(localDataPath, 'utf8');
      const data = JSON.parse(raw);
      const sanitizedUsers = (data.users || []).map(u => ({
        username: u.username,
        role: u.role
      }));
      res.json(sanitizedUsers);
    }
  } catch (err) {
    console.error('GET /api/admin/users Error:', err);
    res.status(500).json({ error: 'Failed to retrieve accounts.' });
  }
});

// API Route: Admin create user (Requires super_admin)
app.post('/api/admin/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Access Denied: Requires super_admin privilege.' });
  }

  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password, and role are required.' });
  }

  try {
    const salt = generateSalt();
    const hash = hashPassword(password, salt);

    if (useMongo) {
      const db = await getDb();
      const exists = await db.collection('users').findOne({ 
        username: { $regex: new RegExp('^' + username.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i') } 
      });
      if (exists) {
        return res.status(400).json({ error: 'A user with this username already exists.' });
      }

      await db.collection('users').insertOne({
        username: username.trim(),
        salt,
        hash,
        role
      });
      res.json({ message: 'User account created successfully.', username: username.trim(), role });
    } else {
      // Local development mode
      if (!fs.existsSync(localDataPath)) {
        return res.status(500).json({ error: 'Local database not initialized.' });
      }
      const raw = fs.readFileSync(localDataPath, 'utf8');
      const data = JSON.parse(raw);
      if (!data.users) {
        data.users = [];
      }
      const exists = data.users.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
      if (exists) {
        return res.status(400).json({ error: 'A user with this username already exists.' });
      }

      data.users.push({
        username: username.trim(),
        salt,
        hash,
        role
      });
      fs.writeFileSync(localDataPath, JSON.stringify(data, null, 2), 'utf8');
      res.json({ message: 'User account created successfully.', username: username.trim(), role });
    }
  } catch (err) {
    console.error('POST /api/admin/users Error:', err);
    res.status(500).json({ error: 'Failed to create user account.' });
  }
});

// API Route: Admin delete user (Requires super_admin)
app.delete('/api/admin/users/:username', authenticateToken, async (req, res) => {
  const { username } = req.params;
  if (username === 'admin') {
    return res.status(400).json({ error: 'The primary admin account is protected and cannot be deleted.' });
  }

  try {
    if (useMongo) {
      const db = await getDb();
      const userToDelete = await db.collection('users').findOne({ username });
      if (!userToDelete) {
        return res.status(404).json({ error: 'User account not found.' });
      }

      if (userToDelete.role === 'super_admin') {
        const superAdmins = await db.collection('users').find({ role: 'super_admin' }).toArray();
        if (superAdmins.length <= 1) {
          return res.status(400).json({ error: 'Cannot delete user: At least one super_admin account must remain in the system.' });
        }
      }

      await db.collection('users').deleteOne({ username });
      res.json({ message: 'User account deleted successfully.' });
    } else {
      // Local development mode
      if (!fs.existsSync(localDataPath)) {
        return res.status(500).json({ error: 'Local database not initialized.' });
      }
      const raw = fs.readFileSync(localDataPath, 'utf8');
      const data = JSON.parse(raw);
      const userToDelete = (data.users || []).find(u => u.username === username);
      if (!userToDelete) {
        return res.status(404).json({ error: 'User account not found.' });
      }

      if (userToDelete.role === 'super_admin') {
        const superAdmins = data.users.filter(u => u.role === 'super_admin');
        if (superAdmins.length <= 1) {
          return res.status(400).json({ error: 'Cannot delete user: At least one super_admin account must remain in the system.' });
        }
      }

      data.users = data.users.filter(u => u.username !== username);
      fs.writeFileSync(localDataPath, JSON.stringify(data, null, 2), 'utf8');
      res.json({ message: 'User account deleted successfully.' });
    }
  } catch (err) {
    console.error('DELETE /api/admin/users Error:', err);
    res.status(500).json({ error: 'Failed to delete user account.' });
  }
});

// Port listener for local execution only (Vercel bypasses this block)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Skyrush backend server running locally on http://localhost:${PORT}`);
  });
}

export default app;
