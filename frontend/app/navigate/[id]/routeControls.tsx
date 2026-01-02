import { Button } from "@/components/ui/button";
import { useState } from "react";

interface RouteControlsProps {
    onPause : () => void;
    onFinish : () => void,
    onStart : () => void,
    isPaused : boolean,
    setIsPaused: (input: boolean) => void,
}

export function RouteControls ({onPause, onFinish, onStart, isPaused, setIsPaused} : RouteControlsProps) {
    

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
            <div className="flex flex-row gap-6 justify-center w-full">
                {isPaused && <Button variant="secondary" size="icon-2xl" className="rounded-full p-2" onClick={start}>
                    <img src="/images/routeControls/start.svg"/>
                </Button>}
                {isPaused && <Button variant="secondary" size="icon-2xl" className="rounded-full p-2" onClick={onFinish}>
                    <img src="/images/routeControls/finish.svg"/>
                </Button>}
                {!isPaused && <Button variant="secondary" size="icon-2xl" className="rounded-full p-2" onClick={pause}> 
                    <img src="/images/routeControls/pause.svg"/>
                </Button>}
            </div>
        </>
    )
}