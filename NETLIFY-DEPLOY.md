# Netlify Deployment — Continue From Here

A Netlify site has already been created for this project:

- **Site name:** skillstork-chatbot
- **Site ID:** `e642c1b7-819e-4e8a-8145-b2975ccdaaad`
- **Live URL (once deployed):** http://skillstork-chatbot.netlify.app

## What's already done
- `netlify/functions/chat.mts` — the backend, rewritten as a Netlify serverless
  function (Netlify doesn't run traditional Node servers, so this replaces
  `server.js` for this deployment path). It has the full Skill Stork
  knowledge base built in, plus CORS handling so the widget can be embedded
  on skillstork.org (a different domain than the Netlify site).
- `netlify.toml` — points Netlify at `public/` for static files and
  `netlify/functions` for the backend function.
- `public/widget.js` — the embeddable chat widget (logo, official branding,
  upgraded visual design). Calls `/api/chat` on whatever domain it's loaded
  from, which matches the function's configured path.

## What's left to do
1. **Run the deploy.** From inside this project folder, with Node.js/npm
   installed and internet access:
   ```bash
   npx -y @netlify/mcp@latest --site-id e642c1b7-819e-4e8a-8145-b2975ccdaaad --proxy-path "https://netlify-mcp.netlify.app/proxy/eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..e0Gno2UovigeiMwU.FnY_opopdmvlDvWVqphcffwamXiYR4otuNR3YQUm-3sA_udYeSZqgfQp4igtNlzhQZZ8g_HoubGNtr-0eAvrHlDw3pxt6eWtEs_WzN2g1zc1kLlE9B6iEPJElw6iZrWegxgpdgpGxDCvGYmList4ka5yHyCqMqzvBhk2rN9orFEqzrGneGIuN_yA2x13tWyfGCPQ3Zlw3j1g4I61ZrE6ap9jGU0c1gfIiyJZtUb7iPGZu4BgLt0Lq1Xp96QC1PDW5ThO2FbYYAaINxcNV0BWGFqcsT4k72V2_xHdDtZC9do6TBu6r8qkgGLFLaPu8BNyfz3OtgCHyushonF1FdKZHNbPl4dPd2RnIi-9kekrygdml4zwvvCMQOjDPNYf7aael0CtBi0y.Ev-8hSSI4et3g0ejTHtRcg"
   ```
   (This proxy link may expire — if it fails, ask Claude to re-run the
   Netlify deploy tool with site ID `e642c1b7-819e-4e8a-8145-b2975ccdaaad`
   to get a fresh one.)

2. **Add the API key.** In the Netlify dashboard for this site: **Site
   configuration → Environment variables → Add a variable**, name
   `ANTHROPIC_API_KEY`, value = your real key from console.anthropic.com.
   The chat function will return a clear error until this is set — it
   won't fail silently.

3. **Test it.** Visit `http://skillstork-chatbot.netlify.app` — the demo
   page with the chat bubble should load and respond.

4. **Embed on the real site.** Add this before `</body>` on skillstork.org:
   ```html
   <script>
     window.SKILLSTORK_CHAT_API = "http://skillstork-chatbot.netlify.app";
   </script>
   <script src="http://skillstork-chatbot.netlify.app/widget.js"></script>
   ```

## Known bug already fixed
Earlier versions of `widget.js` could break mid-conversation: if one API
call failed, the unanswered question stayed in history with no reply,
causing every question after it to fail (Anthropic's API requires strict
user/assistant alternation). This is already fixed in the version in this
zip — failed messages are rolled back out of history automatically.
