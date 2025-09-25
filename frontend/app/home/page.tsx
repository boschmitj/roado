import MapComponent from "../components/MapComponent";
import RouteBuilderComponent from "../components/RouteBuilderComponent";

export default function Home() {
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <p>This is my current map</p>
            <RouteBuilderComponent />
        </div>
    )
}