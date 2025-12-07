import { Button } from "@/components/ui/button";
import { useState } from "react";

interface RouteControlsProps {
    onPause : () => void;
    onFinish : () => void,
    onStart : () => void,
}

export function RouteControls ({onPause, onFinish, onStart} : RouteControlsProps) {
    const [isPaused, setIsPaused] = useState<Boolean>(false);

    function start () {
        onStart();
        setIsPaused(false)
    }

    function pause() {
        onPause();
        setIsPaused(true);
    }
    
    return (
        <>
            {isPaused} <Button variant="default" size="icon" className="rounded-full" onClick={start}>
                <img src="/images/routeControls/start.svg"/>
            </Button>
            {isPaused} && <Button variant="outline" size="icon" className="rounded-full" onClick={onFinish}>
                <img src="/images/routeControls/finish.svg"/>
            </Button>
            {!isPaused} <Button variant="default" size="icon" className="rounded-full" onClick={pause}> 
                <img src="images/routeControls/pause.svg"/>
            </Button>
        </>
    )
}