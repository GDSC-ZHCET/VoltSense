"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import type { Timer } from "./schedule-timer"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { ChevronDown, ChevronUp, Trash2, Clock, CalendarIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type TimerItemProps = {
  timer: Timer
  onUpdate: (timer: Timer) => void
  onDelete: (id: string) => void
  onToggleExpand: (id: string) => void
}

export function TimerItem({ timer, onUpdate, onDelete, onToggleExpand }: TimerItemProps) {
  const [name, setName] = useState(timer.name)
  const [time, setTime] = useState(timer.time)
  const [date, setDate] = useState(timer.date)
  const [action, setAction] = useState(timer.action)
  const [repeat, setRepeat] = useState(timer.repeat)

  // Update local state when timer prop changes
  useEffect(() => {
    setName(timer.name)
    setTime(timer.time)
    setDate(timer.date)
    setAction(timer.action)
    setRepeat(timer.repeat)
  }, [timer])

  // Update parent component when values change
  useEffect(() => {
    const updatedTimer = {
      ...timer,
      name,
      time,
      date,
      action,
      repeat,
    }

    // Only update if values actually changed
    if (
      timer.name !== name ||
      timer.time !== time ||
      timer.date !== date ||
      timer.action !== action ||
      timer.repeat !== repeat
    ) {
      onUpdate(updatedTimer)
    }
  }, [name, time, date, action, repeat])

  const toggleEnabled = () => {
    onUpdate({
      ...timer,
      enabled: !timer.enabled,
    })
  }

  // Extract hours and minutes for display
  const [hours, minutes] = time.split(":")
  const formattedHours = Number.parseInt(hours)
  const ampm = Number.parseInt(hours) >= 12 ? "PM" : "AM"
  const displayHours = formattedHours > 12 ? formattedHours - 12 : formattedHours === 0 ? 12 : formattedHours

  return (
    <div className={`rounded-lg border transition-all ${timer.enabled ? "bg-card" : "bg-muted/40"}`}>
      {/* Timer Header - Always visible */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl font-semibold tabular-nums">
              {displayHours}:{minutes}
              <span className="text-sm ml-1">{ampm}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={timer.enabled}
              onCheckedChange={toggleEnabled}
              className="data-[state=checked]:bg-primary"
            />
            <Button variant="ghost" size="icon" onClick={() => onToggleExpand(timer.id)}>
              {timer.isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <div className="font-medium">{name}</div>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <span className="mr-2">
                {repeat === "once"
                  ? "Once"
                  : repeat === "daily"
                    ? "Every day"
                    : repeat === "weekly"
                      ? "Every week"
                      : "Every month"}
              </span>
              {repeat === "once" && (
                <span className="flex items-center">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                  {format(date, "MMM d")}
                </span>
              )}
            </div>
          </div>
          <Badge variant={action === "on" ? "default" : "destructive"} className="ml-2">
            {action === "on" ? "ON" : "OFF"}
          </Badge>
        </div>
      </div>

      {/* Expanded Settings */}
      {timer.isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t">
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Timer name" />
            </div>

            {/* Time Input */}
            <div>
              <label className="text-sm font-medium mb-1 block">Time</label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 opacity-70" />
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="flex-1" />
              </div>
            </div>

            {/* Action Select */}
            <div>
              <label className="text-sm font-medium mb-1 block">Action</label>
              <Select value={action} onValueChange={(value: "on" | "off") => setAction(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on">Turn On</SelectItem>
                  <SelectItem value="off">Turn Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Repeat Select */}
            <div>
              <label className="text-sm font-medium mb-1 block">Repeat</label>
              <Select
                value={repeat}
                onValueChange={(value: "once" | "daily" | "weekly" | "monthly") => setRepeat(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select repeat option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Once</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker (only show if repeat is "once") */}
            {repeat === "once" && (
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Delete Button */}
            <Button variant="destructive" className="w-full mt-4" onClick={() => onDelete(timer.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Timer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

