// "use client";

// import { useState } from "react";
// import { DashboardHeader } from "@/components/dashboard-header";
// import { DashboardShell } from "@/components/dashboard-shell";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function SchedulesPage() {
//   const [schedules, setSchedules] = useState([
//     {
//       id: 1,
//       name: "Morning On",
//       time: "07:00",
//       action: "on",
//       days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
//       active: true,
//     },
//     {
//       id: 2,
//       name: "Night Off",
//       time: "22:00",
//       action: "off",
//       days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//       active: true,
//     },
//   ]);

//   const addSchedule = () => {
//     // Logic to add a new schedule
//   };

//   return (
//     <DashboardShell>
//       <DashboardHeader heading="Schedules" text="Manage your device schedules.">
//         <Button onClick={addSchedule}>Add Schedule</Button>
//       </DashboardHeader>
//       <Tabs defaultValue="active" className="space-y-4">
//         <TabsList className="grid w-full grid-cols-2 lg:w-auto">
//           <TabsTrigger value="active">Active</TabsTrigger>
//           <TabsTrigger value="inactive">Inactive</TabsTrigger>
//         </TabsList>
//         <TabsContent value="active">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {schedules
//               .filter((s) => s.active)
//               .map((schedule) => (
//                 <Card key={schedule.id}>
//                   <CardHeader>
//                     <CardTitle className="flex items-center justify-between">
//                       {schedule.name}
//                       <Switch
//                         checked={schedule.active}
//                         onCheckedChange={(checked) => {
//                           // Logic to update schedule active state
//                         }}
//                       />
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <div className="flex items-center space-x-2">
//                         <Label htmlFor={`time-${schedule.id}`}>Time:</Label>
//                         <Input
//                           id={`time-${schedule.id}`}
//                           type="time"
//                           value={schedule.time}
//                           onChange={() => {}}
//                         />
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Label htmlFor={`action-${schedule.id}`}>Action:</Label>
//                         <select
//                           id={`action-${schedule.id}`}
//                           value={schedule.action}
//                           onChange={() => {}}
//                           className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
//                         >
//                           <option value="on">Turn On</option>
//                           <option value="off">Turn Off</option>
//                         </select>
//                       </div>
//                       <div className="space-y-1">
//                         <Label>Days:</Label>
//                         <div className="flex flex-wrap gap-2 mt-2">
//                           {[
//                             "Mon",
//                             "Tue",
//                             "Wed",
//                             "Thu",
//                             "Fri",
//                             "Sat",
//                             "Sun",
//                           ].map((day) => (
//                             <Button
//                               key={day}
//                               variant={
//                                 schedule.days.includes(day)
//                                   ? "default"
//                                   : "outline"
//                               }
//                               size="sm"
//                               onClick={() => {
//                                 // Logic to toggle day selection
//                               }}
//                             >
//                               {day}
//                             </Button>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//           </div>
//         </TabsContent>
//         <TabsContent value="inactive">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {schedules
//               .filter((s) => !s.active)
//               .map((schedule) => (
//                 <Card key={schedule.id}>
//                   <CardHeader>
//                     <CardTitle className="flex items-center justify-between">
//                       {schedule.name}
//                       <Switch
//                         checked={schedule.active}
//                         onCheckedChange={(checked) => {
//                           // Logic to update schedule active state
//                         }}
//                       />
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <div className="flex items-center space-x-2">
//                         <Label htmlFor={`time-${schedule.id}`}>Time:</Label>
//                         <Input
//                           id={`time-${schedule.id}`}
//                           type="time"
//                           value={schedule.time}
//                           onChange={() => {}}
//                           disabled
//                         />
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Label htmlFor={`action-${schedule.id}`}>Action:</Label>
//                         <select
//                           id={`action-${schedule.id}`}
//                           value={schedule.action}
//                           onChange={() => {}}
//                           className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
//                           disabled
//                         >
//                           <option value="on">Turn On</option>
//                           <option value="off">Turn Off</option>
//                         </select>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </DashboardShell>
//   );
// }
