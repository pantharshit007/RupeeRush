//! This is very unpredicatable file as of now it give me random `useContext` errors, but went away if use client
//? Fixed using react as peer-dependency

import React from "react";
import { serverUser } from "@/utils/currentUser";
import UserInfo from "@/components/common/UserInfo";
import { IoPerson } from "react-icons/io5";
import { redirect } from "next/navigation";
import { CREATE_BANK_ACCOUNT } from "@/utils/apiRoute";

async function ProfilePage() {
  const user = await serverUser();
  if (!user?.phoneNumber) {
    redirect(CREATE_BANK_ACCOUNT);
  }

  return (
    <UserInfo
      user={user}
      label="Profile"
      logo={<IoPerson className="text-blue-500" size={"27"} />}
      className="w-full h-[100dvh] flex flex-col justify-center items-center -mt-6"
    />
  );
}

export default ProfilePage;
