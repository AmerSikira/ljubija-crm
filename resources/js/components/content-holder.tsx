import React, { ReactNode } from "react";

type ContentHolderProps = {
  children: ReactNode;
  className?: string;
};

export default function ContentHolder({ children, className }: ContentHolderProps) {
  return (
    <div className={`w-full px-8 py-8 min-h-screen ${className ?? ''}`}>
      {children}

      <div className="text-center mt-8 dark:text-white">
        Made by <a href="https://axiom.ba" className="text-green-600">Axiom doo</a> | Powered by <a href="https://prosilva.eu" className="text-green-600">ProSilva doo</a>
      </div>
    </div>
  )
}
