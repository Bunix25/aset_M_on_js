const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'database.db');

// Initialize the database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database');
        db.run(`CREATE TABLE IF NOT EXISTS assets (
            id TEXT PRIMARY KEY,
            type TEXT,
            name TEXT,
            owner TEXT,
            dept TEXT,
            location TEXT,
            manufacturer TEXT,
            model TEXT,
            serial TEXT,
            purchaseDate TEXT,
            warranty TEXT,
            os TEXT,
            cpu TEXT,
            ram TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            }
        });
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'add_asset.html'));
});

app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'view_asset.html'));
});

app.get('/assets', (req, res) => {
    db.all('SELECT * FROM assets', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/add', (req, res) => {
    const { asset_id, asset_type, asset_name, owner, academic_department, location, manufacturer, model, serial_number, purchase_date, warranty_expiry, os, cpu, ram } = req.body;
    const query = `INSERT INTO assets (id, type, name, owner, dept, location, manufacturer, model, serial, purchaseDate, warranty, os, cpu, ram) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [asset_id, asset_type, asset_name, owner, academic_department, location, manufacturer, model, serial_number, purchase_date, warranty_expiry, os, cpu, ram], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.redirect('/view');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});