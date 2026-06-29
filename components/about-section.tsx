'use client';

import { Calendar } from "lucide-react";

export default function AboutSection() {
  return (
    <div className="bg-card p-6">
      <Calendar className="h-8 w-8 text-foreground mb-4" />
      <h3 className="font-medium text-lg mb-2">由来</h3>
      <p className="text-sm text-muted-foreground">
        「秋で木々がこうようするころ、文化祭で気分をこうようさせに、豊田高専にいこうよう」というトリプルミーニングが由来です。
      </p>
    </div>
  );
}