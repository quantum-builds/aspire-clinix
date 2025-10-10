import { cn } from "@/lib/utils"
import React, { useState, useRef, useEffect, ReactNode } from "react"

interface CustomPopoverProps {
    trigger: ReactNode
    children: ReactNode
    position?: "top" | "bottom" | "left" | "right"
    offset?: number
    align?: "start" | "center" | "end"
    className?: string
    parentClassName?:string
}

export default function CustomPopover({
    trigger,
    children,
    position = "bottom",
    offset = 10,
    align = "end",
    className = "",
    parentClassName=""
}: CustomPopoverProps) {
    const [open, setOpen] = useState(false)
    const popoverRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const getPositionStyles = () => {
        const base = `absolute z-50 p-3 bg-white shadow-lg rounded-xl border border-gray-200 mt-2 ${className}`
        const offsetValue = `${offset}px`
        const alignMap = {
            start: "left-0",
            center: "left-1/2 -translate-x-1/2",
            end: "right-0",
        }[align]

        switch (position) {
            case "top":
                return `${base} bottom-full mb-[${offsetValue}] ${alignMap}`
            case "bottom":
                return `${base} top-full mt-[${offsetValue}] ${alignMap}`
            case "left":
                return `${base} right-full mr-[${offsetValue}] top-1/2 -translate-y-1/2`
            case "right":
                return `${base} left-full ml-[${offsetValue}] top-1/2 -translate-y-1/2`
            default:
                return `${base} top-full mt-[${offsetValue}] ${alignMap}`
        }
    }

    return (
        <div className={cn("relative inline-block",parentClassName)}>
            <div ref={triggerRef} onClick={() => setOpen(!open)}>
                {trigger}
            </div>
            {open && (
                <div ref={popoverRef} className={getPositionStyles()}>
                    {children}
                </div>
            )}
        </div>
    )
}
