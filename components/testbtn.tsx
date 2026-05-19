"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TestDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button >Открыть диалог</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Тест</DialogTitle>
        </DialogHeader>
        <p>Если вы это видите, диалог работает.</p>
      </DialogContent>
    </Dialog>
  );
}