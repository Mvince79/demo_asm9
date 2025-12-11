import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(process.cwd(), 'src', 'assets', 'data', 'data.json');

async function readData() {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
}

async function writeData(data) {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

app.get('/api/users', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.users || []);
    } catch (err) {
        res.status(500).json({ message: 'Failed to read users', error: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const newUser = req.body;
        if (!newUser || !newUser.email) return res.status(400).json({ message: 'Invalid user' });

        const data = await readData();
        data.users = data.users || [];

        const exists = data.users.find(u => u.email === newUser.email);
        if (exists) return res.status(409).json({ message: 'Email already exists' });

        // assign id
        newUser.id = `u${Date.now()}`;
        data.users.push(newUser);
        await writeData(data);

        // don't return password
        const { password, ...safe } = newUser;
        res.status(201).json(safe);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create user', error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

        const data = await readData();
        const user = (data.users || []).find(u => u.email === email && u.password === password);
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const { password: pw, ...safe } = user;
        // simple token for demo
        const token = `fake-token-${Date.now()}`;
        res.json({ user: safe, token });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API server running on http://localhost:${port}`));
