import React, { ReactNode } from "react";

type ContentHolderProps = {
  children: ReactNode;
};

export default function ContentHolder({children}: ContentHolderProps) {
return (
    <div className="w-full px-8 py-8">
        {children}
    </div>
)
}