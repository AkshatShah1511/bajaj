# BFHL — SRM Full Stack Engineering Challenge

A REST API + frontend that parses node edge strings, builds hierarchical trees, detects cycles, and returns structured insights.

---

## Project Structure

```
bfhl/
├── backend/          ← Express REST API
│   ├── index.js
│   ├── package.json
│   └── vercel.json
└── frontend/
    └── index.html    ← Single-page UI
```

---

## Setup & Local Development

### Backend

```bash
cd backend
npm install
node index.js          # runs on http://localhost:3001
```

Test it:
```bash
curl -X POST http://localhost:3001/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data":["A->B","A->C","B->D","hello","1->2"]}'
```

### Frontend

Open `frontend/index.html` directly in your browser.  
Set the **API Base URL** field to `http://localhost:3001` for local dev, or your deployed URL.

---

## ⚠️ Before Deploying — Update Your Identity

Open `backend/index.js` and replace lines 7–9:

```js
const USER_ID = 'yourname_ddmmyyyy';       // e.g. 'raviverma_14032003'
const EMAIL_ID = 'your@srmist.edu.in';     // your college email
const COLLEGE_ROLL_NUMBER = 'RA2211003';   // your actual roll number
```

---

## Deploying

### Backend → Vercel

```bash
npm install -g vercel
cd backend
vercel --prod
```

Your API will be live at `https://your-project.vercel.app`  
The evaluator will call `https://your-project.vercel.app/bfhl`

### Backend → Render

1. Push repo to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `node index.js`

### Frontend → Vercel / Netlify

Drag and drop `frontend/index.html` onto Netlify Drop, or:

```bash
cd frontend
npx serve .    # local preview
```

For Vercel: add a `vercel.json` in `frontend/`:
```json
{ "version": 2 }
```
Then `vercel --prod` from that folder.

---

## API Spec

### `POST /bfhl`

**Request:**
```json
{ "data": ["A->B", "A->C", "B->D", "hello", "X->Y", "Y->Z", "Z->X"] }
```

**Response:**
```json
{
  "user_id": "yourname_ddmmyyyy",
  "email_id": "you@srmist.edu.in",
  "college_roll_number": "RA2211003",
  "hierarchies": [...],
  "invalid_entries": ["hello"],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

---

## Submission Checklist

- [ ] Updated USER_ID, EMAIL_ID, COLLEGE_ROLL_NUMBER in `backend/index.js`
- [ ] Backend deployed and `POST /bfhl` returns correct JSON
- [ ] Frontend deployed and calls your hosted API
- [ ] Both URLs pushed to a public GitHub repo
- [ ] Submitted form with: API URL, Frontend URL, GitHub repo URL
