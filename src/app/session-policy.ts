/** Session-policy helpers: the only Sessions dsh-superagent owns, and which workspace paths it manages. */
import { isAbsolute, relative, resolve, sep } from 'node:path'

/** Returns the IDs of every Session dsh-superagent owns: one orchestrator and one worker per Ticket. */
export function managedSessionIds(masterId: string, tickets: readonly { id: string }[]): string[] {
  return [masterId, ...tickets.map(ticket => `worker-${ticket.id}`)]
}

/** Whether `path` is `root` or a descendant of it, after resolving both. */
export function withinRoot(root: string, path: string): boolean {
  if (!root || !path) return false
  const rel = relative(resolve(root), resolve(path))
  return rel === '' || (!rel.startsWith(`..${sep}`) && rel !== '..' && !isAbsolute(rel))
}

/** Whether `path` is inside at least one managed root. */
export function withinAnyRoot(roots: readonly string[], path: string): boolean {
  return roots.some(root => withinRoot(root, path))
}
