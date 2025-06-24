import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { URL_BASE_PUBLIC } from "@/constants";
import { useSignup } from "@/context/signup";
import { SignupContextType, SignupPayload } from "@/types/signup.types";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";

export default function UserName() {
  const [username, setuserName] = useState("");
  const [userSuggestion, setUserSuggestion] = useState<null | string[]>(null);
  const context: SignupContextType = useSignup();
  const createUserName = async () => {
    setUserSuggestion(null);
    try {
      const res = await axios.post(
        `${URL_BASE_PUBLIC}/auth/signup/create-account`,
        {
          signUpOption: context.signupPayload.method,
          email: context.signupPayload.email,
          username,
        },
        {
          validateStatus: (status) => status < 500,
        }
      );

      console.log("respnse.data", res?.data);
      if (!res.data.status) {
        toast.error(res.data?.message || "Failed to create username");
        if (res?.data?.data?.suggestions?.length) {
          setUserSuggestion(res.data.data.suggestions);
          return;
        }
        return;
      }

      console.log("Username creation response:", res.data);
      const payload: SignupPayload = context.signupPayload;
      payload.userId = res.data.userId;
      context.setSignupPayload(payload);
      toast.success("Google signup successful");
      context.nextStep();
    } catch (error: unknown) {
      console.error("Error creating username:", error);

      let message = "Something went wrong during account creation";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }

      toast.error(message);
    }
  };
  return (
    <div className="w-[25%] max-md:w-[calc(100%-50px)]">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create your Username </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 flex flex-col items-center">
          <Input
            type="text"
            id="UserName"
            placeholder="User Name"
            value={username}
            onChange={(e) => {
              setuserName(e.target.value);
            }}
          />
          <div className=" w-[100%] text-[.8rem] text-gray-600 mt-3">
            {userSuggestion
              ? `Username already exists. You can use: ${userSuggestion.join(
                  ", "
                )}`
              : "Username must be 3–20 characters long. Only letters, numbers, and underscores are allowed."}
          </div>
          <Button
            className="w-[100%] cursor-pointer mt-2"
            onClick={createUserName}
          >
            Next
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
