"use client";

import { useState } from "react";
import Image from "next/image";
import ProfileModal from "./profileModal";
import userImage from '../../../public/icons8-user-24.png'
type User = {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    id?: string | null | undefined;
    preference?: string | null | undefined
  };

interface ProfileProps {
  user?: User;
}
export default function Profile({ user }: ProfileProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const userImageUrl = "";

  return (
    <main>
      <button
        onClick={() => setIsProfileOpen(true)}
        className="h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-white hover:border-gray-300"
        aria-label="Open profile"
        title="Profile"
      >
        <Image
          src={userImage}
          alt="User avatar"
          width={48}
          height={48}
          className="object-cover"
          priority
        />
      </button>

      <ProfileModal
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        user={user?? undefined}
      />
    </main>
  );
}
