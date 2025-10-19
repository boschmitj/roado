import RouteParentComponent from "../components/RouteBuilderComponent";
import "../map/mapstyle.css"; 
import "./home.css";

export default function Home() {
    return (
        <>
            <main className="home-main">
                <RouteParentComponent />
            </main>
        </>
    )
}