"use client";
import * as React from "react";
import RouteNavigation from "./routeNavigationComponent";


export default function NavigationPage({params} : PageProps<'/navigate/[id]'>) {
    const { id } = React.use(params)
    
    return (
        <>
            <RouteNavigation id={Number(id)}/>
        </>
    )
}