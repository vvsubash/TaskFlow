#!/usr/bin/env node
// Builds and deploys to Azure Static Web Apps.
// Web is pre-built locally; API is staged with real node_modules (not pnpm symlinks).
import { execSync } from 'child_process'
import { rmSync, mkdirSync, copyFileSync, cpSync } from 'fs'
import { resolve } from 'path'

const root = new URL('..', import.meta.url).pathname
const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', cwd: root, ...opts })

const token = process.env.SWA_DEPLOYMENT_TOKEN
if (!token) {
  console.error('SWA_DEPLOYMENT_TOKEN is not set')
  process.exit(1)
}

console.log('\n→ Building web and API...')
run('pnpm --filter @taskflow/web build')
run('pnpm --filter @taskflow/api build')

// Stage the API: copy only the files Azure needs, then npm install for real node_modules
console.log('\n→ Staging API for deployment...')
const stage = resolve(root, '.deploy/api')
rmSync(stage, { recursive: true, force: true })
mkdirSync(stage, { recursive: true })

copyFileSync(resolve(root, 'apps/api/host.json'), `${stage}/host.json`)
copyFileSync(resolve(root, 'apps/api/package.json'), `${stage}/package.json`)
cpSync(resolve(root, 'apps/api/dist'), `${stage}/dist`, { recursive: true })

console.log('\n→ Installing production dependencies (real node_modules, no symlinks)...')
run('npm install --omit=dev --no-package-lock', { cwd: stage })

console.log('\n→ Deploying to Azure Static Web Apps...')
run(
  `swa deploy apps/web/dist --api-location .deploy/api --api-language node --api-version 20 --deployment-token ${token}`,
)

console.log('\n✓ Deploy complete')
