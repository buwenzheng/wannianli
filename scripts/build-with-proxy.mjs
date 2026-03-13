#!/usr/bin/env node
/**
 * 本地打包脚本：通过代理下载 NSIS/WiX 等依赖，解决网络受限环境下的打包失败。
 * 可通过环境变量 PROXY_URL 覆盖代理地址，默认 http://127.0.0.1:7890（Clash 常用端口）。
 * 在 CI（如 GitHub Actions）中会自动跳过代理，直接执行 tauri build。
 */

/* eslint-disable */
import { spawnSync } from 'node:child_process'
import { env } from 'node:process'

const isCI = env.CI === 'true' || env.GITHUB_ACTIONS === 'true'
const proxyUrl = env.PROXY_URL || 'http://127.0.0.1:7890'

const buildEnv = { ...env }
if (!isCI) {
  buildEnv.HTTP_PROXY = proxyUrl
  buildEnv.HTTPS_PROXY = proxyUrl
  buildEnv.http_proxy = proxyUrl
  buildEnv.https_proxy = proxyUrl
  console.log('[build-with-proxy] Using proxy:', proxyUrl)
} else {
  console.log('[build-with-proxy] CI detected, skipping proxy')
}

const result = spawnSync('npx', ['tauri', 'build'], {
  stdio: 'inherit',
  env: buildEnv,
  shell: true,
})

process.exit(result.status ?? 1)
