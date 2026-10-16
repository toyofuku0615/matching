import type { AgricultureProfile, FarmerId } from "./types";

/** Fictional flock size shared by Masao's profile, conversations, and gift. */
export const MASAO_DUCK_COUNT = 30;

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
      "大玉トマトの桃太郎を土耕栽培で育てています。毎朝の観察をもとに、水やりやハウスの換気を調整しています。",
    practices: [
      {
        title: "毎朝の観察で水加減を決める",
        description:
          "葉や実の色、土の乾き具合、天気を見て、水の量や換気を調整。観察と手入れの内容は、毎日ノートに記録します。",
      },
      {
        title: "脇芽の手入れをこつこつ",
        description: "脇芽を取り、葉や茎を整えて、光と風が届きやすくします。",
      },
      {
        title: "熟し具合を見て収穫",
        description:
          "実を株につけたまま熟すのを待ち、色づきを確かめて収穫します。",
      },
    ],
  },
  masao: {
    brand: "まさおの合鴨田んぼ米",
    variety: "コシヒカリ",
    method: "合鴨農法",
    summary: `コシヒカリを、${MASAO_DUCK_COUNT}羽の合鴨と育てています。合鴨に草や虫を食べてもらいながら、私は水の深さや稲の状態を毎日確認します。`,
    practices: [
      {
        title: "合鴨が草や虫を食べる",
        description: `田植え後の田んぼに${MASAO_DUCK_COUNT}羽の合鴨を放し、草や虫を食べてもらいます。稲だけでなく、合鴨の元気も毎朝確かめます。`,
      },
      {
        title: "泳いで水をかき混ぜる",
        description:
          "合鴨が泳いで水をかき混ぜると、雑草が育ちにくくなります。私は水の深さや稲を毎日確認します。",
      },
      {
        title: "穂が出る前に合鴨を移す",
        description:
          "合鴨が稲穂を食べないよう、穂が出る前に田んぼから引き上げます。その後も水管理を続けます。",
      },
    ],
  },
};
