/** Session policy: the exact Session set dsh-superagent owns, and workspace-root containment for reconciliation. */
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { managedSessionIds, withinAnyRoot, withinRoot } from '../src/app/session-policy.ts'

describe('session policy', () => {
  it('owns one orchestrator Session and exactly one worker Session per Ticket', () => {
    expect(managedSessionIds('orchestrator-abc', [{ id: 't1' }, { id: 't2' }]))
      .toEqual(['orchestrator-abc', 'worker-t1', 'worker-t2'])
  })

  it('does not duplicate a worker when the same Ticket is listed once', () => {
    const ids = managedSessionIds('orchestrator-abc', [{ id: 't1' }])
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.filter(id => id === 'worker-t1')).toHaveLength(1)
  })

  it('contains a root itself and descendants but not siblings or parent paths', () => {
    const root = join('/tmp', 'state', 'work')
    expect(withinRoot(root, root)).toBe(true)
    expect(withinRoot(root, join(root, 'ticket-1'))).toBe(true)
    expect(withinRoot(root, join('/tmp', 'state', 'work-other'))).toBe(false)
    expect(withinRoot(root, join('/tmp', 'state'))).toBe(false)
    expect(withinAnyRoot([root, '/tmp/state'], join('/tmp/state', 'ticket-2'))).toBe(true)
  })
})
