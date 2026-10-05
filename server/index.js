import 'dotenv/config'
import express from 'express'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const distDirectory = fileURLToPath(new URL('../dist/', import.meta.url))
if (!existsSync(`${distDirectory}/index.html`)) {
  console.error('Build the website with npm run build before starting the production server.')
  process.exit(1)
}

const app = express()
app.disable('x-powered-by')
app.use('/api', (req, res) => res.status(404).json({ error: 'Endpoint not found.' }))
app.use(express.static(distDirectory))
app.get('/{*path}', (req, res) => res.sendFile(`${distDirectory}/index.html`))

const port = Number(process.env.PORT || 3000)
app.listen(port, process.env.HOST || '0.0.0.0', () => {
  console.log(`Makeable.IO is running on port ${port}.`)
})
