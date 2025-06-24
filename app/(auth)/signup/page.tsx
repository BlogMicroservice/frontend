'use client'
import { SignupProvider } from "@/context/signup"
import MainSignUp from "./components/MainSignUp"

export default function page() {
  return (
    <SignupProvider>
       <MainSignUp></MainSignUp>
    </SignupProvider>
  )
}
