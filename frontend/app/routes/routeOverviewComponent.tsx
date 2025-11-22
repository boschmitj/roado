"use client";

import { RouteCard, route } from "./routeComponent";
import axios from "../api/axios";
import { useEffect, useState } from "react";

export function RouteOverview() {
    const [routes, setRoutes] = useState<route[]>([]);

    const getRoutes = async () => {
        try {
            const response = await axios.get("/route/all");
            if (response.status !== 200) {
                throw new Error("An Error occured: " + response.status);
            } 
            setRoutes(response.data)
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getRoutes();
    }, []);


    return (
        <>
            {routes.map((r) => (
                <RouteCard key={r.routeName} {...r} />
            ))}
        </>
    )
}