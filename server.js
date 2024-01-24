const express = require('express');
const path = require('path');
const fs = require('fs'); // Needed if you're using a file system to store notes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files

// API Routes
const notesFilePath = path.join(__dirname, 'db.json');

app.get('/api/notes', (req, res) => {
    fs.readFile(notesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading notes' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    // Add code here to generate an ID for the new note

    fs.readFile(notesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading notes' });
        }
        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile(notesFilePath, JSON.stringify(notes), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error writing note' });
            }
            res.json(newNote);
        });
    });
});

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

