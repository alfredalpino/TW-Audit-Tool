Below is a **practical implementation roadmap** for building a **lead-capture + AI chat + human takeover system** for **TorpedoWeb** using your current stack:

* **Frontend:** Next.js 16 (Turbopack)
* **Backend:** Supabase
* **AI:** OpenRouter API
* **Human support:** Telegram
* **Server:** Render (or similar always-on worker)

The system architecture will be:

```
Visitor → Website Chat Widget
        → Lead Capture (name/email/phone)
        → Stored in Supabase
        → Telegram alert to agent
        → AI assistant handles conversation
        → Agent can jump in via Telegram
```

---

# 1. Remove Chatbase Completely

You want **full control of the pipeline**.

### Step 1

Remove the Chatbase script from your site.

Search your project for something like:

```html
<script src="https://www.chatbase.co/embed.min.js"></script>
```

Delete:

```
components
layout.tsx
_head.tsx
```

Also remove any:

```
chatbase config
chatbase id
```

### Step 2

Remove environment variables if present.

```
CHATBASE_ID
CHATBASE_API
```

---

# 2. System Architecture (Recommended)

Your system should be **3 components**.

### 1. Website

NextJS chat widget.

Responsibilities:

* UI
* capture lead
* send messages to backend

---

### 2. API Layer

NextJS API routes or edge functions.

Responsibilities:

* validate lead
* store messages
* call OpenRouter
* push Telegram notifications

---

### 3. Worker (optional but ideal)

A **Render worker** that:

* listens to Supabase realtime
* pushes Telegram messages
* handles agent replies

---

### Final architecture

```
NextJS Site
     ↓
NextJS API Route
     ↓
Supabase Database
     ↓
Telegram Bot
     ↓
Agent Reply
     ↓
Back to Chat
```

---

# 3. Database Design (Supabase)

Create **three tables**.

### leads

```
id (uuid)
name
email
phone
created_at
status
```

status:

```
new
ai_chatting
agent_joined
closed
```

---

### conversations

```
id
lead_id
created_at
```

---

### messages

```
id
conversation_id
sender
message
created_at
```

sender values:

```
user
ai
agent
```

---

# 4. Chat Widget Flow

The chatbot must **start with lead capture**.

### Step 1

Visitor opens chat.

Message:

```
Hi there.
Before we start, may I know your name?
```

---

### Step 2

Collect:

```
Name
Email
Phone
```

---

### Step 3

POST request:

```
/api/create-lead
```

Payload:

```json
{
 "name": "",
 "email": "",
 "phone": ""
}
```

---

### Step 4

API will:

1 store lead in Supabase
2 create conversation
3 send Telegram alert

---

# 5. Telegram Integration (Lead Alert)

Create a **Telegram bot**.

Use:

```
@BotFather
```

Get:

```
BOT_TOKEN
```

---

### Send message to yourself

POST request:

```
https://api.telegram.org/bot<TOKEN>/sendMessage
```

Example message:

```
🔥 New Lead - TorpedoWeb

Name: John Smith
Email: john@email.com
Phone: +1 302 555 111

Open conversation:
https://torpedoweb.org/admin/chat/123
```

---

# 6. AI Chat Layer (OpenRouter)

Use OpenRouter API.

Endpoint:

```
https://openrouter.ai/api/v1/chat/completions
```

Example request:

```ts
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
 method: "POST",
 headers: {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json"
 },
 body: JSON.stringify({
  model: "anthropic/claude-3-haiku",
  messages: [
   { role: "system", content: "You are TorpedoWeb AI assistant..." },
   { role: "user", content: userMessage }
  ]
 })
})
```

---

### AI Prompt

You should define strict system instructions:

```
You are the TorpedoWeb client intake assistant.

Goals:
• Understand the project
• Qualify the lead
• Ask relevant questions
• Encourage booking a call

Never mention AI.
Never give pricing estimates.
Escalate to human when requested.
```

---

# 7. Human Agent Handoff

There are **two options**.

### Option 1 (Recommended)

Agent replies via **Telegram bot**.

Telegram command:

```
/reply 123 Hello John, this is the TorpedoWeb team.
```

Worker sends the reply to Supabase.

Chat updates in UI.

---

### Option 2

Agent replies via **admin panel**.

Admin page:

```
/admin/chat
```

Shows:

```
active leads
messages
reply box
```

---

# 8. Telegram Two-Way Chat

For Telegram replies to appear in chat:

You need a **Webhook server**.

Deploy small server on Render.

Example:

```
POST /telegram-webhook
```

Logic:

```
Telegram message
→ parse command
→ save message to Supabase
→ push to client
```

---

# 9. Real Time Chat

Use **Supabase Realtime**.

NextJS listens for new messages.

Example:

```ts
supabase
.channel("messages")
.on("postgres_changes", { event: "INSERT" }, payload => {
  addMessage(payload.new)
})
.subscribe()
```

Now chat updates instantly.

---

# 10. Chat UI

You only need a simple widget.

Structure:

```
components/chat/
   ChatWindow.tsx
   ChatInput.tsx
   ChatMessages.tsx
```

---

UI flow:

```
Lead form
↓
Chat messages
↓
Typing indicator
↓
AI response
↓
Agent join
```

---

# 11. Deployment Strategy

You asked where to deploy AI logic.

### Best setup

Keep **everything inside your NextJS project**.

```
NextJS
 ├ api/chat
 ├ api/lead
 ├ api/telegram
```

Advantages:

• simpler
• no extra infrastructure
• lower latency

---

### When to use a separate server

Only if you add:

* vector search
* memory database
* heavy AI workloads

Then use:

```
Render
Railway
Fly.io
```

---

# 12. Render Worker (Optional)

Use if you want **advanced automation**.

Worker tasks:

```
telegram message listener
agent command parser
lead routing
AI retry queue
```

But **not required initially**.

---

# 13. Admin Panel

Create route:

```
/admin/leads
```

Features:

```
Lead list
Chat history
Assign agent
Mark closed
```

---

# 14. Security

Add:

### rate limit

Prevent spam.

### email validation

Prevent fake leads.

### phone format

Normalize numbers.

---

# 15. Lead Qualification AI

You can score leads automatically.

Example:

```
budget > $5k → hot lead
startup founder → medium
student project → low
```

This can be stored as:

```
lead_score
```

---

# 16. Future Upgrades

Later you can add:

### calendar integration

Auto book calls.

### CRM sync

Hubspot or Notion.

### knowledge base AI

Train on:

```
services
case studies
portfolio
```

---

# 17. Implementation Timeline

Realistically:

### Day 1

Remove Chatbase
Build chat widget

---

### Day 2

Supabase schema
Lead capture API

---

### Day 3

AI chat integration

---

### Day 4

Telegram alerts

---

### Day 5

Agent takeover

---

Full system ready in **4–5 days**.

---

# 18. Pro Tip (Important)

Most agencies build **bad chatbots**.

Your bot should act like:

```
client intake assistant
```

Not generic support.

Example:

Bad:

```
How can I help you today?
```

Better:

```
What kind of product are you building right now?
```

This qualifies **serious founders**.

---

# If you want, I can also show you:

• **Production grade architecture used by YC startups**
• **A $0/month stack for this whole system**
• **The exact NextJS folder structure**
• **A ready-to-copy prompt for Manus AI to generate the entire system**

Just tell me.
