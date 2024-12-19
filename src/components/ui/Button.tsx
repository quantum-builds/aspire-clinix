interface ButtonProps {
  title: string;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
  className?: string;
}
export default function Button({
  title,
  type = "button",
  onClick,
  className,
}: ButtonProps) {
  return (
    <button type={type} className={className} onClick={onClick}>
      {title}
    </button>
  );
}
