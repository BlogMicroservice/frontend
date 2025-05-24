import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import React from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
export default function Profile() {
  return (
    <div className="w-[25%] max-md:w-[calc(100%-50px)]">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 flex flex-col items-center">
          <div className="w-100% flex justify-center items-center flex-col">
            <Image src="/image/profile-picture.png" alt="Profile-picture" className="w-28 h-28 rounded-full bg-gray-300" width={100} height={100}></Image>
            <div className="flex justify-center items-center cursor-pointer text-gray-700">
              <span className="mr-2">upload image</span>
              <span>
                <FaCloudUploadAlt></FaCloudUploadAlt>
              </span>
            </div>
          </div>
          <div className=" w-[100%] grid max-w-sm items-center gap-1.5">
            <Label htmlFor="Bio">Bio</Label>
            <Textarea
              placeholder="Tell us a little bit about yourself"
              className="resize-none"
            />
          </div>
          <Button className="w-[100%] cursor-pointer mt-2">Next</Button>
        </CardContent>

        <CardFooter>
          <div>
            <span className="text-blue-400 text-[.8rem] cursor-pointer">Skip</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
