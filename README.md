# React + Vite

## Loryns virtual assistant

The site chat widget uses a Vercel serverless function at `/api/chat` and the OpenAI Responses API. The OpenAI key is read only by the server and must never be added to frontend code or committed to this repository.

To enable live replies, add `OPENAI_API_KEY` to the Vercel project’s Environment Variables for Production and Preview, then redeploy. The key is created in the [OpenAI API dashboard](https://platform.openai.com/api-keys). Optionally set `OPENAI_MODEL`; the default is `gpt-5.6-luna`.

The widget can appear without the key, but its endpoint will ask visitors to use the contact form until the environment variable is configured. Avoid sharing confidential information in chat.

For local Vercel Function development, use the Vercel development environment rather than Vite’s static-only development server.

The assistant is grounded in the public service and location information on the website. It must not invent prices, guarantees, contact details, or personalized legal or financial advice.

## OpenAI API setup

See the official [OpenAI API quickstart](https://platform.openai.com/docs/quickstart/make-your-first-api-request) for API key setup and the Responses API.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
