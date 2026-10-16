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
    bio: "いちごを育てて48年。人が来ると、お茶といちごを用意したくなる世話焼きです。おいしく食べてもらえるのが、日々の楽しみです。",
    hobbies: ["漬物づくり", "道の駅めぐり", "ラジオ"],
    personality: ["世話焼き", "気前がいい", "段取り上手"],
    reason:
      "親の畑を手伝ったのがきっかけで、48年続けてきました。「今年も待ってたよ」と言ってもらえるのが、いちばんの励みです。",
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
      "朝はハウスを見回って、葉と実の様子を確認します。熟したいちごを、涼しいうちに一つずつ摘みます。",
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
    bio: "トマトを育てて50年。朝の見回りと栽培の記録を欠かしません。愛犬のむぎと、畑のまわりを散歩するのも日課です。",
    hobbies: ["愛犬の散歩", "栽培記録", "包丁研ぎ"],
    personality: ["研究熱心", "几帳面", "口数は少なめ"],
    reason:
      "父の畑を手伝ったのがきっかけです。もっとよく育てたいと思い、毎年の記録を見返しながら、水やりや手入れを工夫しています。",
    surprise:
      "トマト作りは50年ですが、料理ではもっぱら切る係です。包丁の手入れは好きですよ。",
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
      "朝は葉と実の色、土の湿り、天気を確かめます。その日の状態に合わせて水の量やハウスの換気を調整します。",
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
    bio: `米を作って55年。${MASAO_DUCK_COUNT}羽の合鴨と、コシヒカリを育てています。休みの日は釣りに出かけたり、孫と過ごしたりしています。`,
    hobbies: ["釣り", "演歌", "孫と過ごすこと"],
    personality: ["おおらか", "観察好き", "話は短め"],
    reason:
      "親父の田んぼを継いだのが始まりです。天候で稲の育ち方が変わるので、55年たった今も毎年学ぶことがあります。",
    surprise:
      "新米の時期は家族がよく帰ってきます。帰りには、だいたい米袋を抱えています。",
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
    dailyCaption: `朝は田んぼの水の深さや稲の育ち、${MASAO_DUCK_COUNT}羽のカモの元気を見て回ります。天候に合わせて水を管理します。`,
  },
];

export function getFarmer(id: FarmerId): Farmer {
  // All three IDs are supplied by local data; the fallback also protects saved demo links.
  return farmers.find((farmer) => farmer.id === id) ?? farmers[0]!;
}
