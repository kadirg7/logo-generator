# 🎨 AI Logo Generator

Generate professional AI-powered logos in seconds using fal.ai's Flux model.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)

## ✨ Features

- 🖼️ AI-powered logo generation via fal.ai
- 🔒 API key secured via Netlify serverless function (never exposed to browser)
- 🎨 5 unique style options (Minimalist, Modern Tech, Playful, Professional, Vintage)
- ⬇️ One-click PNG download
- 📱 Fully responsive design
- 💎 Modern glassmorphism UI

## 🏗️ Architecture

```
Browser (script.js)
    │
    │  POST /.netlify/functions/generate
    │  body: { prompt }
    ▼
Netlify Function (generate.js)
    │
    │  POST https://fal.run/fal-ai/flux/schnell
    │  Authorization: Key ${FAL_API_KEY}
    ▼
fal.ai API → returns image URL → browser displays it
```

> The API key **never** reaches the browser. It lives only in Netlify environment variables.

## 📁 Project Structure

```
ai-logo-generator/
├── index.html              → Main HTML file
├── styles.css              → All styles (glassmorphism, gradients, responsive)
├── script.js               → Frontend logic (calls serverless function)
├── netlify.toml            → Netlify config (points to functions dir)
├── netlify/
│   └── functions/
│       └── generate.js     → Serverless proxy to fal.ai
├── .gitignore              → Excludes secrets & build artifacts
└── README.md               → You are here
```

## 🚀 Deploy to Netlify

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ai-logo-generator.git
git push -u origin main
```

### 2. Connect on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
2. Select your repo
3. Netlify auto-detects `netlify.toml` — no build settings needed

### 3. Set the API key

1. In Netlify dashboard → **Site settings** → **Environment variables**
2. Add a new variable:
   - **Key:** `FAL_API_KEY`
   - **Value:** Your fal.ai API key
3. **Redeploy** the site for the variable to take effect

### 4. Get a fal.ai API key

1. Go to [fal.ai](https://fal.ai)
2. Sign up / log in
3. Navigate to API Keys
4. Generate a new key
5. Paste it into Netlify env vars (step 3 above)

## 🧪 Local Development

To test locally, install the [Netlify CLI](https://docs.netlify.com/cli/get-started/):

```bash
npm install -g netlify-cli
```

Create a `.env` file (gitignored) in the project root:

```
FAL_API_KEY=your_api_key_here
```

Then run:

```bash
netlify dev
```

This starts a local dev server with the serverless function available at `/.netlify/functions/generate`.

## 🛡️ Security Notes

- API key lives **only** in Netlify environment variables — never in source code
- The serverless function validates input and returns structured JSON errors
- No CORS issues since the function runs on the same domain

## 📄 License

MIT License — feel free to use and modify!
