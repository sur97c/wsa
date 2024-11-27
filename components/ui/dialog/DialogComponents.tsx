import React from "react";
import {
  DialogHeaderProps,
  DialogFooterProps,
  DialogContentProps,
} from "./dialog.types";
import { cn } from "@utils/utils";

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  className,
}) => <div className={cn("px-6 py-4 border-b", className)}>{children}</div>;

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className,
}) => <div className={cn("px-6 py-4", className)}>{children}</div>;

export const DialogFooter: React.FC<DialogFooterProps> = ({
  children,
  className,
}) => (
  <div
    className={cn("px-6 py-4 border-t flex justify-end space-x-2", className)}
  >
    {children}
  </div>
);

export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <h2 className="text-lg font-semibold text-gray-900">{children}</h2>;

export const DialogDescription: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <p className="mt-2 text-sm text-gray-500">{children}</p>;
