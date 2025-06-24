import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useSignup } from "@/context/signup";
import { SignupContextType } from "@/types/signup.types";
import axios from "axios";
import { toast } from "sonner";
import { URL_BASE_PUBLIC } from "@/constants";

export default function EmailVerification() {
  const context: SignupContextType = useSignup();
  const [otp, setOtp] = useState("");

  const verifyCode = async () => {
    if (otp.length !== 5) {
      toast.error("Otp is Required");
      return;
    }
    try {
      const res = await axios.post(
        `${URL_BASE_PUBLIC}/auth/signup/verify-otp`,
        {
          email: context.signupPayload.email,
          otp,
        },
        {
          validateStatus: (status) => status < 500,
        }
      );
      if (!res.data.status) {
        toast.error(res.data.message);
        return;
      }
      context.nextStep();
    } catch (error: unknown) {
      let message = "Resend Otp failed due to server error";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      console.log(error);
      toast.error(message);
    }
    console.log(otp);
    // context.nextStep()
  };
  const resendOtp = async () => {
    try {
      const res = await axios.post(
        `${URL_BASE_PUBLIC}/auth/signup/resend-otp`,
        {
          email: context.signupPayload.email,
        },
        {
          validateStatus: (status) => status < 500,
        }
      );
      if (!res.data.status) {
        toast.error(res.data.message);
        return;
      } else {
        toast.success(res.data.message);
      }
    } catch (error: unknown) {
      let message = "Resend Otp failed due to server error";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      console.log(error);
      toast.error(message);
    }
  };
  return (
    <div className="w-[20%] max-md:w-[calc(100%-50px)]">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Email Varification</CardTitle>
          <CardDescription>
            introduce the 5 digit verification code sent to info@koalaui.com
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 flex flex-col items-center">
          <div className="w-[100%]">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="w-[100%]">
            <span
              className="cursor-pointer text-gray-600 text-[.9rem]"
              onClick={resendOtp}
            >
              Resend code
            </span>
          </div>
          <Button className="w-[100%] cursor-pointer mt-1" onClick={verifyCode}>
            Verify
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
