import { Heart, Sprout } from "lucide-react";
export function Brand({ large = false }: { large?: boolean }) {
  return (
    <div
      className={`brand ${large ? "brand-large" : ""}`}
      aria-label="農miai のうみあい"
    >
      <span className="brand-mark">
        <Heart fill="currentColor" />
        <Sprout className="brand-sprout" />
      </span>
      <span>
        農<span className="brand-latin">miai</span>
      </span>
    </div>
  );
}
export function YouAvatar() {
  return (
    <div className="you-avatar">
      <Heart size={25} fill="currentColor" />
      <span>あなた</span>
    </div>
  );
}
