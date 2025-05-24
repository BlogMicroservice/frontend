import { useSignup } from "@/context/signup";
import { SignupContextType, SignupStep } from "@/types/signup.types";
import React from "react";
import SignUpPage from "./SignUpPage";
import EmailVerification from "./EmailVerification";
import UserName from "./UserName";
import Profile from "./Profile";



function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {children}
    </div>
  );
}

export default function MainSignUp() {
  const context: SignupContextType = useSignup();

  if (context.currentStepLabel === SignupStep.Signup) {
    return <Wrapper>{<SignUpPage />}</Wrapper>;
  }
  if (context.currentStepLabel === SignupStep.OTP) {
    return <Wrapper><EmailVerification/></Wrapper>;
  }
  if (context.currentStepLabel === SignupStep.UserName) {
    return <Wrapper><UserName/></Wrapper>;
  }
  if (context.currentStepLabel === SignupStep.Profile) {
    return <Wrapper><Profile/></Wrapper>;
  }

  // Optionally, add other conditions or return null
  return null;
}
