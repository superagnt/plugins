/**
 * dsh-plugin-superagnt — superagnt for DeepSeek Harness (Cordis plugin).
 *
 * Delivers the same three-part install unit as the Claude/Codex plugins:
 * the superagnt MCP server + the base skill set, from the shared plugins
 * repo (docs/mcp-distributionmaxxing.md §3 — this file ships inside
 * github.com/superagnt/plugins, repo topic `dsh-plugin`).
 *
 * VERIFY-BEFORE-PUBLISH (codex-plugins-mirror-spec §6 pattern; dsh checks in
 * clawhub-revamp-spec track 3): the ctx.skills.register signature and the MCP
 * client service name below come from the 2026-09-11 research pass and are
 * unverified against a live dsh install. The cold-install verification
 * session confirms or corrects both before this repo is tagged/submitted.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'superagnt'
export const inject = { optional: ['skills', 'mcp'] }

const SKILLS_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'plugins',
  'superagnt',
  'skills',
)
const MCP_URL = 'https://mcp.superagnt.com/mcp'

export function apply(ctx) {
  // Skills: register every base skill bundled in this repo.
  if (ctx.skills?.register && existsSync(SKILLS_DIR)) {
    for (const dir of readdirSync(SKILLS_DIR).sort()) {
      const skillPath = join(SKILLS_DIR, dir, 'SKILL.md')
      if (!existsSync(skillPath)) continue
      ctx.skills.register({
        name: dir,
        path: skillPath,
        content: readFileSync(skillPath, 'utf8'),
      })
    }
  }

  // MCP: preconfigure the superagnt endpoint (streamable HTTP; the server
  // publishes OAuth discovery, so no token is required up front — the first
  // call opens the consent screen, which doubles as signup).
  if (ctx.mcp?.addServer) {
    ctx.mcp.addServer({
      name: 'superagnt',
      type: 'streamable-http',
      url: MCP_URL,
    })
  }
}
