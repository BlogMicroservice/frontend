import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/context/signup";
import {
  GoogleSignupInfo,
  SignupContextType,
  SignupMethod,
  SignupPayload,
} from "@/types/signup.types";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";
import { URL_BASE_PUBLIC } from "@/constants";

export default function SignUpPage() {
  const context: SignupContextType = useSignup();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const CreateAccountWithEmail = async () => {
    // console.log("hi")
    if (email.length === 0 || password.length === 0) {
      toast.error("Email and password is required");
      return;
    }
    try {
       
      const res = await axios.post(
        `${URL_BASE_PUBLIC}/auth/signup/signup-email`,
        {
          email,
          password,
        },
        {
          validateStatus: (status) => status < 500,
        }
      );
      console.log("hi")
      if (!res.data.status) {
        toast.error(res.data.message);
        return;
      }
      console.log(res.data);
      const payload: SignupPayload = {
        method: SignupMethod.Email,
        verified: false,
        username: "",
        email: email,
        providerToken: email,
      };
      context.setSignupPayload(payload);
      context.nextStep();
    } catch (error: unknown) {
      let message = "Signup failed due to server error";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      console.log(error);
      toast.error(message);
    }
  };
  const CreateAccountWithGoogleAuth = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        if (!codeResponse.code) {
          toast.error("Google Auth failed: Missing authorization code");
          return;
        }

        console.log("Google Auth Code:", codeResponse.code);

        const res = await axios.post(
          `${URL_BASE_PUBLIC}/auth/signup/signup-google`,
          {
            code: codeResponse.code,
          },
          {
            validateStatus: (status) => status < 500,
          }
        );

        if (!res.data.status) {
          toast.error(res.data.message);
          return;
        }
        const data: GoogleSignupInfo = res.data.payload;

        const payload: SignupPayload = {
          method: SignupMethod.Google,
          verified: false,
          username: "",
          email: data.email,
          providerToken: data.providerId,
        };
        context.setSignupPayload(payload);
        context.nextStep();
      } catch (error: unknown) {
        // console.error("Signup error:", error);

        let message = "Signup failed due to server error";

        if (axios.isAxiosError(error)) {
          message = error.response?.data?.message || message;
        }

        toast.error(message);
      }
    },

    onError: () => {
      toast.error("Google signup failed");
    },

    flow: "auth-code",
  });
  return (
    <div className="w-[25%] max-md:w-[calc(100%-100px)]">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Create an account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center">
          <Button
            className="w-[100%] cursor-pointer"
            variant="outline"
            onClick={() => {
              CreateAccountWithGoogleAuth();
            }}
          >
            <FaGoogle /> Google
          </Button>
          <div className="w-[100%] flex justify-between h-[20px] items-center">
            <div className="w-1/4 ">
              {" "}
              <Separator className="w-5"></Separator>
            </div>
            <div className="text-[.8rem] font-semibold uppercase">
              Or continue with
            </div>
            <div className="w-1/4 ">
              {" "}
              <Separator className="w-5"></Separator>
            </div>
          </div>
          <div className=" w-[100%] grid max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>

          <div className=" w-[100%] grid max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <Button
            className="w-[100%] cursor-pointer mt-3"
            onClick={CreateAccountWithEmail}
          >
            Create account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
