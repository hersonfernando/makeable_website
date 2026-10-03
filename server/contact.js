import express from 'express'
import nodemailer from 'nodemailer'

const serviceNames = {
  cloud: 'Cloud solutions',
  network: 'Network infrastructure',
  consulting: 'IT consulting',
  systems: 'Information systems',
  unsure: 'Help choosing the right solution',
}
const isEmail = value => typeof value === 'string' && value.length <= 254 && /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(value)
const isSingleLine = value => !/[\x00-\x1f\x7f]/.test(value)
const unavailableMessage = 'Sending is temporarily unavailable. Please try again later.'

function validateInquiry(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const inquiry = {}
  for (const field of ['name', 'email', 'company', 'service', 'message', 'website']) {
    const value = body[field] ?? (['company', 'website'].includes(field) ? '' : null)
    if (typeof value !== 'string') return null
    inquiry[field] = value.trim()
  }
  if (!inquiry.name || inquiry.name.length > 100 || !isSingleLine(inquiry.name)) return null
  if (!isEmail(inquiry.email) || !isSingleLine(inquiry.email)) return null
  if (inquiry.company.length > 150 || !isSingleLine(inquiry.company)) return null
  if (!Object.hasOwn(serviceNames, inquiry.service)) return null
  if (inquiry.message.length < 15 || inquiry.message.length > 2000 || inquiry.message.includes('\0')) return null
  if (inquiry.website) return null
  return inquiry
}

export function createContactHandler(env = process.env, { transportFactory = nodemailer.createTransport, logger = console } = {}) {
  // A full Express app also initializes requests when mounted in Vite's Connect server.
  const router = express()
  router.disable('x-powered-by')
  const proxyHops = Number(env.TRUST_PROXY_HOPS || 0)
  if (Number.isInteger(proxyHops) && proxyHops > 0) router.set('trust proxy', proxyHops)
  const attempts = new Map()
  const windowMs = 10 * 60 * 1000
  const recipient = env.CONTACT_EMAIL || env.VITE_CONTACT_EMAIL || 'makeable.io@gmail.com'
  const sender = env.SMTP_FROM || env.SMTP_USER
  const port = Number(env.SMTP_PORT || 465)
  const secure = env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465
  const configured = env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS &&
    isEmail(recipient) && isEmail(sender) && isSingleLine(recipient) && isSingleLine(sender) &&
    Number.isInteger(port) && port > 0 && port <= 65535
  const transport = configured ? transportFactory({
    host: env.SMTP_HOST,
    port,
    secure,
    requireTLS: !secure,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    dnsTimeout: 10000,
    disableFileAccess: true,
    disableUrlAccess: true,
  }) : null

  if (!configured) logger.warn('Contact email needs SMTP_HOST, SMTP_USER, SMTP_PASS, and valid sender/recipient settings. Configure .env and restart the server.')

  router.use('/api/contact', (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    if (req.method !== 'POST') return res.set('Allow', 'POST').status(405).json({ error: 'Please submit an inquiry using the form.' })
    if (req.headers.origin) {
      try {
        if (new URL(req.headers.origin).host !== req.headers.host) {
          return res.status(403).json({ error: 'Please submit your inquiry from our website.' })
        }
      } catch {
        return res.status(403).json({ error: 'Please submit your inquiry from our website.' })
      }
    }
    const now = Date.now()
    for (const [address, attempt] of attempts) {
      if (attempt.expires <= now) attempts.delete(address)
    }
    const address = req.ip || req.socket.remoteAddress
    const attempt = attempts.get(address) || { count: 0, expires: now + windowMs }
    if (attempt.count >= 5 || (!attempts.has(address) && attempts.size >= 10000)) {
      return res.set('Retry-After', String(Math.ceil((attempt.expires - now) / 1000))).status(429)
        .json({ error: 'You’ve submitted several inquiries. Please wait a few minutes before trying again.' })
    }
    attempt.count += 1
    attempts.set(address, attempt)
    if (!req.is('application/json')) return res.status(415).json({ error: 'Please submit your inquiry using the form.' })
    next()
  })

  router.post('/api/contact', express.json({ limit: '16kb' }), async (req, res) => {
    const inquiry = validateInquiry(req.body)
    if (!inquiry) return res.status(422).json({ error: 'Please check your name, email, service, and project description, then try again.' })
    if (!transport) return res.status(503).json({ error: unavailableMessage })
    try {
      const result = await transport.sendMail({
        from: { name: 'Makeable.IO Website', address: sender },
        to: recipient,
        replyTo: { name: inquiry.name, address: inquiry.email },
        subject: `Project inquiry${inquiry.company ? ` — ${inquiry.company}` : ''}`,
        text: [
          'New project inquiry from the Makeable.IO website', '',
          `Name: ${inquiry.name}`, `Email: ${inquiry.email}`,
          `Company: ${inquiry.company || 'Not provided'}`,
          `Interested in: ${serviceNames[inquiry.service]}`, '',
          'Project brief:', inquiry.message,
        ].join('\n'),
      })
      if (!result.accepted?.some(address => address.toLowerCase() === recipient.toLowerCase())) {
        throw Object.assign(new Error('Recipient was not accepted'), { code: 'ERECIPIENT' })
      }
      return res.json({ sent: true })
    } catch (error) {
      // Log only a diagnostic code, keeping credentials and visitor details private.
      logger.error('Contact email delivery failed:', error.code || 'ESEND')
      return res.status(502).json({ error: 'We couldn’t send your inquiry. Please try again in a moment.' })
    }
  })

  router.use('/api/contact', (error, req, res, next) => {
    if (res.headersSent) return next(error)
    const tooLarge = error.type === 'entity.too.large'
    res.status(tooLarge ? 413 : 400).json({
      error: tooLarge ? 'Your inquiry is too long. Please shorten it and try again.' : 'Please check your inquiry and try again.',
    })
  })
  return router
}
