"use client"
import { useRouter } from "next/navigation";
import RouteParentComponent from "../components/RouteBuilderComponent";
import "../map/mapstyle.css"; 
import "./home.css";
import { useEffect } from "react";
import axios from "../api/axios";


export default function Home() {

    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log("Trying to fetch /user");
                const response = await axios.get("/user/me");
                console.log("got user: " + JSON.stringify(response.data));
            } catch (error)
            {
                console.error(error);
                router.push("/login");
            }
        };

        checkAuth();
    }, [router]);
    return (
        <>
            <main className="home-main">
                <RouteParentComponent />
            </main>
        </>
    )
}