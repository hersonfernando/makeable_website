import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
import test from 'node:test'
import { createContactHandler } from './contact.js'

const environment = {
  SMTP_HOST: 'smtp.example.com', SMTP_PORT: '465', SMTP_SECURE: 'true',
  SMTP_USER: 'sender@example.com', SMTP_PASS: 'test-only-password',
  CONTACT_EMAIL: 'team@example.com',
}
const inquiry = {
  name: ' Alex Santos ', email: ' alex@example.com ', company: ' Example & Co ',
  service: 'cloud', message: ' We need a cloud subscription and migration plan. ',
}

async function fixture(t, { env = environment, deliver } = {}) {
  const messages = []
  const logs = []
  let transportOptions
  const handler = createContactHandler(env, {
    logger: { warn: (...args) => logs.push(args), error: (...args) => logs.push(args) },
    transportFactory(options) {
      transportOptions = options
      return {
        async sendMail(message) {
          messages.push(message)
          return deliver ? deliver(message) : { accepted: [message.to] }
        },
      }
    },
  })
  // Mount on raw Node requests, just like Vite's Connect middleware.
  const server = createServer((req, res) => handler(req, res, () => { res.statusCode = 404; res.end() }))
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }))
  const url = `http://127.0.0.1:${server.address().port}/api/contact`
  return {
    messages, logs, transportOptions, url,
    async submit(body = inquiry, options = {}) {
      const response = await fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body), ...options,
      })
      return { status: response.status, body: await response.json(), headers: response.headers }
    },
  }
}

test('delivers the brief to the configured team with the visitor as Reply-To', async t => {
  const api = await fixture(t)
  const result = await api.submit({ ...inquiry, to: 'other@example.com', from: 'spoof@example.com' })
  assert.deepEqual(result.body, { sent: true })
  assert.equal(result.status, 200)
  assert.equal(result.headers.get('cache-control'), 'no-store')
  assert.equal(api.messages.length, 1)
  const message = api.messages[0]
  assert.equal(message.to, 'team@example.com')
  assert.equal(message.from.address, 'sender@example.com')
  assert.deepEqual(message.replyTo, { name: 'Alex Santos', address: 'alex@example.com' })
  assert.match(message.subject, /Example & Co/)
  assert.match(message.text, /Name: Alex Santos\nEmail: alex@example.com\nCompany: Example & Co/)
  assert.match(message.text, /Interested in: Cloud solutions/)
  assert.match(message.text, /cloud subscription and migration plan/)
  assert.equal(api.transportOptions.secure, true)
  assert.equal(api.transportOptions.disableFileAccess, true)
  assert.equal(api.transportOptions.disableUrlAccess, true)
})

test('does not confirm success before the delivery provider accepts the message', async t => {
  let finishDelivery
  let startedDelivery
  const started = new Promise(resolve => { startedDelivery = resolve })
  const delivery = new Promise(resolve => { finishDelivery = resolve })
  const api = await fixture(t, { deliver: () => { startedDelivery(); return delivery } })
  let completed = false
  const pending = api.submit().then(result => { completed = true; return result })
  await started
  assert.equal(completed, false)
  finishDelivery({ accepted: ['team@example.com'] })
  assert.equal((await pending).status, 200)
})

test('rejects invalid details and header injection without sending', async t => {
  const api = await fixture(t)
  for (const details of [
    { ...inquiry, email: 'invalid-email' },
    { ...inquiry, name: 'Alex\r\nBcc: someone@example.com' },
    { ...inquiry, service: 'toString' },
    { ...inquiry, message: '                 ' },
    { ...inquiry, company: ['Unexpected array'] },
  ]) {
    assert.equal((await api.submit(details)).status, 422)
  }
  assert.equal(api.messages.length, 0)
})

test('accepts an optional company and the help-choosing service', async t => {
  const api = await fixture(t)
  const result = await api.submit({ ...inquiry, company: undefined, service: 'unsure' })
  assert.equal(result.status, 200)
  assert.match(api.messages[0].text, /Company: Not provided/)
  assert.match(api.messages[0].text, /Help choosing the right solution/)
})

test('reports unavailable delivery when SMTP is not configured', async t => {
  const api = await fixture(t, { env: {} })
  const result = await api.submit()
  assert.equal(result.status, 503)
  assert.equal(result.body.sent, undefined)
  assert.equal(api.messages.length, 0)
})

test('reports SMTP failure without exposing credentials or visitor details', async t => {
  const api = await fixture(t, { deliver() {
    throw Object.assign(new Error('Sensitive provider response: test-only-password'), { code: 'EAUTH' })
  } })
  const result = await api.submit()
  assert.equal(result.status, 502)
  assert.equal(result.body.sent, undefined)
  assert.doesNotMatch(JSON.stringify([result.body, api.logs]), /test-only-password|alex@example.com/)
  assert.match(JSON.stringify(api.logs), /EAUTH/)
})

test('does not confirm success for a rejected recipient', async t => {
  const api = await fixture(t, { deliver: () => ({ accepted: [], rejected: ['team@example.com'] }) })
  const result = await api.submit()
  assert.equal(result.status, 502)
  assert.equal(result.body.sent, undefined)
})

test('rate limits repeated submissions and ignores untrusted forwarded addresses', async t => {
  const api = await fixture(t)
  for (let index = 0; index < 5; index++) {
    const result = await api.submit(inquiry, { headers: {
      'Content-Type': 'application/json', 'X-Forwarded-For': `192.0.2.${index}`,
    } })
    assert.equal(result.status, 200)
  }
  const result = await api.submit()
  assert.equal(result.status, 429)
  assert.ok(Number(result.headers.get('retry-after')) > 0)
  assert.equal(api.messages.length, 5)
})

test('blocks cross-origin submissions and honeypot entries', async t => {
  const api = await fixture(t)
  assert.equal((await api.submit(inquiry, { headers: {
    'Content-Type': 'application/json', Origin: 'https://other.example.com',
  } })).status, 403)
  assert.equal((await api.submit({ ...inquiry, website: 'spam.example.com' })).status, 422)
  assert.equal(api.messages.length, 0)
})

test('handles malformed and oversized payloads, non-JSON bodies, and unsupported methods', async t => {
  const api = await fixture(t)
  assert.equal((await api.submit(null, { body: '{broken' })).status, 400)
  assert.equal((await api.submit({ ...inquiry, message: 'x'.repeat(17000) })).status, 413)
  assert.equal((await api.submit(null, { headers: { 'Content-Type': 'text/plain' }, body: 'text' })).status, 415)
  const response = await fetch(api.url)
  assert.equal(response.status, 405)
  assert.equal(response.headers.get('allow'), 'POST')
  assert.equal(api.messages.length, 0)
})

test('port 587 requires STARTTLS and preserves the existing recipient setting', async t => {
  const api = await fixture(t, { env: {
    ...environment, CONTACT_EMAIL: '', VITE_CONTACT_EMAIL: 'legacy@example.com', SMTP_PORT: '587', SMTP_SECURE: 'false',
  } })
  assert.equal((await api.submit()).status, 200)
  assert.equal(api.messages[0].to, 'legacy@example.com')
  assert.equal(api.transportOptions.secure, false)
  assert.equal(api.transportOptions.requireTLS, true)
})
