"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useGoogleLogin } from "@react-oauth/google";
// import axios from "axios";
import { toast } from "sonner";
import axios from "axios";
import { URL_BASE_PUBLIC } from "@/constants";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const router = useRouter();
  const CreateAccountWithGoogleAuth = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse.code);

      try {
        const res = await axios.post(
          `${URL_BASE_PUBLIC}/auth/login/login-google`,
          {
            code:codeResponse.code,
          },
          {
            withCredentials: true,
            validateStatus: (status) => status < 500,
          }
        );
        console.log("hi after request", res);
        if (!res.data.status) {
          console.log("login  email", res.data);
          toast.error(res.data.message);
          return;
        } else {
          localStorage.setItem(
            "profile",
            JSON.stringify({
              username: res.data.userName,
              profileImage: res.data.profileImage,
            })
          );
          router.push("/")
        }
      } catch (error: unknown) {
        let message = "Login failed due to server error";
        if (axios.isAxiosError(error)) {
          message = error.response?.data?.message || message;
        }
        console.log(error);
        toast.error(message);
      }
    },

    onError: () => {
      toast.error("Google signup failed");
    },

    flow: "auth-code",
  });

  const LoginWithEmail = async () => {
    console.log("hi");
    try {
      const res = await axios.post(
        `${URL_BASE_PUBLIC}/auth/login/login-email`,
        {
          email: email,
          password,
        },
        {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        }
      );
      console.log("hi after request", res);
      if (!res.data.status) {
        console.log("login  email", res.data);
        toast.error(res.data.message);
        return;
      } else {
        localStorage.setItem(
          "profile",
          JSON.stringify({
            username: res.data.data.userName,
            profileImage: res.data.data.profileImage,
          })
        );
        router.push("/")
      }
    } catch (error: unknown) {
      let message = "Login failed due to server error";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      console.log(error);
      toast.error(message);
    }
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-[25%] max-md:w-[calc(100%-100px)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Login</CardTitle>
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
              onClick={LoginWithEmail}
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
