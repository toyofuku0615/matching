import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useIsPresent,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Plus,
  BadgeCheck,
  Heart,
  Sprout,
  X,
} from "lucide-react";
import type { Farmer } from "../data/types";
import { ui } from "../data/copy";

type Props = {
  farmer: Farmer;
  nextFarmer: Farmer;
  onDecide: (like: boolean) => void;
  onDetails: () => void;
};
export function SwipeCard({ farmer, nextFarmer, onDecide, onDetails }: Props) {
  const [photo, setPhoto] = useState(0);
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const mounted = useRef(true);
  // Ignore decisions as soon as the containing screen starts to close.
  const isPresent = useIsPresent();
  const present = useRef(isPresent);
  present.current = isPresent;
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const x = useMotionValue(0);
  const rotation = useTransform(x, [-200, 200], [-12, 12]);
  const yesOpacity = useTransform(x, [15, 100], [0, 1]);
  const noOpacity = useTransform(x, [-100, -15], [1, 0]);
  const reduced = useReducedMotion();
  const decide = async (like: boolean) => {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    // Zero-duration drag tweens can be cancelled by the release spring.
    if (reduced) {
      x.set(like ? 540 : -540);
      if (mounted.current && present.current) onDecide(like);
      return;
    }
    await animate(x, like ? 540 : -540, {
      duration: 0.34,
      ease: [0.32, 0.02, 0.63, 0.99],
    });
    if (mounted.current && present.current) onDecide(like);
  };
  const changePhoto = (direction: number) => {
    if (!locked.current)
      setPhoto(
        (p) => (p + direction + farmer.photos.length) % farmer.photos.length,
      );
  };
  return (
    <>
      <div className="card-stage">
        <div className="stack-card stack-card-back">
          <img src={nextFarmer.photos[0].src} alt="" />
        </div>
        <motion.article
          className="profile-card"
          style={{ x, rotate: rotation }}
          drag={busy ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.9}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 650)
              void decide(
                (Math.abs(info.offset.x) > 30
                  ? info.offset.x
                  : info.velocity.x) > 0,
              );
            else
              void animate(x, 0, {
                type: "spring",
                stiffness: 360,
                damping: 26,
              });
          }}
          aria-label={ui.swipe.profileLabel(farmer.name)}
        >
          <img
            className="farmer-photo"
            src={farmer.photos[photo].src}
            alt={farmer.photos[photo].alt}
            style={{ objectPosition: farmer.photos[photo].position }}
            draggable={false}
          />
          <div className="photo-shade" />
          <div
            className="photo-progress"
            aria-label={ui.swipe.photoProgress(photo + 1, farmer.photos.length)}
          >
            {farmer.photos.map((_, i) => (
              <span key={i} className={photo === i ? "active" : ""} />
            ))}
          </div>
          <div className="compatibility">
            <Heart size={13} fill="currentColor" /> {ui.swipe.compatibility}{" "}
            <strong>{farmer.compatibility}%</strong>
          </div>
          <button
            className="photo-arrow photo-prev"
            onClick={() => changePhoto(-1)}
            aria-label={ui.swipe.previousPhoto}
          >
            <ChevronLeft size={23} />
          </button>
          <button
            className="photo-arrow photo-next"
            onClick={() => changePhoto(1)}
            aria-label={ui.swipe.nextPhoto}
          >
            <ChevronRight size={23} />
          </button>
          <motion.div
            className="swipe-stamp stamp-yes"
            style={{ opacity: yesOpacity }}
          >
            {ui.swipe.like}
          </motion.div>
          <motion.div
            className="swipe-stamp stamp-no"
            style={{ opacity: noOpacity }}
          >
            {ui.swipe.pass}
          </motion.div>
          <div className="profile-caption">
            <div className="farmer-status">
              <span /> {ui.swipe.status}
            </div>
            <div className="name-line">
              <h2>
                {farmer.name} <span>{farmer.age}</span>
              </h2>
              <BadgeCheck size={23} fill="white" color="#ff6385" />
              <button
                onClick={onDetails}
                className="more-profile"
                aria-label={ui.swipe.moreProfileLabel(farmer.name)}
              >
                <Plus size={24} />
              </button>
            </div>
            <div className="farmer-meta">
              <span>
                <MapPin size={14} />
                {farmer.region}
              </span>
              <span>
                <Sprout size={14} />
                {ui.swipe.farmerCrop(farmer.crop)}
              </span>
            </div>
            <div className="farmer-agriculture">
              <span>{farmer.agriculture.variety}</span>
              <span>{farmer.agriculture.method}</span>
            </div>
            <p className="tagline">{farmer.tagline}</p>
            <button className="about-link" onClick={onDetails}>
              {ui.swipe.about} <ChevronRight size={14} />
            </button>
          </div>
        </motion.article>
      </div>
      <div className="swipe-actions">
        <div>
          <button
            className="decision pass"
            onClick={() => void decide(false)}
            disabled={busy}
            aria-label={ui.swipe.pass}
          >
            <X size={28} strokeWidth={1.8} />
          </button>
          <span>{ui.swipe.pass}</span>
        </div>
        <span className="swipe-hint">
          <span>←</span> {ui.swipe.hint} <span>→</span>
        </span>
        <div>
          <button
            className="decision like"
            onClick={() => void decide(true)}
            disabled={busy}
            aria-label={ui.swipe.like}
          >
            <Heart size={30} fill="currentColor" strokeWidth={1.5} />
            <span className="button-sprout">
              <Sprout size={15} />
            </span>
          </button>
          <span>{ui.swipe.like}</span>
        </div>
      </div>
    </>
  );
}
