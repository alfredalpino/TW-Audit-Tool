# Chat context and guardrails

This folder holds the context and rules the Torpedo Web chat uses.

## Files

- **GUARDRAILS.md** – What the AI should and should not answer. Used to build the chat system prompt.
- **torpedo-scope.md** – Short summary of Torpedo Web scope (services, contact, philosophy).
- **services.txt** – Plain list of services and contact info.
- **.md / .txt** – Add more context here (e.g. FAQs, process, case studies). The chat uses `lib/chat-knowledge.ts` and can be extended to load from these files.
- **.pdf** – You can add PDFs here for reference. To use them in the chat, you’d need to add code (e.g. a script or API) that extracts text and feeds it into the prompt or a RAG step.

## Updating behaviour

1. **Guardrails:** Edit `GUARDRAILS.md`. The app reads this file (with a fallback) when building the system prompt.
2. **Knowledge:** Edit `torpedo-scope.md`, `services.txt`, or add new `.md`/`.txt` files. If you want the model to use them automatically, we can wire `lib/chat-knowledge.ts` to load from this folder.

## Deployment

These files are part of the repo and are deployed with the app. The chat API reads `GUARDRAILS.md` from this folder at runtime (server-side only).
