import React from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  return (
    <div className="border-b py-8 last:border-b-0" >
      
      {/* 質問（Q）セクション */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl leading-none text-primary">Q.</span>
        <h3 className="text-lg font-medium text-primary leading-tight">
          {question}
        </h3>
      </div>

      {/* 回答（A）セクション */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl leading-none text-muted-foreground">A.</span>
        <p className="text-muted-foreground leading-relaxed">
          {answer}
        </p>
      </div>

    </div>
  );
};