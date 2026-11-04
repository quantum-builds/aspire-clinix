interface SlotDateTimeProps {
  date: string;
  time: string;
}

// Rendered inside the confirmation modal's <p>, so only inline elements.
export default function SlotDateTime({ date, time }: SlotDateTimeProps) {
  return (
    <span className="mb-3 block">
      <span className="block">
        <strong>Date:</strong> {date}
      </span>
      <span className="block">
        <strong>Time:</strong> {time}
      </span>
    </span>
  );
}
