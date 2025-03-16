"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { TimerList } from "./timer-list"
import { Button } from "@/components/ui/button"

export type Timer = {
  id: string
  name: string
  action: "on" | "off"
  time: string
  date: Date
  repeat: "once" | "daily" | "weekly" | "monthly"
  enabled: boolean
  isExpanded?: boolean
}

export function ScheduleTimer() {
  const [timers, setTimers] = useState<Timer[]>([
    {
      id: "1",
      name: "Morning lights",
      action: "on",
      time: "07:00",
      date: new Date(),
      repeat: "daily",
      enabled: true,
      isExpanded: false,
    },
    {
      id: "2",
      name: "Evening lights",
      action: "off",
      time: "22:00",
      date: new Date(),
      repeat: "daily",
      enabled: true,
      isExpanded: false,
    },
    {
      id: "3",
      name: "Weekend mode",
      action: "on",
      time: "10:00",
      date: new Date(),
      repeat: "weekly",
      enabled: false,
      isExpanded: false,
    },
  ])

  const addTimer = () => {
    const newTimer = {
      id: Math.random().toString(36).substring(2, 9),
      name: "New Timer",
      action: "on" as const,
      time: "12:00",
      date: new Date(),
      repeat: "once" as const,
      enabled: true,
      isExpanded: true,
    }
    setTimers([...timers, newTimer])
  }

  const updateTimer = (updatedTimer: Timer) => {
    setTimers(timers.map((timer) => (timer.id === updatedTimer.id ? updatedTimer : timer)))
  }

  const deleteTimer = (id: string) => {
    setTimers(timers.filter((timer) => timer.id !== id))
  }

  const toggleExpand = (id: string) => {
    setTimers(timers.map((timer) => (timer.id === id ? { ...timer, isExpanded: !timer.isExpanded } : timer)))
  }

  return (
    <div className="flex flex-col h-screen">
      {/* App Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">Schedule Timer</h1>
          <Button onClick={addTimer} size="icon" variant="ghost" className="rounded-full h-10 w-10">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Timer List */}
      <div className="flex-1 overflow-auto">
        <TimerList timers={timers} onUpdate={updateTimer} onDelete={deleteTimer} onToggleExpand={toggleExpand} />
      </div>
    </div>
  )
}

