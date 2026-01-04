import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useId, useState } from "react";

interface DescriptionComponentProps {
    description: string,
    onSave: (description: string) => void;
}

export default function DescriptionComponent ({description, onSave} : DescriptionComponentProps) {
    const id = useId();
    const [currDescription, setCurrDescription] = useState(description);

    return (
        <div className='relative w-full flex gap-4 items-start'>
            <div className="relative flex-1 space-y-2">
                <Label
                    htmlFor={id}
                    className='bg-background text-foreground absolute top-0 left-2 z-10 block -translate-y-1/2 px-1 text-s font-medium group-has-disabled:opacity-50'
                >
                    Make your activity memorizable ✨
                </Label>
                <Textarea id={id} className='!bg-background' value={currDescription} onChange={e => setCurrDescription(e.target.value)}/>
            </div>
            <Button variant={"default"} onClick={() => onSave(currDescription)} > 
                Save description
            </Button>
        </div>
    )
}