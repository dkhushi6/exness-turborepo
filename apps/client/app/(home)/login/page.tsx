"use client";
import { Button } from "../../../components/ui/button";
import React from "react";
// import gg from "@/public/google.png";
import { signIn } from "next-auth/react";

const page = () => {
  return (
    <div className=" flex justify-center items-center h-screen ">
      <div className=" border rounded-lg flex px-5 py-8">
        <div className="text-center">
          <div className="text-xl font-semibold">Welcome</div>
          <div className="text-[#7a7a7a] text-[13px]">
            Login with your Google account
          </div>
          <div>
            <div className="py-5">
              <Button
                className="flex gap-3 w-[50vh] "
                variant="outline"
                onClick={() => {
                  signIn("google", { callbackUrl: "/" });
                }}
              >
                <div className="flex gap-3 items-center">
                  {/* <Image src={gg} alt="google" className="w-4 h-4" /> Login with */}
                  Google
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
