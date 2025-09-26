interface ButtonProps {
  title: string;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  title,
  type = "button",
  disabled = false,
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${disabled ? "cursor-not-allowed" : ""}`}
    >
      {title}
    </button>
  );
}
