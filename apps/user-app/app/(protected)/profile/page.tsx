import React from "react";
import { currentUser } from "@/utils/currentUser";
import UserInfo from "@/components/common/UserInfo";
import { BsPerson } from "react-icons/bs";

async function ProfilePage() {
  const user = await currentUser();

  return (
    <UserInfo
      user={user}
      label="Profile"
      logo={<BsPerson className="text-blue-500" size={"30"} />}
    />
  );
}

export default ProfilePage;
