import { Star } from "lucide-react";

export default function Stars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const remainder = rating - fullStars;
  const hasPartialStar = remainder > 0;
  const emptyStars = 5 - fullStars - (hasPartialStar ? 1 : 0);

  return (
    <div className="flex items-center gap-[2px]">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-green text-green" />
      ))}

      {/* Partial star */}
      {hasPartialStar && (
        <div className="relative w-4 h-4">
          <Star className="absolute w-4 h-4 fill-[#D0D0D0] text-[#D0D0D0]" />
          <div
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${remainder * 100}%` }}
          >
            <Star className="w-4 h-4 fill-green text-green" />
          </div>
        </div>
      )}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="w-4 h-4 fill-[#D0D0D0] text-[#D0D0D0]"
        />
      ))}
    </div>
  );
}
