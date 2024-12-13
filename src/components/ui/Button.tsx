interface ButtonProps {
  width: string;
  height: string;
  backgroundColor: string;
  title: string;
  borderRadius?: string;
}
export default function Button({
  width,
  height,
  backgroundColor,
  title,
  borderRadius,
}: ButtonProps) {
  return (
    <div>
      <button
        style={{
          backgroundColor: `${backgroundColor}`,
          width: `${width}`,
          height: `${height}`,
          borderRadius: `${borderRadius}`,
        }}
      >
        {title}
      </button>
    </div>
  );
}
