
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: () => void;
    title: string;
    description: string,
    onConfirm: () => void;
    confirmText: string;
    cancelText: string
}
export function ConfirmationDialog({open, title, description, onConfirm, confirmText, cancelText, onOpenChange} : ConfirmationDialogProps) {
    return (
        <div className="absolute z-10 top-2 left-1/2 -translate-x-1/2 w-sm">
            <Dialog 
                open={open}
                onOpenChange={onOpenChange}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {title}
                        </DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild >
                            <Button type="button" variant="outline" onClick={onOpenChange} >
                                {cancelText}
                            </Button>
                        </DialogClose>
                        <Button type="button" variant="outline" onClick={onConfirm} className="bg-[#BBDAA4] hover:bg-[#a9db82]">
                            {confirmText}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}