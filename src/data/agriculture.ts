import type { AgricultureProfile, FarmerId } from "./types";

/** Fictional farm brands and practices for this demo, using real crop varieties. */
export const agriculture: Record<FarmerId, AgricultureProfile> = {
  miho: {
    brand: "みほの甘やかしいちご",
    variety: "とちあいか",
    method: "土耕栽培",
    summary:
      "土で育てる、とちあいか。葉と実を毎朝見回り、色づきを確かめて朝の涼しいうちに摘みます。",
    practices: [
      {
        title: "根っこが育つ土づくり",
        description: "水はけと土の状態を確かめ、根が育ちやすい畝を整えます。",
      },
      {
        title: "葉っぱと実を毎朝確認",
        description: "葉の色や実のつき方を見て、必要に応じて実の数を整えます。",
      },
      {
        title: "色づきを見て朝採り",
        description: "ひと粒ずつ熟し具合を見極め、朝の涼しいうちに収穫します。",
      },
    ],
  },
  takumi: {
    brand: "たくみの一途トマト",
    variety: "桃太郎",
    method: "土耕栽培",
    summary:
      "大玉トマトの桃太郎を、土でじっくり。土・葉・天気で水加減を決めます。一途ですが、毎日同じ対応はしません。",
    practices: [
      {
        title: "水やりは畑に聞く",
        description:
          "土の乾き具合、葉の様子、その日の天気を見て水の量を調整します。",
      },
      {
        title: "脇芽の手入れをこつこつ",
        description: "脇芽を取り、葉や茎を整えて、光と風が届きやすくします。",
      },
      {
        title: "樹の上で色づきを待つ",
        description:
          "樹についたまま熟し具合を確かめ、食べごろを見て収穫します。",
      },
    ],
  },
  masao: {
    brand: "まさおの合鴨田んぼ米",
    variety: "コシヒカリ",
    method: "合鴨農法",
    summary:
      "コシヒカリの田んぼで、合鴨が草や虫を食べてお手伝い。水の見回りは私。炊くところは炊飯器です。",
    practices: [
      {
        title: "合鴨は草取りの相棒",
        description: "田植え後の田んぼに合鴨を放し、草や虫を食べてもらいます。",
      },
      {
        title: "泳ぐ仕事と、水を見る仕事",
        description:
          "合鴨が泳いで水をかき混ぜると、雑草が育ちにくくなります。私は水の深さや稲を毎日確認します。",
      },
      {
        title: "穂が出る前に選手交代",
        description:
          "合鴨が稲穂を食べないよう、穂が出る前に田んぼから引き上げます。その後も水管理を続けます。",
      },
    ],
  },
};
