"use client";

import axios from "@/app/api/axios";
import { RouteCard, route } from "./routeComponent";
import { Stack } from "@/components/own/Stack";
import { useEffect, useRef, useState } from "react";
import { Select } from "@/components/ui/select";
import SelectSorting from "./SelectSorting";


export function RouteOverview() {
    const [routes, setRoutes] = useState<route[]>([]);
    const [selectedSorting, setSelectedSorting] = useState<string>("proximity");

    const getRoutes = async (selectedSorting: string) => {
        try {
            const response = await axios.get("/route/all?sort=" + selectedSorting);
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
        getRoutes((selectedSorting));
    }, [selectedSorting]);


    return (
        <>
            <SelectSorting setSelectedSorting={setSelectedSorting}/>
            <Stack>
                {routes.map((r) => (
                    <RouteCard key={r.id} {...r} />
                ))}
            </Stack>
        </>
    )
}