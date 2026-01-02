import { PropsWithChildren } from "react";

type StackProps = PropsWithChildren<{ className?: string }>;

export function Stack({ children, className = "" }: StackProps) {
    return (
        <div className={`flex flex-col gap-4 min-w-0 w-lg ${className}`}>
            {children}
        </div>
    )
}