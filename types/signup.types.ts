import { Dispatch, SetStateAction } from "react";

export enum SignupMethod {
  Google = "Google",
  Email = "Email"
}

export type SignupPayload = {
  method: SignupMethod;
  email?: string;
  verified: boolean;
  username: string;
  providerToken?: string;
};


export type SignupContextType = {
  signupPayload: SignupPayload;
  setSignupPayload: Dispatch<SetStateAction<SignupPayload>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  nextStep: () => void;
  currentStepLabel: string;
};
export enum SignupStep {
  Signup = "Signup",
  OTP = "OTP",
  UserName = "UserName",
  Profile = "Profile",
}

