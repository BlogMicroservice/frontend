
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { FaGoogle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/context/signup";
import { SignupContextType } from "@/types/signup.types";
export default function SignUpPage() {
  const context:SignupContextType=useSignup()
  const CreateAccountWithEmail=()=>{
    context.nextStep()
  }
  return (
    <div className="w-[25%] max-md:w-[calc(100%-100px)]">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Create an account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center">
          <Button className="w-[100%] cursor-pointer" variant="outline">
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
            <Input type="email" id="email" placeholder="Email" />
          </div>

          <div className=" w-[100%] grid max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Password</Label>
            <Input type="password" id="password" placeholder="password" />
          </div>
          <Button className="w-[100%] cursor-pointer mt-3" onClick={CreateAccountWithEmail}>
            Create account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
