// Dentally treatment notes carry the times as text, e.g.
// "Active treatment time: 30 minutes" / "Total experience time: 60 minutes".
export function parseTreatmentTimes(description: string | null | undefined) {
  if (!description) return { activeTime: null, totalTime: null };

  const activeMatch = description.match(
    /Active treatment time\s*:?\s*(\d+)\s*minutes?/i,
  );
  const totalMatch = description.match(
    /Total experience time\s*:?\s*(\d+)\s*minutes?/i,
  );

  return {
    activeTime: activeMatch ? parseInt(activeMatch[1]) : null,
    totalTime: totalMatch ? parseInt(totalMatch[1]) : null,
  };
}
