const SITE_ORIGIN = 'https://www.loryns-strategic-consulting.online';
const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 1200;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 12;
const recentRequests = new Map();

function getClientKey(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  return typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : 'unknown';
}

function isRateLimited(clientKey) {
  const now = Date.now();
  const recent = (recentRequests.get(clientKey) || []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    recentRequests.set(clientKey, recent);
    return true;
  }

  recent.push(now);
  recentRequests.set(clientKey, recent);

  if (recentRequests.size > 500) {
    for (const [key, timestamps] of recentRequests) {
      if (!timestamps.some((time) => now - time < RATE_LIMIT_WINDOW_MS)) recentRequests.delete(key);
    }
  }

  return false;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  const language = req.body?.language === 'en' ? 'en' : 'fr';
  const message = (fr, en) => language === 'en' ? en : fr;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: message('Méthode non autorisée.', 'Method not allowed.') });
  }

  const origin = req.headers.origin;
  const allowedOrigin = origin === SITE_ORIGIN || origin === `${SITE_ORIGIN.replace('www.', '')}` ||
    (typeof origin === 'string' && /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) ||
    (typeof origin === 'string' && /^http:\/\/localhost(:\d+)?$/.test(origin));

  if (origin && !allowedOrigin) return res.status(403).json({ error: message('Origine non autorisée.', 'Origin not allowed.') });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: message('L’assistant est en cours de configuration. Vous pouvez nous écrire via le formulaire de contact.', 'The assistant is being configured. You can reach us through the contact form.') });
  if (isRateLimited(getClientKey(req))) return res.status(429).json({ error: message('Trop de demandes en peu de temps. Réessayez dans quelques minutes.', 'Too many requests. Please try again in a few minutes.') });

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return res.status(400).json({ error: message('La conversation est invalide. Veuillez recommencer.', 'This conversation is invalid. Please start again.') });
  }

  const validMessages = messages.every((message) =>
    message && ['user', 'assistant'].includes(message.role) &&
    typeof message.content === 'string' && message.content.trim().length > 0 &&
    message.content.length <= MAX_MESSAGE_LENGTH
  );

  if (!validMessages || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: message('Votre message est invalide ou trop long.', 'Your message is invalid or too long.') });
  }

  const instructions = `Tu es l’assistant virtuel de Loryns Strategic Consulting, cabinet de conseil basé à Douala, au Cameroun. Tu aides les visiteurs à comprendre les services du cabinet et à trouver comment le contacter. Réponds dans la langue du visiteur (${language === 'en' ? 'anglais' : 'français'}), avec un ton professionnel, clair et concis.\n\nInformations publiques fournies par le site : conseil en stratégie d’entreprise, gouvernance, études et conseil, négociation et intermédiation d’affaires, services financiers et recherche de financement, recouvrement de créances, services juridiques, gestion RH, transformation digitale, développement informatique, automatisation, communication et community management. Le cabinet indique être situé Rue de la Joie, Akwa, Douala, Cameroun.\n\nN’invente jamais de tarifs, de résultats garantis, de disponibilité, d’adresse e-mail ou de numéro de téléphone. Pour les demandes de devis, rendez-vous, conseils juridiques/financiers personnalisés ou informations absentes, invite la personne à utiliser le formulaire de contact du site. Ne prétends pas être humain. Ne demande pas de données sensibles ou de mots de passe. Si tu ne connais pas une réponse, dis-le simplement.`;

  try {
    const apiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
        instructions,
        input: messages.map(({ role, content }) => ({ role, content })),
        max_output_tokens: 350,
        store: false,
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (!apiResponse.ok) {
      const errorDetails = await apiResponse.json().catch(() => ({}));
      console.error('OpenAI Responses API request failed:', apiResponse.status, errorDetails.error?.code || 'unknown');
      return res.status(502).json({ error: message('Je ne peux pas répondre pour le moment. Réessayez bientôt ou contactez-nous via le formulaire.', 'I can’t answer right now. Please try again shortly or use the contact form.') });
    }

    const result = await apiResponse.json();
    const reply = result.output_text?.trim();
    if (!reply) return res.status(502).json({ error: message('Je n’ai pas pu préparer une réponse. Veuillez réessayer.', 'I could not prepare a reply. Please try again.') });

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Assistant request failed:', error.name || 'unknown');
    return res.status(504).json({ error: message('La réponse prend trop de temps. Veuillez réessayer.', 'The response is taking too long. Please try again.') });
  }
}
