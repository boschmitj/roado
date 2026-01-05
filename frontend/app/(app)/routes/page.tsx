import { RouteOverview } from "./routeOverviewComponent"
export default function page() {
    return (
        <>
            <div className="flex flex-col items-center gap-4 justify-center mt-4">
                <RouteOverview/>
            </div>
        </>
    )
}