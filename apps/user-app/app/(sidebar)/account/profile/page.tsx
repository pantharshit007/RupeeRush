//! This is very unpredicatable file as of now it give me random `useContext` errors, but went away if use client
//? Fixed using react as peer-dependency

import React from "react";
import { serverUser } from "@/utils/currentUser";
import UserInfo from "@/components/common/UserInfo";
import { IoPerson } from "react-icons/io5";

async function ProfilePage() {
  const user = await serverUser();

  return (
    <UserInfo
      user={user}
      label="Profile"
      logo={<IoPerson className="text-blue-500" size={"27"} />}
    />
  );
}

export default ProfilePage;
