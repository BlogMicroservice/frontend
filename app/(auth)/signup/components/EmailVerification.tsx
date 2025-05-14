import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function EmailVerification() {
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
            <InputOTP maxLength={6}>
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
            <span className="cursor-pointer text-gray-600 text-[.9rem]">Resend code</span>
          </div>
          <Button className="w-[100%] cursor-pointer mt-1">Verify</Button>
        </CardContent>
      </Card>
    </div>
  );
}
