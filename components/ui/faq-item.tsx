"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b py-5 first:pt-2">
      {/* 質問ボタン */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group w-full flex items-start justify-between gap-4 text-left py-1"
        aria-expanded={isOpen}
      >
        {/* Qマークとテキストのコンテナ */}
        <span className="flex items-start gap-3 flex-1 min-w-0">
          {/* 高さをテキストの 1 行目と合わせるため、h-[28px]（text-lg の行高相当）の中心に配置 */}
          <span className="text-xl font-bold text-primary w-6 h-[28px] flex items-center justify-center shrink-0 select-none">
            Q.
          </span>
          <span className="text-lg font-medium text-primary leading-relaxed flex-1 pt-[1px]">
            {question}
          </span>
        </span>
        
        {/* 矢印アイコン（items-start に合わせた位置調整） */}
        <span className="h-[28px] flex items-center shrink-0">
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ease-in-out ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {/* 回答エリア（アニメーション付き） */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {/* Aマークとテキストのコンテナ */}
          <div className="flex items-start gap-3 pb-2 pt-3">
            {/* Q. と綺麗に縦ラインが揃うように w-6 で幅を固定 */}
            <span className="text-xl font-bold text-muted-foreground w-6 h-[28px] flex items-center justify-center shrink-0 select-none">
              A.
            </span>
            <p className="text-muted-foreground leading-relaxed flex-1 pt-[2px]">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};