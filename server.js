const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON bodies

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(__dirname));

// Simulated Database (In-Memory Array)
const usersDB = [];

// ================= API ENDPOINTS =================

// 1. Sign Up API
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = usersDB.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ success: false, message: 'User with this email already exists!' });
    }

    // Save new user
    const newUser = { id: Date.now(), name, email, password };
    usersDB.push(newUser);
    console.log("New User Registered:", newUser.email);
    
    res.json({ success: true, message: 'Account created successfully!', user: newUser });
});

// 2. Login API
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Authenticate user
    const user = usersDB.find(u => u.email === email && u.password === password);
    if (user) {
        console.log("User Logged In:", user.email);
        res.json({ success: true, message: 'Login successful!', user });
    } else {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`\n==============================================`);
    console.log(`🚀 HyGen Backend Server is RUNNING!`);
    console.log(`🔗 Go to your browser and open: http://localhost:${PORT}`);
    console.log(`==============================================\n`);
});
