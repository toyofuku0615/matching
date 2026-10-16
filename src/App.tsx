import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Heart,
  Leaf,
  MapPin,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sprout,
  UserRound,
} from "lucide-react";
import { ScreenTransition } from "./components/ScreenTransition";
import { Brand, YouAvatar } from "./components/Brand";
import { SwipeCard } from "./components/SwipeCard";
import { Chat } from "./components/Chat";
import { Modal } from "./components/Modal";
import { AgricultureInfo } from "./components/AgricultureInfo";
import { farmers, getFarmer } from "./data/farmers";
import { products } from "./data/products";
import { copy, preferenceOptions, ui } from "./data/copy";
import type { Farmer } from "./data/types";
import { useExperience, type Screen } from "./useExperience";

export default function App() {
  const { state, dispatch } = useExperience();
  const [sheet, setSheet] = useState<"profile" | "settings" | "reset" | null>(
    null,
  );
  const [searching, setSearching] = useState(false);
  const [searchFound, setSearchFound] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const preferenceLock = useRef(false);
  const headingRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const order =
    preferenceOptions.find((option) => option.id === state.preference)?.order ??
    preferenceOptions[0].order;
  const discoverFarmer = getFarmer(order[state.index % order.length]);
  const matchedFarmer = state.matched ? getFarmer(state.matched) : null;
  const activeFarmer =
    ["chat", "matched", "offer", "completed"].includes(state.screen) &&
    matchedFarmer
      ? matchedFarmer
      : discoverFarmer;
  const product = products[activeFarmer.id];
  const goto = (screen: Screen) => dispatch({ type: "navigate", screen });
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [state.screen]);
  useEffect(() => {
    if (
      state.screen === "discover" &&
      state.index > 0 &&
      document.activeElement === document.body
    ) {
      document
        .querySelector<HTMLButtonElement>(".decision.pass")
        ?.focus({ preventScroll: true });
    }
  }, [state.index, state.screen]);
  const reset = () => {
    window.clearTimeout(timer.current);
    preferenceLock.current = false;
    setSearching(false);
    setSearchFound(false);
    setSheet(null);
    dispatch({ type: "reset" });
  };
  const choosePreference = (id: string) => {
    if (preferenceLock.current) return;
    preferenceLock.current = true;
    dispatch({ type: "preference", value: id });
    setSearching(true);
    timer.current = window.setTimeout(
      () => {
        setSearchFound(true);
        timer.current = window.setTimeout(
          () => {
            setSearching(false);
            setSearchFound(false);
            preferenceLock.current = false;
            goto("discover");
          },
          reduced ? 100 : 650,
        );
      },
      reduced ? 100 : 700,
    );
  };
  const back = () => {
    window.clearTimeout(timer.current);
    preferenceLock.current = false;
    setSearching(false);
    setSearchFound(false);
    const previous: Record<Screen, Screen> = {
      welcome: "welcome",
      preferences: "welcome",
      discover: "preferences",
      matched: "discover",
      chat: "discover",
      offer: "chat",
      completed: "offer",
    };
    goto(previous[state.screen]);
  };
  return (
    <div className="desktop-canvas">
      <div className="desktop-signature">
        <span className="small-spark">✳</span> {ui.app.desktopSignature}
      </div>
      <div className="app-shell">
        <ScreenTransition reduced={reduced}>
          <motion.main
            ref={headingRef}
            tabIndex={-1}
            onAnimationComplete={() => {
              if (document.activeElement === document.body)
                headingRef.current?.focus({ preventScroll: true });
            }}
            key={state.screen}
            className={`screen screen-${state.screen}`}
            initial={{ opacity: 0, y: reduced ? 0 : 9 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -6 }}
            transition={{ duration: reduced ? 0 : 0.22 }}
          >
            {state.screen === "welcome" ? (
              <>
                <div className="welcome-top">
                  <span className="demo-pill">{copy.shared.demo}</span>
                  <span className="mini-wordmark">{ui.app.miniWordmark}</span>
                </div>
                <div className="welcome-content">
                  <div className="welcome-brand">
                    <Brand large />
                    <span className="pronunciation">
                      {ui.app.welcomePronunciation}
                    </span>
                  </div>
                  <div
                    className="welcome-portraits"
                    aria-label={ui.app.welcomePortraitsLabel}
                  >
                    <div className="portrait-orbit orbit-one" />
                    <div className="portrait-orbit orbit-two" />
                    <motion.div
                      className="welcome-mini welcome-takumi"
                      initial={{ scale: 0.8, opacity: 0, rotate: -12 }}
                      animate={{ scale: 1, opacity: 1, rotate: -9 }}
                      transition={{ delay: 0.15 }}
                    >
                      <img
                        src={getFarmer("takumi").photos[0].src}
                        alt={ui.app.welcomeTakumiAlt}
                      />
                      <span>{ui.app.welcomeTakumiCaption}</span>
                    </motion.div>
                    <motion.div
                      className="welcome-main-photo"
                      initial={{ scale: 0.88, opacity: 0, rotate: 5 }}
                      animate={{ scale: 1, opacity: 1, rotate: 4 }}
                      transition={{
                        delay: 0.05,
                        type: "spring",
                        stiffness: 180,
                        damping: 20,
                      }}
                    >
                      <img
                        src={getFarmer("miho").photos[0].src}
                        alt={ui.app.welcomeMihoAlt}
                      />
                      <div className="welcome-photo-caption">
                        <span>
                          {getFarmer("miho").name}{" "}
                          <small>{getFarmer("miho").age}</small>
                        </span>
                        <span>{getFarmer("miho").tagline}</span>
                      </div>
                    </motion.div>
                    <motion.div
                      className="welcome-mini welcome-masao"
                      initial={{ scale: 0.8, opacity: 0, rotate: 10 }}
                      animate={{ scale: 1, opacity: 1, rotate: 9 }}
                      transition={{ delay: 0.25 }}
                    >
                      <img
                        src={getFarmer("masao").photos[0].src}
                        alt={ui.app.welcomeMasaoAlt}
                      />
                      <span>{ui.app.welcomeMasaoCaption}</span>
                    </motion.div>
                    <div className="floating-heart heart-one">
                      <Heart fill="currentColor" size={28} />
                    </div>
                    <div className="floating-heart heart-two">
                      <Heart fill="currentColor" size={16} />
                    </div>
                    <span className="portrait-doodle">
                      {ui.app.welcomeDoodle}
                    </span>
                  </div>
                  <div className="welcome-copy">
                    <span className="eyebrow">{ui.app.welcomeEyebrow}</span>
                    <h1>
                      {copy.welcome.title.prefix}
                      <ruby>
                        {copy.welcome.title.base}
                        <rp>（</rp>
                        <rt>{copy.welcome.title.reading}</rt>
                        <rp>）</rp>
                      </ruby>
                      {copy.welcome.title.suffix}
                    </h1>
                    <p>{copy.welcome.description}</p>
                  </div>
                </div>
                <div className="welcome-bottom">
                  <button
                    className="primary"
                    onClick={() => goto("preferences")}
                  >
                    {copy.welcome.cta}
                    <ArrowRight size={19} />
                  </button>
                  <p className="duration">
                    <span /> {copy.welcome.duration}
                  </p>
                  <p className="welcome-fictional">{copy.shared.fictional}</p>
                </div>
              </>
            ) : (
              <>
                {state.screen === "chat" ? (
                  <header className="chat-header">
                    <button
                      className="icon-button"
                      aria-label={copy.shared.back}
                      onClick={back}
                    >
                      <ArrowLeft size={23} />
                    </button>
                    <button
                      className="chat-person"
                      onClick={() => setSheet("profile")}
                    >
                      <img src={activeFarmer.photos[0].src} alt="" />
                      <span>
                        <strong>
                          {activeFarmer.name}
                          <BadgeCheck size={15} fill="#ff4d78" color="white" />
                        </strong>
                        <small>
                          <span />
                          {copy.chat.scripted}
                        </small>
                      </span>
                    </button>
                    <span className="demo-pill">{copy.shared.demo}</span>
                    <button
                      className="icon-button"
                      aria-label={ui.app.profileDetails}
                      onClick={() => setSheet("profile")}
                    >
                      <UserRound size={21} />
                    </button>
                  </header>
                ) : (
                  <header
                    className={`app-header ${state.screen === "matched" ? "light-header" : ""}`}
                  >
                    <div className="header-left">
                      <button
                        className="icon-button back-button"
                        aria-label={copy.shared.back}
                        onClick={back}
                      >
                        <ArrowLeft size={21} />
                      </button>
                      <Brand />
                    </div>
                    <div className="header-right">
                      <span className="demo-pill">{copy.shared.demo}</span>
                      {!["preferences", "matched", "completed"].includes(
                        state.screen,
                      ) && (
                        <button
                          className={`icon-button messages-button ${state.matched ? "has-match" : ""}`}
                          aria-label={ui.app.messages}
                          onClick={() =>
                            state.matched ? goto("chat") : setSheet("settings")
                          }
                        >
                          <MessageCircle size={22} />
                        </button>
                      )}
                      <button
                        className="icon-button"
                        aria-label={ui.app.menu}
                        onClick={() => setSheet("settings")}
                      >
                        <UserRound size={21} />
                      </button>
                    </div>
                  </header>
                )}
                {state.screen === "preferences" && (
                  <div className="preferences-content">
                    <div className="step-indicator">
                      <span className="active" />
                      <span />
                      <span />
                    </div>
                    <span className="eyebrow">{copy.preferences.eyebrow}</span>
                    <h1>{copy.preferences.title}</h1>
                    <p className="subtext">{copy.preferences.subtitle}</p>
                    <div className="preference-list">
                      {preferenceOptions.map((option, i) => (
                        <motion.button
                          className={`preference-option ${state.preference === option.id ? "selected" : ""}`}
                          key={option.id}
                          onClick={() => choosePreference(option.id)}
                          disabled={searching}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: reduced ? 0 : i * 0.06 }}
                        >
                          <span className="preference-emoji">
                            {option.emoji}
                          </span>
                          <span>
                            <strong>{option.title}</strong>
                            <small>{option.subtitle}</small>
                          </span>
                          <span className="preference-check">
                            {state.preference === option.id ? (
                              <Check size={17} />
                            ) : (
                              <ChevronRight size={19} />
                            )}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                    <div className="preference-foot">
                      <Heart size={15} />
                      {copy.preferences.hint}
                    </div>
                    <AnimatePresence>
                      {searching && (
                        <motion.div
                          className="finding-overlay"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div
                            className={`finding-icon ${searchFound ? "found" : ""}`}
                          >
                            {searchFound ? (
                              <Check size={32} />
                            ) : (
                              <Heart size={32} fill="currentColor" />
                            )}
                          </div>
                          <h2>
                            {searchFound
                              ? ui.app.foundTitle
                              : ui.app.searchingTitle}
                          </h2>
                          <p>
                            {searchFound
                              ? ui.app.foundSubtitle
                              : ui.app.searchingSubtitle}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                {state.screen === "discover" && (
                  <>
                    <div className="discover-heading">
                      <div>
                        <span className="eyebrow">
                          {ui.app.discoverEyebrow}
                        </span>
                        <h1>{ui.app.discoverTitle}</h1>
                      </div>
                      <span className="discover-count">
                        {Math.min(state.index + 1, 3)}
                        <span> / 3</span>
                      </span>
                    </div>
                    {state.index < order.length ? (
                      <div className="discover-content">
                        <SwipeCard
                          key={`${state.preference}-${state.index}`}
                          farmer={discoverFarmer}
                          nextFarmer={getFarmer(
                            order[(state.index + 1) % order.length],
                          )}
                          onDetails={() => setSheet("profile")}
                          onDecide={(like) =>
                            like
                              ? dispatch({
                                  type: "match",
                                  farmerId: discoverFarmer.id,
                                })
                              : dispatch({ type: "skip" })
                          }
                        />
                      </div>
                    ) : (
                      <div className="empty-state">
                        <div className="empty-portraits">
                          {farmers.map((f) => (
                            <img
                              key={f.id}
                              src={f.photos[0].src}
                              alt={f.name}
                            />
                          ))}
                        </div>
                        <Sprout size={34} />
                        <h2>{copy.discover.exhaustedTitle}</h2>
                        <p>{copy.discover.exhaustedDescription}</p>
                        <button
                          className="primary"
                          onClick={() =>
                            dispatch({
                              type: "preference",
                              value: state.preference ?? "sweet",
                            })
                          }
                        >
                          {copy.discover.exhaustedCta}
                          <RotateCcw size={17} />
                        </button>
                      </div>
                    )}
                    <nav
                      className="bottom-nav"
                      aria-label={ui.app.mainNavigation}
                    >
                      <button className="active" aria-current="page">
                        <Heart size={21} fill="currentColor" />
                        <span>{ui.app.discoverNav}</span>
                      </button>
                      <button
                        onClick={() =>
                          state.matched ? goto("chat") : setSheet("settings")
                        }
                      >
                        <MessageCircle size={21} />
                        <span>
                          {ui.app.messages}
                          {state.matched && <i />}
                        </span>
                      </button>
                      <button onClick={() => setSheet("settings")}>
                        <UserRound size={21} />
                        <span>{ui.app.myPageNav}</span>
                      </button>
                    </nav>
                  </>
                )}
                {state.screen === "matched" && (
                  <div className="match-content">
                    <Confetti />
                    <span className="match-eyebrow">
                      {copy.matched.eyebrow}
                    </span>
                    <motion.h1
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, type: "spring", damping: 14 }}
                    >
                      {copy.matched.title}
                    </motion.h1>
                    <p className="match-subtitle">{ui.app.matchSubtitle}</p>
                    <div className="match-portraits">
                      <motion.div
                        className="match-avatar"
                        initial={{ x: -45, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <img
                          src={activeFarmer.photos[0].src}
                          alt={ui.app.farmerName(activeFarmer.name)}
                        />
                      </motion.div>
                      <motion.span
                        className="match-heart"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.45,
                          type: "spring",
                          stiffness: 300,
                          damping: 12,
                        }}
                      >
                        <Heart size={28} fill="currentColor" />
                      </motion.span>
                      <motion.div
                        className="match-avatar match-you"
                        initial={{ x: 45, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <YouAvatar />
                      </motion.div>
                      <span className="match-name">{activeFarmer.name}</span>
                      <span className="match-name">{copy.matched.you}</span>
                    </div>
                    <p className="matched-description">
                      {copy.matched.description(activeFarmer.name)}
                    </p>
                    <div className="match-bottom">
                      <button
                        className="primary white-primary"
                        onClick={() => goto("chat")}
                      >
                        <MessageCircle size={19} />
                        {copy.matched.cta}
                        <ArrowRight size={18} />
                      </button>
                      <button
                        className="text-button"
                        onClick={() => goto("discover")}
                      >
                        {copy.matched.later}
                      </button>
                      <span className="match-note">
                        <Sprout size={15} />
                        {copy.matched.note}
                      </span>
                    </div>
                  </div>
                )}
                {state.screen === "chat" && (
                  <Chat
                    farmer={activeFarmer}
                    state={state}
                    onSend={(text, questionId) =>
                      dispatch({ type: "send", pending: { text, questionId } })
                    }
                    onOffer={() => goto("offer")}
                  />
                )}
                {state.screen === "offer" && (
                  <div className="offer-layout">
                    <div className="offer-scroll">
                      <div className="offer-heading">
                        <span className="eyebrow">{copy.offer.eyebrow}</span>
                        <h1>{copy.offer.title(activeFarmer.name)}</h1>
                        <div className="from-farmer">
                          <img
                            src={activeFarmer.photos[0].src}
                            alt={ui.app.farmerName(activeFarmer.name)}
                          />
                          <span>
                            {ui.app.offerFrom}
                            <Heart size={13} fill="currentColor" />
                          </span>
                        </div>
                      </div>
                      <div className="offer-photo">
                        <img src={product.image} alt={product.title} />
                        <span>
                          <Sprout size={14} /> {ui.app.offerPhotoCaption}
                        </span>
                      </div>
                      <div className="offer-information">
                        <p className="product-brand">
                          <Sprout size={12} />
                          {activeFarmer.agriculture.brand}
                        </p>
                        <p className="product-subtitle">{product.subtitle}</p>
                        <h2>{product.title}</h2>
                        <div className="offer-price">
                          {product.price}
                          <span>{product.shipping}</span>
                        </div>
                        <AgricultureInfo
                          agriculture={activeFarmer.agriculture}
                          compact
                        />
                        <div className="letter-card">
                          <span className="letter-heart">
                            <Heart size={19} />
                          </span>
                          <span className="letter-label">
                            {copy.offer.letter}
                          </span>
                          <p>{product.letter}</p>
                          <img src={activeFarmer.photos[0].src} alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="offer-bottom">
                      <button
                        className="primary"
                        onClick={() => goto("completed")}
                      >
                        {product.cta}
                        <Heart size={18} fill="currentColor" />
                      </button>
                      <p className="demo-note">{copy.offer.demoNote}</p>
                    </div>
                  </div>
                )}
                {state.screen === "completed" && (
                  <div className="completed-content">
                    <Confetti leaves />
                    <span className="eyebrow">{copy.completed.eyebrow}</span>
                    <div className="completion-art">
                      <img
                        className="completion-product"
                        src={product.image}
                        alt={product.title}
                      />
                      <img
                        className="completion-farmer"
                        src={activeFarmer.photos[0].src}
                        alt={ui.app.farmerName(activeFarmer.name)}
                      />
                      <motion.span
                        className="completion-sprout"
                        initial={{ scale: 0, rotate: -40 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      >
                        <Sprout size={30} />
                      </motion.span>
                      <span className="completion-doodle">
                        {ui.app.completionDoodle}
                      </span>
                    </div>
                    <h1>{copy.completed.title}</h1>
                    <p className="completion-message">
                      {copy.completed.message}
                    </p>
                    <div className="connection-pill">
                      <Heart size={13} fill="currentColor" />
                      {copy.completed.connection(activeFarmer.name)}
                    </div>
                    <p className="completion-description">
                      {copy.completed.description}
                    </p>
                    <div className="completed-bottom">
                      <button className="primary" onClick={reset}>
                        {copy.completed.cta}
                        <RotateCcw size={18} />
                      </button>
                      <p className="demo-note">{copy.completed.demoNote}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.main>
        </ScreenTransition>
        <AnimatePresence>
          {sheet && (
            <Modal
              key={sheet}
              title={
                sheet === "profile"
                  ? ui.app.profileDetailsTitle(activeFarmer.name)
                  : sheet === "reset"
                    ? copy.shared.restartTitle
                    : ui.app.menu
              }
              onClose={() => setSheet(null)}
            >
              {sheet === "profile" ? (
                <ProfileDetail farmer={activeFarmer} />
              ) : sheet === "reset" ? (
                <div className="settings-content reset-content">
                  <div className="settings-icon">
                    <RotateCcw size={27} />
                  </div>
                  <h2>{copy.shared.restartTitle}</h2>
                  <p>{copy.shared.restartDescription}</p>
                  <button className="primary" onClick={reset}>
                    {copy.shared.confirmRestart}
                  </button>
                  <button
                    className="text-button"
                    onClick={() => setSheet(null)}
                  >
                    {copy.shared.cancel}
                  </button>
                </div>
              ) : (
                <div className="settings-content">
                  <div className="settings-icon">
                    <Heart fill="currentColor" size={26} />
                  </div>
                  <h2>{ui.app.settingsTitle}</h2>
                  <p>{ui.app.settingsDescription}</p>
                  <div className="settings-match">
                    {matchedFarmer ? (
                      <button
                        onClick={() => {
                          setSheet(null);
                          goto("chat");
                        }}
                      >
                        <img src={matchedFarmer.photos[0].src} alt="" />
                        <span>
                          <strong>
                            {ui.chat.conversationLabel(matchedFarmer.name)}
                          </strong>
                          <small>{ui.app.settingsMatchSubtitle}</small>
                        </span>
                        <ChevronRight size={18} />
                      </button>
                    ) : (
                      <div>
                        <MessageCircle size={24} />
                        <span>
                          {ui.app.settingsNoMatchTitle}
                          <small>{ui.app.settingsNoMatchSubtitle}</small>
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    className="settings-reset"
                    onClick={() => setSheet("reset")}
                  >
                    <RotateCcw size={18} />
                    {copy.shared.restart}
                    <ChevronRight size={17} />
                  </button>
                  <div className="about-demo">
                    <ShieldCheck size={17} />
                    <p>
                      {copy.shared.fictional}
                      <br />
                      {ui.app.generatedImages}
                      <br />
                      {ui.app.noTransactions}
                    </p>
                  </div>
                  <Brand />
                </div>
              )}
            </Modal>
          )}
        </AnimatePresence>
      </div>
      <div className="desktop-footer">
        <span>{ui.app.desktopFooter}</span>
        <span>{ui.app.copyright}</span>
      </div>
    </div>
  );
}
function ProfileDetail({ farmer }: { farmer: Farmer }) {
  return (
    <div className="profile-detail">
      <div className="detail-photo">
        <img
          src={farmer.photos[0].src}
          alt={farmer.photos[0].alt}
          style={{ objectPosition: farmer.photos[0].position }}
        />
        <span className="detail-compatibility">
          <Heart fill="currentColor" size={13} /> {ui.swipe.compatibility}{" "}
          {farmer.compatibility}%
        </span>
      </div>
      <div className="detail-body">
        <div className="detail-name">
          <h2>
            {farmer.name}
            <span>{farmer.age}</span>
          </h2>
          <BadgeCheck size={22} fill="#ff4d78" color="white" />
        </div>
        <div className="detail-meta">
          <MapPin size={14} />
          {farmer.region}
          <span>・</span>
          <Sprout size={14} />
          {ui.swipe.farmerCrop(farmer.crop)}
        </div>
        <h3 className="detail-tagline">{farmer.tagline}</h3>
        <p>{farmer.bio}</p>
        <section>
          <h3>{copy.discover.hobbies}</h3>
          <div className="interest-tags">
            {farmer.hobbies.map((hobby) => (
              <span key={hobby}>{hobby}</span>
            ))}
          </div>
        </section>
        <section>
          <h3>{copy.discover.personality}</h3>
          <div className="interest-tags personality-tags">
            {farmer.personality.map((trait) => (
              <span key={trait}>{trait}</span>
            ))}
          </div>
        </section>
        <section>
          <h3>
            <Sprout size={16} />
            {copy.discover.reason}
          </h3>
          <p>{farmer.reason}</p>
        </section>
        <section className="surprise-section">
          <h3>
            <Sparkles size={16} />
            {copy.discover.surprise}
          </h3>
          <p>{farmer.surprise}</p>
        </section>
        <section>
          <h3>{copy.discover.growing}</h3>
          <div className="growing-card">
            <img src={farmer.photos[2].src} alt={farmer.photos[2].alt} />
            <strong>
              {farmer.emoji} {farmer.crop}
            </strong>
          </div>
          <AgricultureInfo agriculture={farmer.agriculture} />
        </section>
        <section>
          <h3>{copy.discover.daily}</h3>
          <img
            className="daily-photo"
            src={farmer.photos[1].src}
            alt={farmer.photos[1].alt}
          />
          <p className="daily-caption">{farmer.dailyCaption}</p>
        </section>
        <p className="demo-note">{copy.shared.fictional}</p>
      </div>
    </div>
  );
}
function Confetti({ leaves = false }: { leaves?: boolean }) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div
      className={`confetti ${leaves ? "leaf-confetti" : ""}`}
      aria-hidden="true"
    >
      {Array.from({ length: 16 }, (_, i) => (
        <motion.span
          key={i}
          style={{
            left: `${(i * 29 + 7) % 100}%`,
            color: leaves
              ? ["#7fa989", "#b7cdb2", "#ffadc0"][i % 3]
              : ["#fff", "#ffd1db", "#ffc397"][i % 3],
          }}
          initial={{ y: -40, opacity: 0, rotate: i * 24 }}
          animate={{
            y: [0, 600],
            opacity: [0, 0.8, 0],
            rotate: i * 24 + 180,
            x: i % 2 ? 25 : -30,
          }}
          transition={{ duration: 2.3, delay: 0.12 * i, ease: "easeOut" }}
        >
          {i % 3 ? (
            <Heart size={i % 2 ? 13 : 9} fill="currentColor" />
          ) : (
            <Leaf size={17} fill="currentColor" />
          )}
        </motion.span>
      ))}
    </div>
  );
}
