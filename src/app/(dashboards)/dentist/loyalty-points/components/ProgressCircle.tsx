interface ProgressCircleProps {
  percentage: number;
  color?: string;
}

export default function ProgressCircle({
  percentage,
  color = "orange",
}: ProgressCircleProps) {
  return (
    <div
      className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-sm font-medium"
      style={{
        background: `conic-gradient(${color} ${percentage}%, #e5e7eb ${percentage}%)`,
      }}
    >
      <div className="w-9 h-9 rounded-full bg-white" />
    </div>
  );
}
