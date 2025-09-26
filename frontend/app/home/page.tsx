import RouteBuilderComponent from "../components/RouteBuilderComponent";
import "../map/mapstyle.css"; 

export default function Home() {
    return (
        <>
            <h1>Welcome to the Home Page</h1>
            <p>This is my current map</p>
            <RouteBuilderComponent />
        </>
    )
}