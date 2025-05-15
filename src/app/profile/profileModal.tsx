"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../_components/ui/dialog";
import { Button } from "../_components/ui/button";
import { useState } from "react";
import { Label } from "../_components/ui/label";
import { Input } from "../_components/ui/input";
import Link from "next/link";

type User = {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  id?: string | null | undefined;
  preference?: string | null | undefined;
};

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
}

export default function ProfileModal({
  open,
  onOpenChange,
  user,
}: ProfileModalProps) {
  const [userId, setUserId] = useState(user?.id ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("*****");
  const [preference, setPreference] = useState(user?.preference ?? "");
  const [loading, setLoading] = useState(false);

  const [changePassword, setChangePassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          name,
          email,
          password,
          preference,
          changePassword,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create task: ${res.status}`);
      }

      await res.json();
      alert("User Details Update!");
      onOpenChange(false);
      window.location.reload();
    } catch (err) {
      console.error("Error submitting task:", err);
      alert("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white text-black">
        <DialogHeader>
          <DialogTitle>Manage Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                required
              />
            </div>
            {/* Toggle to show/hide password input */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="changePasswordToggle"
                checked={changePassword}
                onChange={() => setChangePassword(!changePassword)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <Label htmlFor="changePasswordToggle" className="cursor-pointer">
                Change Password
              </Label>
            </div>

            {/* Conditionally render password input */}
            {changePassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Set New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter New Password"
                  required
                  autoComplete="new-password"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="preference">Preference</Label>
              <Input
                id="preference"
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
                placeholder="Enter Preference"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2"></div>
          </div>

          <DialogFooter>
            <Button className="rounded-full  bg-black/20 hover:bg-black/40" type="submit">
              {"Update Profile"}
            </Button>
          </DialogFooter>
          <div className="flex justify-center">
            <Link
              href="/api/auth/signout"
              className="rounded-full bg-black/20 px-10 py-3 font-semibold no-underline transition hover:bg-black/40"
            >
              Sign out
            </Link>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
