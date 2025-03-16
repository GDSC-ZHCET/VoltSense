"use client"

import { useState } from "react"
import { CalendarIcon, Clock, X } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMediaQuery } from "@/hooks/use-mobile"
import type { Timer } from "./schedule-timer"

type TimerModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Timer | Omit<Timer, "id">) => void
  initialData?: Timer | null
  mode: "add" | "edit"
}

export function TimerModal({ isOpen, onClose, onSubmit, initialData, mode }: TimerModalProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [action, setAction] = useState<"on" | "off">(initialData?.action || "on")
  const [time, setTime] = useState(initialData?.time || "12:00")
  const [date, setDate] = useState<Date>(initialData?.date || new Date())
  const [repeat, setRepeat] = useState<"once" | "daily" | "weekly" | "monthly">(initialData?.repeat || "once")

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleSubmit = () => {
    if (mode === "edit" && initialData) {
      onSubmit({
        ...initialData,
        name,
        action,
        time,
        date,
        repeat,
      })
    } else {
      onSubmit({
        name,
        action,
        time,
        date,
        repeat,
        enabled: true,
      })
    }
    resetForm()
  }

  const resetForm = () => {
    if (!initialData) {
      setName("")
      setAction("on")
      setTime("12:00")
      setDate(new Date())
      setRepeat("once")
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const content = (
    <div className="space-y-6 py-2">
      <div className="space-y-2">
        <label className="text-sm font-medium">Timer Name</label>
        <Input placeholder="e.g., Morning Lights" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Action</label>
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Time</label>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 opacity-70" />
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="flex-1" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Repeat</label>
          <Select value={repeat} onValueChange={(value: "once" | "daily" | "weekly" | "monthly") => setRepeat(value)}>
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
      </div>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{mode === "add" ? "Add New Timer" : "Edit Timer"}</DialogTitle>
          </DialogHeader>
          {content}
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{mode === "add" ? "Add Timer" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{mode === "add" ? "Add New Timer" : "Edit Timer"}</DrawerTitle>
          <DrawerClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DrawerClose>
        </DrawerHeader>
        <div className="px-4">{content}</div>
        <DrawerFooter className="pt-2">
          <Button onClick={handleSubmit}>{mode === "add" ? "Add Timer" : "Save Changes"}</Button>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

