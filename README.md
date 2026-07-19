# Skill Stork International School — Website Chatbot

A ready-to-deploy chatbot for the Skill Stork International School website,
powered by Claude. Visitors get a floating chat bubble; it answers questions
about admissions, curriculum, facilities, etc., using info baked into the
system prompt in `server.js`.

## What's included

- `server.js` — small Node/Express backend that calls the Claude API
- `public/widget.js` — the embeddable chat widget (vanilla JS, no build step)
- `public/index.html` — a local demo page to test the widget
- `package.json` — dependencies

## 1. Get an Anthropic API key

1. Go to https://console.anthropic.com and sign up / log in
   (this is separate from a claude.ai account).
2. Create an API key under **Settings → API Keys**.
3. Add billing — API usage is pay-as-you-go, priced per token. Check current
   pricing at https://docs.claude.com before launch so the school knows what
   to expect.

## 2. Run it locally

```bash
npm install
cp .env.example .env
# open .env and paste your API key
npm start
```

Then open http://localhost:3000 in your browser — you'll see the demo page
with the chat bubble in the corner.

## 3. Customize the knowledge

Open `server.js` and edit the `SYSTEM_PROMPT` constant. This is the bot's
entire knowledge base and personality. A few notes:

- Everything currently in there is from publicly available sources (the
  school's own website, IB's authorization records, review sites). Ask the
  school for official, up-to-date details — fee structure, staff directory,
  this year's calendar, admission deadlines, transport routes — and add them
  as new bullet points. The more specific and accurate this section is, the
  fewer times the bot will have to say "I don't know, please call the
  office."
- Keep the "YOUR ROLE AND LIMITS" section — it's what keeps the bot from
  inventing facts, mishandling sensitive topics (bullying, health,
  emergencies), or overstepping into things only staff should handle.

## 4. Deploy the backend

Any Node hosting works. Easiest options for a small school site:

**Render (recommended, free tier available)**
1. Push this folder to a GitHub repo.
2. On https://render.com, create a new **Web Service** from that repo.
3. Build command: `npm install` — Start command: `npm start`
4. Add an environment variable `ANTHROPIC_API_KEY` with your key.
5. Deploy. You'll get a URL like `https://skillstork-chatbot.onrender.com`.

**Railway** (https://railway.app) works almost identically.

## 5. Embed the widget on the real website

If the backend is hosted on the *same* domain as the school website, just
add this one line before `</body>` on any page:

```html
<script src="/widget.js"></script>
```

If the backend is on a *different* domain (e.g. Render's URL, while the
website itself is on skillstork.org), set the API base first:

```html
<script>
  window.SKILLSTORK_CHAT_API = "https://skillstork-chatbot.onrender.com";
</script>
<script src="https://skillstork-chatbot.onrender.com/widget.js"></script>
```

That's it — the chat bubble will appear on every page that includes it.

## About the logo

The widget currently hot-links the school's logo directly from
`skillstork.org` (`wp-content/uploads/2025/10/new-logo.png`). This works
fine, but two things to know:
- If the school ever changes its website/CMS, that URL could break.
- For a production launch, it's more robust to download the logo file and
  serve it from this project's own `public/` folder instead, then update
  the `src` in `public/widget.js` to a local path like `/logo.png`.

## Notes on safety and tone

- The bot identifies itself as an AI assistant if asked, rather than
  pretending to be a staff member — this is both good practice and keeps
  expectations clear for parents and students.
- It's instructed to redirect sensitive topics (health, safety, bullying,
  complaints) to real staff rather than trying to handle them itself.
- It's told not to invent fees, staff names, or dates it wasn't given —
  reducing the risk of it confidently making something up.

## Ongoing costs

- Anthropic API usage (per conversation, usage-based — check current
  pricing at https://docs.claude.com)
- Hosting (many providers have a free tier sufficient for a school site's
  traffic; upgrade if usage grows)
