"use client";
import * as React from "react";
import RouteNavigation from "./routeNavigationMapComponent";
import NavParentComponent from "./navParentComponent";


export default function NavigationPage({params} : PageProps<'/navigate/[id]'>) {
    const { id } = React.use(params)
    
    return (
        <>
            <div className="flex flex-row justify-center items-start mt-8">
                { /*} über Map drübergelegt */}
                <NavParentComponent id={Number(id)}/>
                { /* unter der Map Starten/pausieren/derzeitige Statistik */ }
            </div>
            
        </>
    )
}