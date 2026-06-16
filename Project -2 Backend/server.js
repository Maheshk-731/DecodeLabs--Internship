// server.js — BuildDeveloper | Project 2: Backend API Development
// DecodeLabs Industrial Training — Batch 2026
//
// this is the main backend file. it starts a server, serves the frontend,
// and handles all the API routes (GET and POST requests)
//
// to run this: node server.js
// make sure you ran "npm install" first to get the express package

/* === SETUP === */

// bring in the packages we need
var express = require('express'); // express makes building routes way easier
var path    = require('path');    // path helps us build file paths that work on any OS
var fs      = require('fs');      // fs lets us read and write files on the server

// create the express app
var app = express();

// port number — where the server will listen
// 3000 is the standard port for local development
var PORT = 3000;

/* === MIDDLEWARE === */

// this lets the server understand JSON in POST request bodies
// without this, req.body would be undefined — spent a long time figuring this out
app.use(express.json());

// also handle URL-encoded data (like old-school HTML form submissions)
app.use(express.urlencoded({ extended: true }));

// serve the static frontend files from the current folder
// so going to localhost:3000 will load index.html automatically
app.use(express.static(path.join(__dirname)));

/* === HELPER FUNCTIONS === */

// reads a JSON file from the /data folder and returns the parsed data
// I made this a helper so I don't repeat the same 3 lines in every route
function readDataFile(filename) {
    var filePath = path.join(__dirname, 'data', filename);
    var rawText  = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawText);
}

// writes data back to a JSON file in the /data folder
// the "null, 2" part in JSON.stringify makes the output nicely indented
function writeDataFile(filename, data) {
    var filePath   = path.join(__dirname, 'data', filename);
    var formatted  = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, formatted, 'utf8');
}

/* === GET /api/projects === */

// returns the list of all 4 BuildDeveloper project tracks
// example: fetch('http://localhost:3000/api/projects').then(r => r.json()).then(console.log)

app.get('/api/projects', function(req, res) {
    console.log('[GET] /api/projects');

    try {
        var projects = readDataFile('projects.json');

        // send a 200 (OK) response with the project data
        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });

    } catch (err) {
        // if something goes wrong reading the file, return a 500 error
        console.log('error loading projects.json:', err.message);
        res.status(500).json({
            success: false,
            message: 'Server error — could not load projects.'
        });
    }
});

/* === GET /api/projects/:id === */

// returns a single project by its id
// example: GET /api/projects/1 returns the first project

app.get('/api/projects/:id', function(req, res) {
    console.log('[GET] /api/projects/' + req.params.id);

    try {
        var projects  = readDataFile('projects.json');
        var projectId = parseInt(req.params.id); // convert the URL string to a number

        // find the matching project
        var found = null;
        for (var i = 0; i < projects.length; i++) {
            if (projects[i].id === projectId) {
                found = projects[i];
                break;
            }
        }

        if (found === null) {
            // 404 means "not found"
            return res.status(404).json({
                success: false,
                message: 'Project with id ' + projectId + ' does not exist.'
            });
        }

        res.status(200).json({
            success: true,
            data: found
        });

    } catch (err) {
        console.log('error in /api/projects/:id:', err.message);
        res.status(500).json({
            success: false,
            message: 'Server error.'
        });
    }
});

/* === GET /api/skills === */

// returns the skill progress data — the same data shown
// in the sidebar progress bars on the frontend

app.get('/api/skills', function(req, res) {
    console.log('[GET] /api/skills');

    try {
        var skills = readDataFile('skills.json');

        res.status(200).json({
            success: true,
            data: skills
        });

    } catch (err) {
        console.log('error loading skills.json:', err.message);
        res.status(500).json({
            success: false,
            message: 'Could not load skills data.'
        });
    }
});

/* === GET /api/stats === */

// returns the platform-level stats shown in the hero section
// (active interns, total projects, placement rate)

app.get('/api/stats', function(req, res) {
    console.log('[GET] /api/stats');

    try {
        var stats = readDataFile('stats.json');

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (err) {
        console.log('error loading stats.json:', err.message);
        res.status(500).json({
            success: false,
            message: 'Could not load stats.'
        });
    }
});

/* === POST /api/contact === */

// accepts a contact message from a user
// required fields: name, email, message
// validates each field before saving

app.post('/api/contact', function(req, res) {
    console.log('[POST] /api/contact');
    console.log('incoming body:', req.body); // leaving this in so I can see what came in during testing

    // pull the fields out of the request body
    var name    = req.body.name;
    var email   = req.body.email;
    var message = req.body.message;

    // ----- VALIDATION -----
    // check each required field one at a time
    // returning early with "return res.status(...)" stops the function
    // so only one error message is sent at a time

    if (!name || name.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Name is required.'
        });
    }

    if (!email || email.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Email is required.'
        });
    }

    // basic email format check — look for @ sign and a dot after it
    // this is the same approach used in the frontend script.js
    // not a full regex but it catches the obvious mistakes
    var atIndex     = email.indexOf('@');
    var emailOk     = atIndex > 0 && email.slice(atIndex + 1).includes('.');
    if (!emailOk) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email address.'
        });
    }

    if (!message || message.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Message cannot be empty.'
        });
    }

    // ----- SAVE THE MESSAGE -----
    // read the existing messages array, push the new one, then write it back

    try {
        var messages = readDataFile('messages.json');

        // build the new message object
        var newMessage = {
            id: Date.now(),                      // using timestamp as a quick unique id
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            receivedAt: new Date().toISOString() // ISO format so it's easy to parse later
        };

        messages.push(newMessage);
        writeDataFile('messages.json', messages);

        console.log('message saved from:', newMessage.name, '—', newMessage.email);

        // 201 = Created — the right code when something new is made on the server
        res.status(201).json({
            success: true,
            message: 'Message received! We will get back to you soon.',
            data: newMessage
        });

    } catch (err) {
        console.log('error saving message:', err.message);
        res.status(500).json({
            success: false,
            message: 'Server error — could not save your message. Try again.'
        });
    }
});

/* === GET /api/messages === */

// returns all submitted contact messages
// NOTE: in a real app this would need authentication — only admins should see this
// TODO: add a simple token check here later

app.get('/api/messages', function(req, res) {
    console.log('[GET] /api/messages');

    try {
        var messages = readDataFile('messages.json');

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });

    } catch (err) {
        console.log('error loading messages.json:', err.message);
        res.status(500).json({
            success: false,
            message: 'Could not load messages.'
        });
    }
});

/* === 404 FALLBACK === */

// if the request doesn't match any route above,
// send back a 404 with a helpful message
// this has to be the LAST app.use() — order matters in Express

app.use(function(req, res) {
    console.log('[404] route not found:', req.method, req.url);
    res.status(404).json({
        success: false,
        message: 'Route not found — check the URL and try again.'
    });
});

/* === START SERVER === */

app.listen(PORT, function() {
    console.log('');
    console.log('  BuildDeveloper API — Project 2 Running!');
    console.log('  Frontend   →  http://localhost:' + PORT);
    console.log('');
    console.log('  API Endpoints:');
    console.log('  GET   /api/projects          all project tracks');
    console.log('  GET   /api/projects/:id      single project by id');
    console.log('  GET   /api/skills            skill progress data');
    console.log('  GET   /api/stats             platform stats');
    console.log('  POST  /api/contact           submit a contact message');
    console.log('  GET   /api/messages          view all submitted messages');
    console.log('');
    console.log('  Press Ctrl+C to stop the server.');
    console.log('');
});
