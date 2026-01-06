export interface RouteStatContainerProps {
    children: React.ReactNode
}

export default function RouteStatContainer({ children }: RouteStatContainerProps) {
    return (
        <div className="flex flex-col items-center gap-4 justify-center mt-4">
            {children}
        </div>
    )
}