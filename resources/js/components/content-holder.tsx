import React, { ReactNode } from "react";

type ContentHolderProps = {
  children: ReactNode;
  className?: string;
};

export default function ContentHolder({children, className}: ContentHolderProps) {
return (
    <div className={`w-full px-8 py-8 ${className ?? ''}`}>
        {children}
    </div>
)
}
