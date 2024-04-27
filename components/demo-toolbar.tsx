"use client"

import { Check, Clipboard } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"
import { toast } from "sonner";

interface DemoToolbarProps {
    copyText: string;
};

export const DemoToolbar = ({
    copyText,
}: DemoToolbarProps) => {

    const [textCopied, setTextCopied] = useState<boolean>(false);

    const handleCopy = () => {
        try {
            navigator.clipboard.writeText(copyText);
            setTextCopied(true);
            toast.success("Code copied to clipboard!");
            setTimeout(() => {
                setTextCopied(false);
            }, 3000);
        } catch (error) {
            toast.error("Failed to copy code to clipboard.");
            console.error(error);
        }
    }

    return (
        <div className="flex justify-between items-center w-full">
            <div>
                {/* Variant toggle will go here */}
            </div>
            <Button 
                size="icon" 
                variant="outline"
                onClick={handleCopy}
                disabled={textCopied}
            >
                {textCopied ? <Check /> : <Clipboard />}
            </Button>
        </div>
    )
}