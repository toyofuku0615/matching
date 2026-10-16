import type { FarmerId, Product } from "./types";
import { agriculture, MASAO_DUCK_COUNT } from "./agriculture";

const image = (name: string) =>
  `${import.meta.env.BASE_URL}images/${name}.webp`;

/** Fictional prices: the experience never places an order or requests payment. */
export const products: Record<FarmerId, Product> = {
  miho: {
    id: "miho-strawberry-share",
    title: `朝採れ ${agriculture.miho.variety} お試しセット`,
    shortTitle: `${agriculture.miho.variety} おすそ分け`,
    subtitle: `${agriculture.miho.variety} · ${agriculture.miho.method} · 2パック`,
    image: image("strawberries"),
    price: "¥1,800",
    shipping: "送料込み · 体験版の架空価格です",
    letter: `${agriculture.miho.method}で育てた${agriculture.miho.variety}を、朝に摘みました。\nまずは2パック。私にしては控えめです。\nお茶を入れて、座って食べてね。\n— みほ`,
    cta: "この人のいちごを食べてみたい",
  },
  takumi: {
    id: "takumi-tomato-share",
    title: `完熟 ${agriculture.takumi.variety}トマト お試しセット`,
    shortTitle: `${agriculture.takumi.variety} おすそ分け`,
    subtitle: `${agriculture.takumi.variety} · ${agriculture.takumi.method} · 約700g`,
    image: image("tomatoes"),
    price: "¥1,600",
    shipping: "送料込み · 体験版の架空価格です",
    letter: `毎朝、葉と実の色を見て育てた${agriculture.takumi.method}の${agriculture.takumi.variety}です。樹の上で色づくのを待ちました。\nまずは切って、そのまま。\n今度は、食べたあなたの顔が気になります。\n— たくみ`,
    cta: "この人のトマトを食べてみたい",
  },
  masao: {
    id: "masao-rice-share",
    title: `合鴨育ち ${agriculture.masao.variety} お試しセット`,
    shortTitle: `${agriculture.masao.variety} おすそ分け`,
    subtitle: `${agriculture.masao.variety} · ${agriculture.masao.method} · 2合×3袋`,
    image: image("rice"),
    price: "¥1,400",
    shipping: "送料込み · 体験版の架空価格です",
    letter: `${MASAO_DUCK_COUNT}羽の合鴨と、${agriculture.masao.method}で育てた${agriculture.masao.variety}です。\nおかずは、いつものもので。\nおかわりが出たら、今年もひと安心です。\n— まさお`,
    cta: "この人のお米を食べてみたい",
  },
};
