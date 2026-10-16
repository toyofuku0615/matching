import type { Conversation, FarmerId } from "./types";
import { agriculture, MASAO_DUCK_COUNT } from "./agriculture";

/** Fixed demo scripts only: no AI, live messages, or real farming claims. */
export const conversations: Record<FarmerId, Conversation> = {
  miho: {
    greeting: [
      "いい根！ありがとうね。みほです🍓\nちょうどひと息ついたところ。まずお茶にしましょう。",
      "甘やかすのは得意ですよ。\nまず座って。いちご食べて。話はそれから。",
    ],
    questions: [
      {
        farmerId: "miho",
        questionId: "reason",
        userMessage: "どうして農家になったんですか？",
        farmerResponse: [
          "親の畑を手伝い始めたのが20歳。気づけば48年です。\n\n『今年も待ってたよ』って言われると、また苗を注文しちゃうのよ。",
          "長続きの秘訣？\nたぶん、毎年『来年こそは少し楽に』と思っていることね。まだ実現してないけど。",
        ],
        typingDelay: 800,
        nextRecommendedQuestion: "sweet",
        offerUnlocked: true,
      },
      {
        farmerId: "miho",
        questionId: "sweet",
        userMessage: "本当に甘やかしてくれるんですか？笑",
        farmerResponse: [
          "甘やかしますよ。\n帰りに持たせる野菜は、断っても増えます。",
          "『そんなに食べきれません』と言われたら、漬物にして持たせます。そこは任せて。",
        ],
        typingDelay: 650,
        nextRecommendedQuestion: "care",
        offerUnlocked: true,
      },
      {
        farmerId: "miho",
        questionId: "care",
        userMessage: "いちごのこだわりは？",
        farmerResponse: [
          `うちの『${agriculture.miho.brand}』は、${agriculture.miho.variety}という品種。${agriculture.miho.method}で育てて、色づきを見て朝に摘みます。\n毎朝、葉っぱと実も確認。実が多ければ、ちゃんと間引く。全部育てたくなるけど、そこは我慢です。`,
          "いちごには厳しく、人にはおかわり。\n同じ甘やかし方はできないのよ。",
        ],
        typingDelay: 750,
        nextRecommendedQuestion: "pesticides",
        offerUnlocked: true,
      },
      {
        farmerId: "miho",
        questionId: "pesticides",
        userMessage: "農薬は使っていますか？",
        farmerResponse: [
          "必要なときは使います。使った日や量も記録していますよ。\n気になることは、遠慮なく聞いてね。",
          "毎日の見回りも大事です。\n『こらっ』で虫が帰ってくれたら、私も楽なんだけどね。",
        ],
        typingDelay: 700,
        nextRecommendedQuestion: "reason",
        offerUnlocked: true,
      },
    ],
    fallback:
      "ここは決まった台本で話す体験版なの。下の質問から選んでね。いちごをつまむつもりで、気楽にどうぞ🍓",
    invitation:
      "そうだ、いちごを2パック用意したの。まずはこれくらいから。私の『少し』にしては控えめよ🍓",
  },
  takumi: {
    greeting: [
      "いい根、どうも。たくみです🍅\n朝の見回りが済んだところです。",
      "プロフィールの一言、気になりましたか。\n話すのは得意ではないですが、気になることなら聞いてください。",
    ],
    questions: [
      {
        farmerId: "takumi",
        questionId: "care",
        userMessage: "誰の顔色をうかがっているんですか？",
        farmerResponse: [
          "もちろん、トマトです。\n毎朝、葉や実の色、土の湿り、天気を見ます。土が湿っていれば水を控えるし、暑い日は換気を調整。見たことは毎日ノートに残しています。",
          `『${agriculture.takumi.brand}』は、${agriculture.takumi.variety}を${agriculture.takumi.method}で。樹で色づくまで待ちます。\n50年やっても、朝は答え合わせです。まずは切って、そのままどうぞ。`,
        ],
        typingDelay: 700,
        nextRecommendedQuestion: "dog",
        offerUnlocked: true,
      },
      {
        farmerId: "takumi",
        questionId: "reason",
        userMessage: "どうして農家になったんですか？",
        farmerResponse: [
          "22歳のとき、父の畑を手伝い始めました。\n『来年はもっとよくなる』と思って、50年です。",
          "今年も課題が出ました。\nトマトの研究には、定年がないようです。",
        ],
        typingDelay: 800,
        nextRecommendedQuestion: "care",
        offerUnlocked: true,
      },
      {
        farmerId: "takumi",
        questionId: "dog",
        userMessage: "愛犬はどんな子ですか？",
        farmerResponse: [
          "柴犬のむぎです。畑の見回りについてきます。\n近所への挨拶は、だいたいあっちが担当です。",
          "見回りが終わると、先に家へ帰ろうとします。\n残業はしない方針らしい。見習いたいですね。",
        ],
        typingDelay: 650,
        nextRecommendedQuestion: "cooking",
        offerUnlocked: true,
      },
      {
        farmerId: "takumi",
        questionId: "cooking",
        userMessage: "おすすめの食べ方、教えてください！",
        farmerResponse: [
          "まずは切って、そのまま。次に塩を少し。\n余ったら卵と炒めるといいです。",
          "私は切る係です。\n育てるのに50年かけたので、調理は手短に済ませています。",
        ],
        typingDelay: 750,
        nextRecommendedQuestion: "reason",
        offerUnlocked: true,
      },
    ],
    fallback:
      "ここは決まった台本で話す体験版です。下の質問を選んでください。土とトマトの話なら、口数が増えます🍅",
    invitation:
      "トマト、少し食べてみますか。説明はこの辺にして、あとは現物に任せます🍅",
  },
  masao: {
    greeting: [
      "いい根、ありがとうね。まさおです🌾\n田んぼから戻って、お茶をいれたところです。",
      "プロフィールのカモ、気になりましたか。\n聞かれると、つい話が長くなります。",
    ],
    questions: [
      {
        farmerId: "masao",
        questionId: "care",
        userMessage: "なんでそんなにカモを飼っているんですか？",
        farmerResponse: [
          `うちの${MASAO_DUCK_COUNT}羽は、米作りの相棒なんです。\n合鴨が草や虫を食べ、泳いで水をかき混ぜます。私は水の深さと稲の育ち、カモの元気を毎朝見ます。`,
          `穂を食べられないよう、穂が出る前には田んぼから上げるんです。\n『${agriculture.masao.brand}』は、${agriculture.masao.variety}を${agriculture.masao.method}で。55年やっても、天気には教わるばかりです。\n台所では炊飯器に頑張ってもらいます。分担です。`,
        ],
        typingDelay: 800,
        nextRecommendedQuestion: "holiday",
        offerUnlocked: true,
      },
      {
        farmerId: "masao",
        questionId: "reason",
        userMessage: "どうして農家になったんですか？",
        farmerResponse: [
          "21歳で親父の田んぼを継いで、55年。\n同じように作っても、同じ年はひとつもないんです。",
          "ベテランとは言われますがね。\n天気のほうは、こちらの経歴を見てくれません。",
        ],
        typingDelay: 900,
        nextRecommendedQuestion: "family",
        offerUnlocked: true,
      },
      {
        farmerId: "masao",
        questionId: "family",
        userMessage: "農家をしていて嬉しいことは？",
        farmerResponse: [
          "新米の時期は、家族がよく帰ってきます。\n『元気だった？』の次には『米、ある？』ですね。",
          "おかわりの声が聞けるのが、いちばん嬉しい。\n帰りの車は少し重くなります。米を積むので。",
        ],
        typingDelay: 850,
        nextRecommendedQuestion: "care",
        offerUnlocked: true,
      },
      {
        farmerId: "masao",
        questionId: "holiday",
        userMessage: "お休みの日は何をしていますか？",
        farmerResponse: [
          "釣りです。でも出かける前に、田んぼの水を見ます。\n気になる所があると、そのまま長居してしまう。",
          "魚との約束は流れますが、稲との約束は守れます。\n結局どっちにしても、水辺にいますね。",
        ],
        typingDelay: 900,
        nextRecommendedQuestion: "reason",
        offerUnlocked: true,
      },
    ],
    fallback:
      "ここは決まった台本で話す体験版です。下の質問を選んでください。田んぼの話なら、お茶一杯ぶんくらい付き合えますよ。",
    invitation:
      "米を少し、持っていきませんか。おかずはいつものもので。ごはんの減り具合を見てやってください🌾",
  },
};
