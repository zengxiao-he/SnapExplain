# SnapExplain 

**Instantly analyze your screenshots using GPT vision models**.  
SnapExplain takes an iOS screenshot, sends it to a Vercel-hosted API, and returns a concise explanation or actionable insights.  
Optionally, it can trigger a search step for deeper answers.

---

## Features
- **One-tap screenshot analysis** – directly from the iOS share sheet  
- **Vision LLM-powered** – understands app UIs, chats, tickets, schedules, etc.  
- **Optional search integration** – ask questions and get summarized results  
- **Serverless deployment** – easily deploy on Vercel, no backend setup required  
- **Privacy-first** – no data is stored by default

---

## Architecture
iOS Shortcuts (Share Sheet)
│
│ Screenshot → Base64 JSON
▼
Vercel Edge Function (/api/analyze)
│
▼
OpenAI-compatible Vision Model (e.g., gpt-4o-mini)
│
▼
Response: { "text": "Concise explanation + actions" }



## Quick Start

### 1. Deploy to Vercel
1. Fork this repository and import it into [Vercel](https://vercel.com/).
2. Configure **Environment Variables**:
   | Variable | Description |git add README.md
   |-----------|-------------|
   | `OPENAI_API_KEY` | Your OpenAI (or OpenRouter) API key |
   | `OPENAI_BASE_URL` *(optional)* | Custom API base URL if not using OpenAI |
   | `VISION_MODEL` *(optional)* | Vision model, default: `gpt-4o-mini` |

3. Deploy. After deployment, you’ll get a URL like:
https://your-app.vercel.app



---

### 2. Create the iOS Shortcut
On your iPhone:
1. Open the **Shortcuts** app → create a new shortcut called **“SnapExplain”**.
2. Set it to **Accept Images** from the share sheet.
3. Steps in the shortcut:
- **Get the shared image**
- **Convert image to Base64**
- Build JSON body like:
  ```json
  {
    "image_base64": "YOUR_BASE64_STRING",
    "prompt": "Explain the key points of this screenshot in concise English."
  }
  ```
- **POST** to: `https://your-app.vercel.app/api/analyze`
  - Headers: `Content-Type: application/json`
- Parse JSON response → extract the `"text"` field
- Display or copy the result

---

### 3. Test via Curl
You can also test manually from your terminal:
```bash
curl -X POST https://your-app.vercel.app/api/analyze \
-H "Content-Type: application/json" \
-d '{"image_url":"https://example.com/screenshot.png","prompt":"Summarize this image."}'
