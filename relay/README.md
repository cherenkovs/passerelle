# Captions relay

A tiny Cloudflare Worker that lets Passerelle import a YouTube video by
link alone: the app asks the relay for the French captions, the relay asks
YouTube as a mobile player would, and returns plain JSON. Free tier is
100 000 requests a day; nothing is stored.

Without it the app still works — the learner pastes the transcript from
YouTube's own «Показати текстову версію» panel instead.

## Deploy (about five minutes)

1. Create a free account at https://dash.cloudflare.com (no card needed).
2. Install the CLI and log in:

       npm install -g wrangler
       wrangler login

3. From this folder:

       cd relay
       wrangler deploy

   The last line prints the URL, e.g. `https://passerelle-captions.<you>.workers.dev`.

4. Tell the app where it is. In the GitHub repository:
   Settings → Secrets and variables → Actions → **Variables** → New variable
   `CAPTIONS_RELAY` = that URL (no trailing slash).

5. Push anything, or re-run the last deploy. The «Додати відео» dialog now
   fetches captions from a link.

## Try it

    curl "https://passerelle-captions.<you>.workers.dev/captions?v=QsXCFzPTc78"
