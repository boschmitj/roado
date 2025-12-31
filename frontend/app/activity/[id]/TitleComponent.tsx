import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckSquare2, Pencil, X } from "lucide-react";
import { useState } from "react";

interface TitleComponentProps {
  title: string;
  setTitle: (title: string) => void;
  onSave: (newTitle: string) => void;
}

export default function TitleComponent({ title, setTitle, onSave }: TitleComponentProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [currTitle, setCurrTitle] = useState(title);
    const [tempTitle, setTempTitle] = useState(title);

    const handleEdit = () => {
        setIsEditing(true);
        setTempTitle(title);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    }

    const handleCancel = () => {
        setTempTitle(title);
        setIsEditing(false)
    }

    const handleSave = () => {
        if (tempTitle.trim()) {
            setTitle(tempTitle.trim());
            if (onSave) {
                onSave(tempTitle.trim());
            }
            setIsEditing(false);
        }
        
    }

    return (
        <div className="w-full h-6 flex items-center gap-2">
            {isEditing ? (
                <>
                    <Input
                        type="text"
                        placeholder={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="text-2xl font-bold h-auto px-3 py-2 border-2"
                        autoFocus
                    />
                    <Button size="icon" variant="ghost" onClick={handleSave}>
                        <CheckSquare2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant={"ghost"} onClick={handleCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </>
            ): (
                <>
                    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                        {title}
                    </h1>
                    <Button 
                        onClick={handleEdit}
                        size="icon"
                        variant="ghost"
                        className="bg-[#BBDAA4] hover:bg-[#a9db82]"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>

                </>
            )}
        </div>
    )

}