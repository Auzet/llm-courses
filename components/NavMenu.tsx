"use client";

import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { LogOut, Plus } from "lucide-react";
import Image from "next/image";
import { CreateCourseBtn } from "./CreateCourseBtn";
import { TestDialog } from "./testbtn";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "./ui/select";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export default function NavMenu() {
  return (
    <div className="h-auto min-w-xs mx-2 shadow border rounded-lg bg-card">
      <div className="flex flex-col justify-items-center  w-full h-full px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/ae53679f93ebdf13e823d6f0aaf66359.jpg" alt="User Image" width={24} height={24} className="rounded-full mr-3"/>
          <h2 className="text-[16px] font-semibold text-primary">
            Алексей Полехин
          </h2>
          </div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <LogOut className="h-5 w-5" />
          </Button>
          
        </div>
        <Separator className="my-4" />
        <TestDialog />
        <Dialog>
      <form>
        <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when youre
              done.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
        <CreateCourseBtn />
        <Button variant="default" className="w-full mb-2 dark">
          <Plus />
          <span className="mr-2">Создать курс</span>
        </Button>
      </div>
    </div>
  );
}
