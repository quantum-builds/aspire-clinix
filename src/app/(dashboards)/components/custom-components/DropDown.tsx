// "use client"

// import { DropDownIcon } from "@/assets"
// import { cn } from "@/lib/utils"
// import Image from "next/image"
// import { useState, useRef, useEffect } from "react"

// interface DropdownOption {
//   value: string
//   label: string
// }

// interface DropdownProps {
//   options: DropdownOption[]
//   value: string
//   onValueChange: (value: string | null) => void
//   placeholder?: string
//   className?: string
//   triggerClassName?: string
//   contentClassName?: string
//   placeholderClassName?:string,
//   showClearOption?: boolean
//   customTrigger?: React.ReactNode

// }

// export default function Dropdown({
//   options,
//   value,
//   onValueChange,
//   placeholder = "Select an option",
//   className = "",
//   triggerClassName = "",
//   contentClassName = "",
//   placeholderClassName="",
//   showClearOption = true,
//   customTrigger,
// }: DropdownProps) {
//   const [isOpen, setIsOpen] = useState(false)
//   const dropdownRef = useRef<HTMLDivElement>(null)
//   const menuRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false)
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [])

//   useEffect(() => {
//     if (isOpen && menuRef.current) {
//       const rect = menuRef.current.getBoundingClientRect()
//       const isOffscreenRight = rect.right > window.innerWidth
//       if (isOffscreenRight) {
//         menuRef.current.style.right = "0"
//         menuRef.current.style.left = "auto"
//       }
//     }
//   }, [isOpen])

//   const handleSelect = (optionValue: string | null) => {
//     onValueChange(optionValue)
//     setIsOpen(false)
//   }

//   const selectedOption = options.find((option) => option.value === value)

//   return (
//     <div className={`relative inline-block ${className}`} ref={dropdownRef}>
//       <div
//         className={`flex justify-between items-center cursor-pointer select-none ${triggerClassName}`}
//         onClick={(e) => {
//           e.stopPropagation()
//           setIsOpen(!isOpen)
//         }}
//       >
//         {customTrigger ? (
//           customTrigger
//         ) : (
//           <>
//             <p className={cn("text-[16px] text-green truncate",placeholderClassName)}>
//               {selectedOption?.label || placeholder}
//             </p>
//             <Image
//               src={DropDownIcon}
//               alt="Dropdown"
//               className={`w-4 h-4 ml-2 transition-transform duration-300 ${
//                 isOpen ? "rotate-180" : "rotate-0"
//               }`}
//             />
//           </>
//         )}
//       </div>

//       {isOpen && (
//         <div
//           ref={menuRef}
//           className={`
//             absolute top-full right-0 mt-2 rounded-xl py-3 px-3 bg-white shadow-lg border border-green
//             transition-all duration-200 ease-in-out z-[999] min-w-[180px]
//             ${contentClassName}
//           `}
//         >
//           {options.length > 0 ? (
//             options.map((option, index) => (
//               <div
//                 key={option.value}
//                 onClick={() => handleSelect(option.value)}
//                 className="py-2 px-2 rounded-lg text-sm cursor-pointer transition-colors hover:text-green"
//               >
//                 {option.label}
//                 {index < options.length - 1 && (
//                   <div className="h-[1px] bg-green/20 my-1" />
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="text-gray-500 text-sm py-2 px-2">
//               No actions found
//             </div>
//           )}

//           {showClearOption && (
//             <>
//               <div className="border-t border-gray-200 my-2" />
//               <div
//                 className="py-2 px-2 text-sm text-gray-500 cursor-pointer hover:text-green transition"
//                 onClick={() => handleSelect(null)}
//               >
//                 Clear Selection
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }


"use client"

import { DropDownIcon } from "@/assets"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"

interface DropdownOption {
  value: string
  label: string
  disabled?: boolean
}

interface DropdownProps {
  options: DropdownOption[]
  value: string
  emptyText?: string
  onValueChange: (value: string | null) => void
  placeholder?: string
  className?: string
  triggerClassName?: string
  contentClassName?: string
  placeholderClassName?: string
  showClearOption?: boolean
  customTrigger?: React.ReactNode
  disabled?: boolean
}

export default function Dropdown({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  className = "",
  triggerClassName = "",
  contentClassName = "",
  placeholderClassName = "",
  showClearOption = true,
  customTrigger,
  disabled = false,
  emptyText = "No actions found "
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      const isOffscreenRight = rect.right > window.innerWidth
      if (isOffscreenRight) {
        menuRef.current.style.right = "0"
        menuRef.current.style.left = "auto"
      }
    }
  }, [isOpen])


  const handleSelect = (optionValue: string | null) => {
    onValueChange(optionValue)
    setIsOpen(false)
  }

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div
      className={`relative inline-block ${className}`}
      ref={dropdownRef}
    >
      <div
        className={cn(
          "flex justify-between items-center select-none rounded-lg",
          triggerClassName,
          disabled
            ? "opacity-50 cursor-not-allowed pointer-events-none"
            : "cursor-pointer"
        )}
        onClick={(e) => {
          if (disabled) return
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
      >
        {customTrigger ? (
          customTrigger
        ) : (
          <>
            <p
              className={cn(
                "text-[16px] text-green truncate",
                placeholderClassName
              )}
            >
              {selectedOption?.label || placeholder}
            </p>
            <Image
              src={DropDownIcon}
              alt="Dropdown"
              className={`w-4 h-4 ml-2 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                }`}
            />
          </>
        )}
      </div>

      {isOpen && !disabled && (
        <div
          ref={menuRef}
          className={cn(
            "absolute top-full right-0 mt-2 rounded-xl py-3 px-3 bg-white shadow-lg border border-green transition-all duration-200 ease-in-out z-[999] min-w-[180px] max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-green scrollbar-track-transparent",
            contentClassName
          )}
        >
          {options.length > 0 ? (
            options.map((option, index) => (
              <div
                key={option.value}
                onClick={() => !option.disabled && handleSelect(option.value)}
                className={cn(
                  "py-2 px-2 rounded-lg text-sm transition-colors",
                  option.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:text-green"
                )}
              >
                {option.label}
                {index < options.length - 1 && (
                  <div className="h-[1px] bg-green/20 my-1" />
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm py-2 px-2">{emptyText}</div>
          )}

          {showClearOption && (
            <>
              <div className="border-t border-gray-200 my-2" />
              <div
                className="py-2 px-2 text-sm text-gray-500 cursor-pointer hover:text-green transition"
                onClick={() => handleSelect(null)}
              >
                Clear Selection
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
