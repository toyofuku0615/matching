import { useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowUp, ChevronRight, Gift, Heart, Sprout } from "lucide-react";
import type { Farmer } from "../data/types";
import { conversations } from "../data/conversations";
import { products } from "../data/products";
import { ui } from "../data/copy";
import type { Experience } from "../useExperience";

export function Chat({
  farmer,
  state,
  onSend,
  onOffer,
}: {
  farmer: Farmer;
  state: Experience;
  onSend: (text: string, questionId?: string) => void;
  onOffer: () => void;
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const restoreQuestionFocus = useRef(false);
  const conversation = conversations[farmer.id];
  const product = products[farmer.id];
  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "instant",
    });
  }, [state.messages.length, state.pending, state.offerUnlocked]);
  useLayoutEffect(() => {
    if (!state.pending && restoreQuestionFocus.current) {
      if (
        document.activeElement === document.body ||
        document.activeElement?.matches(".screen-chat")
      ) {
        composerRef.current
          ?.querySelector<HTMLElement>(
            ".quick-replies button:not(:disabled), input",
          )
          ?.focus({ preventScroll: true });
      }
      restoreQuestionFocus.current = false;
    }
  }, [state.pending, state.answered.length]);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || state.pending) return;
    onSend(text);
    setInput("");
  };
  return (
    <div className="chat-layout">
      <div
        className="conversation"
        ref={scrollRef}
        role="log"
        aria-label={ui.chat.conversationLabel(farmer.name)}
        aria-live="polite"
      >
        <div className="chat-date">{ui.chat.date}</div>
        <div className="chat-note">
          <Heart size={11} fill="currentColor" /> {ui.chat.matchNote}
        </div>
        {state.messages.map((message, index) => (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            key={message.id}
            className={`message-row ${message.from === "you" ? "own" : ""} ${state.messages[index - 1]?.from === message.from ? "grouped" : ""}`}
          >
            {message.from === "farmer" && (
              <img
                className="message-avatar"
                src={farmer.photos[0].src}
                alt=""
              />
            )}
            <div>
              <div className="bubble">{message.text}</div>
              <span className="message-time">
                {message.from === "you" && `${ui.chat.read} `}12:
                {String(Math.floor(index / 2)).padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        ))}
        {state.pending && (
          <div className="message-row">
            <img className="message-avatar" src={farmer.photos[0].src} alt="" />
            <div
              className="typing bubble"
              aria-label={ui.chat.typingLabel(farmer.name)}
            >
              <i />
              <i />
              <i />
            </div>
          </div>
        )}
        {state.offerUnlocked && (
          <motion.button
            className="chat-product"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onOffer}
          >
            <div className="product-invitation">
              <Gift size={15} />
              {ui.chat.invitation(farmer.name)}
            </div>
            <img src={product.image} alt={product.title} />
            <div className="chat-product-text">
              <span className="tiny-eyebrow">{ui.chat.giftEyebrow}</span>
              <strong>{product.shortTitle}</strong>
              <span>
                {product.price} <small>／ {product.shipping}</small>
              </span>
              <div>
                {ui.chat.productCta} <Heart size={14} fill="currentColor" />
                <ChevronRight size={16} />
              </div>
            </div>
          </motion.button>
        )}
      </div>
      <div className="chat-composer" ref={composerRef}>
        <div className="reply-label">
          <Sprout size={13} />
          {state.answered.length ? ui.chat.replyAgainLabel : ui.chat.replyLabel}
        </div>
        <div className="quick-replies">
          {conversation.questions
            .filter((q) => !state.answered.includes(q.questionId))
            .map((question) => (
              <button
                key={question.questionId}
                disabled={!!state.pending}
                onClick={(event) => {
                  restoreQuestionFocus.current =
                    document.activeElement === event.currentTarget;
                  onSend(question.userMessage, question.questionId);
                }}
              >
                {question.userMessage}
                <PlusTiny />
              </button>
            ))}
        </div>
        <form onSubmit={submit} className="message-form">
          <input
            aria-label={ui.chat.messageLabel}
            placeholder={ui.chat.messagePlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={300}
          />
          <button
            aria-label={ui.chat.sendLabel}
            disabled={!input.trim() || !!state.pending}
            type="submit"
          >
            <ArrowUp size={21} />
          </button>
        </form>
        <p className="demo-note">{ui.chat.demoNote}</p>
      </div>
    </div>
  );
}
function PlusTiny() {
  return <span aria-hidden="true">＋</span>;
}
