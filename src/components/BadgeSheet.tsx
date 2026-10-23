import { useEffect, useRef, type MouseEvent } from 'react'
import type { League } from '../domain/league'
import { useSeasonBadge } from '../hooks/useSeasonBadge'
import { BadgeBox } from './BadgeBox'

interface Props {
  league: League | null
  onClose: () => void
}

/**
 * A native <dialog>: the platform gives the focus trap, Esc and the backdrop. Every way of closing
 * goes through dialog.close(), so the close event fires once and focus returns to the league card.
 */
export function BadgeSheet({ league, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const open = league !== null

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) event.currentTarget.close()
  }

  return (
    <dialog ref={ref} className="sheet" aria-labelledby="sheet-title" onClose={onClose} onClick={closeOnBackdrop}>
      {league && <SheetContent league={league} onClose={() => ref.current?.close()} />}
    </dialog>
  )
}

function SheetContent({ league, onClose }: { league: League; onClose: () => void }) {
  const badge = useSeasonBadge(league.id)
  const sub = league.alternate ? `${league.sport} · ${league.alternate}` : league.sport
  return (
    <>
      <div className="grab" aria-hidden="true" />
      <h2 id="sheet-title">{league.name}</h2>
      <p className="sub">{sub}</p>
      <BadgeBox league={league} badge={badge} />
      <button type="button" className="app-btn ghost" onClick={onClose}>
        Close
      </button>
    </>
  )
}
