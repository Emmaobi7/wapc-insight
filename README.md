# WACP Intelligence UI

A clickable React/Vite frontend prototype for demonstrating an AI intelligence layer over institutional systems.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Build

```bash
npm run build
```

## Deploy on Render

1. Push this project to a GitHub repository.
2. In Render, create a **Static Site** and connect the repository.
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`

## Prototype scope

This is a frontend-only demonstration. It uses synthetic sample data and simulated interactions. It does not connect to WACP production systems, execute SQL, call an LLM, or send messages. The chat responses, source health, evidence records and query traces are deliberately mocked so the experience can be demonstrated safely before real integrations are authorized.

## Suggested demo flow

1. Open **Overview** and show the institutional data landscape.
2. Open **Ask Intelligence** and click one of the suggested prompts.
3. Inspect the answer's **Evidence** and **Execution trace** tabs.
4. Open **Data sources** to show the connected-source model.
5. Open **Activity & audit** to show traceability.
6. Use **Settings** to show the planned security posture.
