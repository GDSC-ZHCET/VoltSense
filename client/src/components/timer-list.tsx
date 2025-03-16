"use client"

import type { Timer } from "./schedule-timer"
import { TimerItem } from "./timer-item"

type TimerListProps = {
  timers: Timer[]
  onUpdate: (timer: Timer) => void
  onDelete: (id: string) => void
  onToggleExpand: (id: string) => void
}

export function TimerList({ timers, onUpdate, onDelete, onToggleExpand }: TimerListProps) {
  // Sort timers by time
  const sortedTimers = [...timers].sort((a, b) => {
    return a.time.localeCompare(b.time)
  })

  return (
    <div className="p-4 space-y-4">
      {sortedTimers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 text-center">
          <p className="text-muted-foreground mb-2">No timers yet</p>
          <p className="text-sm text-muted-foreground">Tap the + button to create your first timer</p>
        </div>
      ) : (
        sortedTimers.map((timer) => (
          <TimerItem
            key={timer.id}
            timer={timer}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onToggleExpand={onToggleExpand}
          />
        ))
      )}
    </div>
  )
}

