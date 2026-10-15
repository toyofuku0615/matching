import { Heart, Sprout } from "lucide-react";
import { copy } from "../data/copy";
export function Brand({ large = false }: { large?: boolean }) {
  return (
    <div
      className={`brand ${large ? "brand-large" : ""}`}
      aria-label={copy.shared.name}
    >
      <span className="brand-mark">
        <Heart fill="currentColor" />
        <Sprout className="brand-sprout" />
      </span>
      <span className="brand-name">{copy.shared.name}</span>
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
