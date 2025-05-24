import {
  SignupContextType,
  SignupMethod,
  SignupPayload,
  SignupStep,
} from "@/types/signup.types";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

const SignupContext = createContext<SignupContextType | null>(null);

const initialSignupPayload: SignupPayload = {
  method: SignupMethod.Email,
  verified: false,
  username: "",
  email: "",
  providerToken: "",
  userId:""
};

const SignupFlow: Record<SignupMethod, SignupStep[]> = {
  [SignupMethod.Google]: [
    SignupStep.Signup,
    SignupStep.UserName,
  ],
  [SignupMethod.Email]: [
    SignupStep.Signup,
    SignupStep.OTP,
    SignupStep.UserName,
  ],
};

export function SignupProvider({ children }: { children: ReactNode }) {
  const [signupPayload, setSignupPayload] =
    useState<SignupPayload>(initialSignupPayload);
  const [step, setStep] = useState<number>(0);

  const currentFlow = SignupFlow[signupPayload.method];
  const currentStepLabel = currentFlow[step] || "Done";

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, currentFlow.length - 1));
  };

  return (
    <SignupContext.Provider
      value={{
        signupPayload,
        setSignupPayload,
        step,
        setStep,
        nextStep,
        currentStepLabel,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup() {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup must be used within a SignupProvider");
  }
  return context;
}
