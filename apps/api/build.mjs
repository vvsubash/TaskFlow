import { rolldown } from 'rolldown'
import { rmSync, mkdirSync, copyFileSync, writeFileSync } from 'fs'

rmSync('dist', { recursive: true, force: true })
mkdirSync('dist/functions', { recursive: true })

const bundle = await rolldown({
  input: 'src/functions/httpTrigger.ts',
  platform: 'node',
  external: ['@azure/functions-core'],
})

await bundle.write({
  file: 'dist/functions/httpTrigger.js',
  format: 'cjs',
})

copyFileSync('host.json', 'dist/host.json')

writeFileSync(
  'dist/package.json',
  JSON.stringify({ name: 'api', version: '1.0.0', main: 'functions/httpTrigger.js' }, null, 2),
)
