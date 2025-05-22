"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Server, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  onSnapshot,
} from "firebase/firestore";

export default function DeviceManagerBox({
  selectedDevice,
  setSelectedDevice,
}: {
  selectedDevice: string;
  setSelectedDevice: (device: string) => void;
}) {
  const [devices, setDevices] = useState<string[]>([]);
  const [newDevice, setNewDevice] = useState("");
  const [open, setOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "devices", selectedDevice));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deviceNames = snapshot.docs.map((doc) => doc.id);
      setDevices(deviceNames);
    });

    return () => unsubscribe();
  }, []);

  const handleAddDevice = async () => {
    if (!newDevice) return;
    const deviceRef = doc(db, "devices", newDevice);
    await setDoc(deviceRef, {
      device_id: newDevice,
      status: "off",
      last_updated: new Date().toISOString(),
    });
    setSelectedDevice(newDevice); // auto-select after add
    setNewDevice("");
    setOpen(false);
  };

  const handleDeleteDevice = async () => {
    if (!selectedDevice) return;
    await deleteDoc(doc(db, "devices", selectedDevice));
    setSelectedDevice(""); // clear UI selection
    setShowDeleteConfirm(false);
  };

  return (
    <Card className="bg-white shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl font-semibold">
          <span className="flex items-center gap-2">
            <Server className="h-6 w-6 text-blue-600" />
            Connected Devices
          </span>
          {selectedDevice && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-sm"
            >
              <Trash className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {devices.map((device) => (
            <Button
              key={device}
              variant={device === selectedDevice ? "default" : "outline"}
              onClick={() => setSelectedDevice(device)}
              className="capitalize"
            >
              {device}
            </Button>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="mt-4 w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Device
            </Button>
          </DialogTrigger>
          <DialogContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Add New Device</h2>
            <Input
              placeholder="Enter device name"
              value={newDevice}
              onChange={(e) => setNewDevice(e.target.value)}
            />
            <Button onClick={handleAddDevice} className="w-full">
              Add Device
            </Button>
          </DialogContent>
        </Dialog>
      </CardContent>

      {/* Remove Confirmation Modal */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{selectedDevice}</strong>{" "}
              from your device list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDevice}>
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
