"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { BsTrash } from "react-icons/bs";

import { Button } from "@repo/ui/components/ui/button";

import { deleteAccountAction } from "@/actions/deleteAccount";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import DialogWrapper from "@/components/common/DialogWrapper";

interface DeleteAccountProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setSuccess: React.Dispatch<React.SetStateAction<string | undefined>>;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
}

function DeleteAccount({ setLoading, loading, setSuccess, setError }: DeleteAccountProps) {
  const [clicked, setClicked] = React.useState(false);
  const user = useCurrentUser();
  const router = useRouter();

  const email1 = process.env.DEMO_EMAIL1 || "alice@example.com";
  const email2 = process.env.DEMO_EMAIL2 || "bob@example.com";

  const handleDeleteAccount = async () => {
    setLoading(true);
    setSuccess("");
    setError("");
    setClicked(false);

    try {
      if (user?.email === email1 || user?.email === email2) {
        setError("Demo accounts cannot be deleted!");
        return;
      }

      if (!user?.id) {
        setError("User not found!");
        return;
      }

      const data = await deleteAccountAction(user?.id!);

      if (data.error) {
        setError(data.error || data.message);
        return;
      }

      setSuccess(data.success);
      setLoading(false);

      localStorage.clear();
      sessionStorage.clear();

      document.cookie = `authjs.csrf-token=${""}; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

      await signOut({ redirect: false });
      router.push("/");
    } catch (err: any) {
      console.error("Error deleting account:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="my-10 flex flex-row w-[600px] max-md:w-[400px] max-sm:w-[375px] gap-x-5 rounded-md border-[1px] border-rose-500 bg-rose-700/90 dark:bg-rose-700/60 p-8 md:px- px-9 ">
        <div className="w-16 md:w-15">
          <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-rose-700 border-[1px]">
            <BsTrash className="text-3xl text-pink-200" />
          </div>
        </div>

        <div className="flex flex-col space-y-2 text-gray-100">
          <h1 className="text-lg font-semibold text-richblack-5">Delete Account</h1>

          <div className=" w-full">
            <p>Would you like to delete account? </p>
            <p className="max-md:hidden">
              Deleting your account will permanently delete your account and all related data from
              our database.
            </p>
          </div>

          <button
            type="button"
            className="w-fit italic text-rose-300 underline cursor-pointer disabled:text-gray-500 disabled:cursor-not-allowed"
            onClick={() => setClicked(!clicked)}
            disabled={loading}
          >
            I want to delete my account.
          </button>
        </div>
      </div>

      <DialogWrapper
        title="Delete Account"
        description="This action is irreversible. Please confirm your decision."
        isDialogOpen={clicked}
        setIsDialogOpen={setClicked}
        className="w-[400px] max-md:w-[300px] max-sm:w-[275px]"
      >
        <div className="flex justify-end gap-y-2">
          <Button onClick={() => setClicked(!clicked)} className="mr-2" variant={"secondary"}>
            Cancel
          </Button>

          <Button variant={"destructive"} onClick={handleDeleteAccount} disabled={loading}>
            Delete Account
          </Button>
        </div>
      </DialogWrapper>
    </>
  );
}

export default DeleteAccount;
