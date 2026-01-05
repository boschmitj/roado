"use client"
import { useRouter } from "next/navigation";
import RouteParentComponent from "./RouteBuilderComponent";
import "../map/mapstyle.css"; 
import "./home.css";
import { useEffect } from "react";
import axios from "../../api/axios";
export default function RouteBuilderPage() {
    return (
        <>
            <main className="home-main bg">
                <RouteParentComponent />
            </main>
        </>
    )
}