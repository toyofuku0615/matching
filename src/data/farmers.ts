import type { Farmer, FarmerId } from "./types";
import { agriculture, MASAO_DUCK_COUNT } from "./agriculture";

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
    tagline: "毎朝、顔色をうかがってます。",
    bio: "トマトを育てて50年。朝の見回りと記録を欠かしません。気になることがあると、昨日のノートまで開きます。愛犬のむぎは、そこまで待ってくれません。",
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
      "朝は葉と実の色、土の湿りを確かめます。犬のむぎは時計を見ずに、ごはんの催促が正確です。",
  },
  {
    id: "masao",
    name: "まさお",
    age: 76,
    region: "新潟県",
    crop: "お米",
    emoji: "🌾",
    compatibility: 93,
    tagline: `カモを${MASAO_DUCK_COUNT}羽飼ってます。`,
    bio: `米を作って55年。カモを${MASAO_DUCK_COUNT}羽飼いながら、田んぼの水と天気予報を毎朝見ています。釣りの予定は稲と相談。新米どきは家族の集合率が上がります。`,
    hobbies: ["釣り", "演歌", "孫と過ごすこと"],
    personality: ["おおらか", "観察好き", "話は短め"],
    reason:
      "親父の田んぼを継いで55年。同じように作っても、同じ年はひとつもない。まだ卒業証書はもらえんですね。",
    surprise: `カモが${MASAO_DUCK_COUNT}羽いると、静かな朝はまずありません。釣りの支度より先に、みんなの様子を見に行きます。`,
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
    dailyCaption: `朝は田んぼの水と、${MASAO_DUCK_COUNT}羽のカモの様子を確認。「ちょっと田んぼへ」は、帰る時間が読めません。`,
  },
];

export function getFarmer(id: FarmerId): Farmer {
  // All three IDs are supplied by local data; the fallback also protects saved demo links.
  return farmers.find((farmer) => farmer.id === id) ?? farmers[0]!;
}
