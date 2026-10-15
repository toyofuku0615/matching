import type { Farmer, FarmerId } from "./types";

const image = (name: string) =>
  `${import.meta.env.BASE_URL}images/${name}.webp`;

/** All people, biographies, farms, and growing claims in this demo are fictional. */
export const farmers: Farmer[] = [
  {
    id: "miho",
    name: "みほ",
    age: 28,
    region: "栃木県",
    crop: "いちご",
    emoji: "🍓",
    compatibility: 98,
    tagline: "甘やかすのが得意です。",
    bio: "東京の会社で働いていましたが、実家のいちご農園を継ぎました。毎朝いちごの顔を見るのが日課です。甘いものも、甘い人も好きです。笑",
    hobbies: ["カフェ巡り", "写真", "旅行"],
    personality: ["明るい", "ちょっと心配性", "負けず嫌い"],
    reason:
      "父のいちごを食べたお客さんの「今年も美味しいね」が、忘れられなくて。誰かの楽しみを育てる仕事がしたいと思いました。",
    surprise: "実は虫が苦手。でも、農家になってから少しずつ慣れてきました。",
    photos: [
      {
        src: image("miho"),
        alt: "いちご農家・みほの架空プロフィール写真",
        position: "50% 32%",
      },
      {
        src: image("greenhouse"),
        alt: "陽の光が差し込むいちごのハウス",
        position: "50% 50%",
      },
      {
        src: image("strawberries"),
        alt: "みほが育てている完熟いちごのイメージ",
        position: "50% 50%",
      },
    ],
    dailyCaption:
      "朝のハウスがいちばん好き。いちごの様子を見ながら、今日もおはよう。",
  },
  {
    id: "takumi",
    name: "たくみ",
    age: 32,
    region: "千葉県",
    crop: "トマト",
    emoji: "🍅",
    compatibility: 96,
    tagline: "トマト一筋、浮気しません。",
    bio: "甘いトマトを育てて8年。愛犬との散歩が休日の楽しみです。美味しいトマトを作る研究だけは誰にも負けません。",
    hobbies: ["犬", "ドライブ", "料理"],
    personality: ["一途", "研究熱心", "少し照れ屋"],
    reason:
      "父の手伝いから始めた農業。自分のトマトを食べて驚いてくれた人の顔が、今でも原動力です。",
    surprise: "料理は苦手。トマトはそのまま食べるのが一番だと思っています。",
    photos: [
      {
        src: image("takumi"),
        alt: "トマト農家・たくみの架空プロフィール写真",
        position: "50% 32%",
      },
      {
        src: image("tomato-greenhouse"),
        alt: "たくみがトマトのつるを手入れする日常のイメージ",
        position: "60% 50%",
      },
      {
        src: image("tomatoes"),
        alt: "たくみが育てている真っ赤なトマトのイメージ",
        position: "50% 50%",
      },
    ],
    dailyCaption:
      "今日のトマトもいい顔をしてます。帰ったら、愛犬といつもの道を散歩。",
  },
  {
    id: "masao",
    name: "まさお",
    age: 64,
    region: "新潟県",
    crop: "お米",
    emoji: "🌾",
    compatibility: 93,
    tagline: "米とは40年以上の真剣交際。",
    bio: "毎年、新米ができると孫が遊びに来ます。釣りと演歌が好きです。田んぼを見ていると、今でも毎年新しい発見があります。",
    hobbies: ["釣り", "演歌", "孫と過ごすこと"],
    personality: ["おおらか", "聞き上手", "実はお茶目"],
    reason:
      "親父の代から受け継いだ田んぼ。毎年違う表情を見せてくれるから、40年経っても飽きんのです。",
    surprise: "最近、孫に教わってスマホを使い始めました。",
    photos: [
      {
        src: image("masao"),
        alt: "米農家・まさおの架空プロフィール写真",
        position: "50% 32%",
      },
      {
        src: image("field"),
        alt: "新潟の緑豊かな田んぼのイメージ",
        position: "50% 50%",
      },
      {
        src: image("rice"),
        alt: "まさおが育てたお米を炊き上げたイメージ",
        position: "50% 50%",
      },
    ],
    dailyCaption:
      "朝いちばんに田んぼへ。水を見て、空を見て、今日の相談をするんです。",
  },
];

export function getFarmer(id: FarmerId): Farmer {
  // All three IDs are supplied by local data; the fallback also protects saved demo links.
  return farmers.find((farmer) => farmer.id === id) ?? farmers[0]!;
}
