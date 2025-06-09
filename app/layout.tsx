import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import AuthProvider from "@/context/auth";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog Website",
  description: "This is Blog website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <GoogleOAuthProvider clientId="751962241651-vfvusnu9h923cutphd5glabdjpbfnrgp.apps.googleusercontent.com">
            {children}
            <Toaster />
          </GoogleOAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
