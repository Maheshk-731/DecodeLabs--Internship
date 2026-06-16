# BuildDeveloper — Project : FullStack Web Development

**DecodeLabs Industrial Training | Batch 2026**

---

## What This Is

**Project 1 was the frontend (HTML, CSS, JS) — a responsive landing page for a fictional dev-training platform called BuildDeveloper.

##Repository--
https://github.com/Maheshk-731/DecodeLabs--Internship

##Live Demo --
https://maheshk-731.github.io/DecodeLabs--Internship/Project%20-1%20Frontend/


**Project 2 adds the backend: a Node.js + Express server that serves that frontend **and** powers a small set of REST API endpoints backed by JSON files (no database yet — that's Project 3).

##Repository
https://github.com/Maheshk-731/DecodeLabs--Internship

---

## Tech Stack

- **Frontend:** HTML5, CSS3, vanilla JavaScript
- **Backend:** Node.js, Express
- **Data storage:** Flat JSON files (`/data`)
- **Dev tooling:** nodemon (optional, for auto-restart)

---

## How To Run

### 1. Install dependencies
```bash
npm install
```
This downloads Express (and nodemon) from npm into a `node_modules` folder.

### 2. Start the server
```bash
node server.js
```
Or, with auto-restart on file changes during development:
```bash
npm run dev
```

### 3. Open the frontend
Visit:
```
http://localhost:3000
```
This loads `index.html` — now served by the Node server instead of opened as a static file.

---

## API Endpoints

Test GET routes directly in the browser, or use Postman/Insomnia/curl for everything.

| Method | Endpoint            | Description                          |
|--------|---------------------|---------------------------------------|
| GET    | `/api/projects`     | Returns all 4 project tracks           |
| GET    | `/api/projects/:id` | Returns one project (e.g. `/api/projects/1`) |
| GET    | `/api/skills`       | Returns skill progress data            |
| GET    | `/api/stats`        | Returns platform stats (interns, placement rate, etc.) |
| POST   | `/api/contact`      | Submit a contact message               |
| GET    | `/api/messages`     | View all submitted messages            |

---

## Testing the POST Endpoint

`POST /api/contact` requires a JSON body with three fields: `name`, `email`, `message`.

**Request body:**
```json
{
  "name": "Mahesh Kumar",
  "email": "mahesh@example.com",
  "message": "Hello from the API!"
}
```

**Success response (201 Created):**
```json
{
  "success": true,
  "message": "Message received! We will get back to you soon.",
  "data": {
    "id": 1748000000000,
    "name": "Mahesh Kumar",
    "email": "mahesh@example.com",
    "message": "Hello from the API!",
    "receivedAt": "2026-06-08T10:00:00.000Z"
  }
}
```

**Validation error (400 Bad Request)** — e.g. missing name:
```json
{
  "success": false,
  "message": "Name is required."
}
```

---

## File Structure

```
builddeveloper/
├── index.html          ← Project 1 frontend (unchanged)
├── style.css           ← Project 1 frontend (unchanged)
├── script.js            ← Project 1 frontend (unchanged)
│
├── server.js           ← Project 2: Express server + all API routes
├── package.json         ← Project 2: npm config
│
└── data/
    ├── projects.json    ← the 4 project track records
    ├── skills.json       ← skill progress data
    ├── stats.json        ← platform stats
    └── messages.json     ← stores contact form submissions (starts empty)
```

---

## HTTP Status Codes Used

| Code | Meaning               | When it's sent                          |
|------|-----------------------|-------------------------------------------|
| 200  | OK                    | Successful GET request                    |
| 201  | Created               | A new message was saved via POST          |
| 400  | Bad Request           | Missing or invalid field in POST body     |
| 404  | Not Found             | Route or resource doesn't exist           |
| 500  | Internal Server Error | File read/write failed on the server      |

---

Tools
  1. VS Code
  2. Postman
  3. GitHub


## Author

**Mahesh Kumar**
B.Tech CSE, Government Engineering College Jaipur
[GitHub](https://github.com/Maheshk-731) · [LinkedIn](https://www.linkedin.com/in/mahesh-kumar-b85a4a204)

---

*BuildDeveloper —  by  Mahesh Kumar*
