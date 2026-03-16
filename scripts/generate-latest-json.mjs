#!/usr/bin/env node
/**
 * 生成 Tauri Updater 使用的 latest-<target>-<arch>.json
 *
 * 用法（在 GitHub Actions 中）:
 *   node scripts/generate-latest-json.mjs windows x86_64
 *   node scripts/generate-latest-json.mjs darwin aarch64
 *
 * 依赖环境变量:
 *   - RELEASE_TAG: 例如 v1.0.1
 *   - GITHUB_REPOSITORY: 例如 buwenzheng/wannianli
 */

/* eslint-disable */
import fs from 'node:fs'
import path from 'node:path'

const [, , platform, arch] = process.argv

if (!platform || !arch) {
  console.error('Usage: node generate-latest-json.mjs <platform> <arch>')
  process.exit(1)
}

const tag = process.env.RELEASE_TAG
const repo = process.env.GITHUB_REPOSITORY

if (!tag || !repo) {
  console.error('RELEASE_TAG or GITHUB_REPOSITORY is not set')
  process.exit(1)
}

const version = tag.replace(/^v/i, '')

const bundleDir = path.join('src-tauri', 'target', 'release', 'bundle')

const platformConfig = {
  windows: { subDir: 'nsis', ext: '.exe' },
  darwin:  { subDir: 'macos', ext: '.app.tar.gz' },
}

const cfg = platformConfig[platform]
if (!cfg) {
  console.error(`Unsupported platform: ${platform}`)
  process.exit(1)
}

const dir = path.join(bundleDir, cfg.subDir)
const files = fs.readdirSync(dir)
const installer = files.find(f => f.endsWith(cfg.ext) && !f.endsWith('.sig'))
if (!installer) {
  console.error(`No updater bundle (*${cfg.ext}) found in ${dir}`)
  console.error('Files in directory:', files.join(', '))
  process.exit(1)
}

const installerPath = path.join(dir, installer)
const sigPath = `${installerPath}.sig`

if (!fs.existsSync(sigPath)) {
  console.error(`Signature file not found: ${sigPath}`)
  process.exit(1)
}

const signature = fs.readFileSync(sigPath, 'utf8').trim()
const url = `https://github.com/${repo}/releases/download/${tag}/${installer}`

const key = `${platform}-${arch}`

const latest = {
  version,
  pub_date: new Date().toISOString(),
  notes: '',
  platforms: {
    [key]: {
      signature,
      url,
    },
  },
}

const outName = `latest-${platform}-${arch}.json`
const outPath = path.join(bundleDir, outName)

fs.writeFileSync(outPath, JSON.stringify(latest, null, 2), 'utf8')
console.log(`Generated ${outPath}`)

