import type { Farmer, FarmerId } from "./types";
import { agriculture } from "./agriculture";

const image = (name: string) =>
  `${import.meta.env.BASE_URL}images/${name}.webp`;

/** All people, biographies, farms, and growing claims in this demo are fictional. */
export const farmers: Farmer[] = [
  {
    id: "miho",
    name: "みほ",
    age: 68,
    region: "栃木県",
    crop: "いちご",
    emoji: "🍓",
    compatibility: 98,
    tagline: "甘やかすのが得意です。",
    bio: "いちごを育てて48年。まず座って、お茶飲んで、いちご食べて。帰りに持たせる野菜までが、おもてなしです。手ぶらでは帰しません。",
    hobbies: ["漬物づくり", "道の駅めぐり", "ラジオ"],
    personality: ["世話焼き", "気前がいい", "段取り上手"],
    reason:
      "親の畑を手伝っていたら、いつの間にか48年。「今年も待ってたよ」と言われるとね。来年の苗の注文まで、手が早くなります。",
    surprise: "「少し持っていきな」の「少し」は、うちでは段ボール1箱です。",
    agriculture: agriculture.miho,
    photos: [
      {
        src: image("miho"),
        alt: "68歳のいちご農家・みほの架空プロフィール写真",
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
      "朝はハウスをひと回り。お客さんが来る日は、いちごより先に湯を沸かします。",
  },
  {
    id: "takumi",
    name: "たくみ",
    age: 72,
    region: "千葉県",
    crop: "トマト",
    emoji: "🍅",
    compatibility: 96,
    tagline: "トマト一筋、浮気しません。",
    bio: "トマト一筋50年。土と水と天気は、毎日記録します。記念日は忘れても、追肥の日は忘れません。愛犬のむぎが見回り担当です。",
    hobbies: ["愛犬の散歩", "栽培記録", "包丁研ぎ"],
    personality: ["研究熱心", "几帳面", "口数は少なめ"],
    reason:
      "父の手伝いで始めました。「来年はもっとよくなる」と思って続けて50年。毎年、来年の課題がちゃんと出ます。",
    surprise:
      "トマト作りは50年。料理は今でも、切る係です。包丁の手入れだけは一人前。",
    agriculture: agriculture.takumi,
    photos: [
      {
        src: image("takumi"),
        alt: "72歳のトマト農家・たくみの架空プロフィール写真",
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
      "水やりは土を見て決めます。犬のむぎは時計を見ずに、ごはんの催促が正確です。",
  },
  {
    id: "masao",
    name: "まさお",
    age: 76,
    region: "新潟県",
    crop: "お米",
    emoji: "🌾",
    compatibility: 93,
    tagline: "米とは55年の真剣交際。",
    bio: "米を作って55年。毎朝、田んぼの水と天気予報を確認します。釣りにも行きますが、稲の都合が優先です。新米どきは家族の集合率が上がります。",
    hobbies: ["釣り", "演歌", "孫と過ごすこと"],
    personality: ["おおらか", "観察好き", "話は短め"],
    reason:
      "親父の田んぼを継いで55年。同じように作っても、同じ年はひとつもない。まだ卒業証書はもらえんですね。",
    surprise: "釣りの予定は田んぼ次第。先約は、だいたい稲です。",
    agriculture: agriculture.masao,
    photos: [
      {
        src: image("masao"),
        alt: "76歳の米農家・まさおの架空プロフィール写真",
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
      "朝いちばんに水を見に行きます。「ちょっと田んぼへ」は、帰る時間が読めません。",
  },
];

export function getFarmer(id: FarmerId): Farmer {
  // All three IDs are supplied by local data; the fallback also protects saved demo links.
  return farmers.find((farmer) => farmer.id === id) ?? farmers[0]!;
}
