interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: () => void;
    title: string;
    description: string,
    onConfirm: () => void;
}
export function ConfirmationDialog({open, onOpenChange, title, description, onConfirm} : ConfirmationDialogProps) {
    
}