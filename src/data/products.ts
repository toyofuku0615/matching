import type { FarmerId, Product } from "./types";

const image = (name: string) =>
  `${import.meta.env.BASE_URL}images/${name}.webp`;

/** Fictional prices: the experience never places an order or requests payment. */
export const products: Record<FarmerId, Product> = {
  miho: {
    id: "miho-strawberry-share",
    title: "朝採れいちご お試しセット",
    shortTitle: "完熟いちご お試しセット",
    subtitle: "みほさんが育てたいちご · 2パック",
    image: image("strawberries"),
    price: "¥1,800",
    shipping: "送料込み · 体験版の架空価格です",
    letter:
      "まずは2パック。私にしては控えめです。\nお茶を入れて、座って食べてね。\n— みほ",
    cta: "この人のいちごを食べてみたい",
  },
  takumi: {
    id: "takumi-tomato-share",
    title: "完熟トマト お試しセット",
    shortTitle: "完熟トマト お試しセット",
    subtitle: "たくみさんが育てたトマト · 約700g",
    image: image("tomatoes"),
    price: "¥1,600",
    shipping: "送料込み · 体験版の架空価格です",
    letter:
      "まずは切って、そのまま。\n説明は短めに。味の話はトマトに任せます。\n— たくみ",
    cta: "この人のトマトを食べてみたい",
  },
  masao: {
    id: "masao-rice-share",
    title: "まさおの新米 お試しセット",
    shortTitle: "新潟のお米 お試しセット",
    subtitle: "まさおさんが育てたお米 · 2合×3袋",
    image: image("rice"),
    price: "¥1,400",
    shipping: "送料込み · 体験版の架空価格です",
    letter:
      "おかずは、いつものもので。\nおかわりが出たら、今年もひと安心です。\n— まさお",
    cta: "この人のお米を食べてみたい",
  },
};
