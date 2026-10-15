import type { Conversation, FarmerId } from "./types";

/** Fixed demo scripts only: no AI, live messages, or real farming claims. */
export const conversations: Record<FarmerId, Conversation> = {
  miho: {
    greeting: [
      "いい根！ありがとうございます！🍓\nみほです。よろしくお願いします！",
      "プロフィール見てくれました？\n『甘やかすのが得意』って書いてますけど、本当です。笑",
    ],
    questions: [
      {
        farmerId: "miho",
        questionId: "reason",
        userMessage: "どうして農家になったんですか？",
        farmerResponse: [
          "もともと東京で会社員をしてたんです。\n\n最初は実家の農園を継ぐつもりは全然なくて。\n\nでも帰省したときに、お客さんが父のいちごを食べて『今年も美味しいね』って言ってるのを見て。\n\nなんだか、こういう仕事っていいなって思ったんです。",
          "まあ、朝が早いのは今でも苦手ですけどね😂",
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
          "もちろんです！笑\n\nでも、うちのいちごの方が甘いかもしれません🍓",
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
          "毎朝、ハウスの中を歩きながら状態を見るのが好きなんです。\n\n同じ畑でも日によって全然違うんですよ。\n\n手がかかるけど、そこが面白いんです。",
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
          "必要なときには使用しています。\n\n使ったものや回数は記録していますので、気になることは何でも聞いてくださいね！",
        ],
        typingDelay: 700,
        nextRecommendedQuestion: "reason",
        offerUnlocked: true,
      },
    ],
    fallback:
      "メッセージありがとうございます🍓 これは台本で会話を楽しむ体験版なので、下の質問から選んでもらえるとうれしいです！",
    invitation: "そうだ、よかったらうちのいちご、食べてみませんか？🍓",
  },
  takumi: {
    greeting: [
      "いい根！ありがとうございます！\n今年はトマトがかなりいい感じなんです🍅",
      "たくみです。トマトの話になると、ちょっと長くなるかもしれません。笑",
    ],
    questions: [
      {
        farmerId: "takumi",
        questionId: "reason",
        userMessage: "どうして農家になったんですか？",
        farmerResponse: [
          "最初は父に言われて手伝っていただけなんです。\n\nでも、自分で育てたトマトを食べた人に『こんな甘いトマト初めて！』って言われて。\n\nその顔が忘れられなくて、気づいたら8年目です。",
        ],
        typingDelay: 800,
        nextRecommendedQuestion: "care",
        offerUnlocked: true,
      },
      {
        farmerId: "takumi",
        questionId: "care",
        userMessage: "トマトのこだわりは？",
        farmerResponse: [
          "僕自身がトマトをそのまま丸かじりするのが好きなので、まず自分が美味しいと思えるものを目指しています。",
          "収穫したてをひと口。それで今日の調子がわかるんです🍅",
        ],
        typingDelay: 700,
        nextRecommendedQuestion: "dog",
        offerUnlocked: true,
      },
      {
        farmerId: "takumi",
        questionId: "dog",
        userMessage: "愛犬はどんな子ですか？",
        farmerResponse: [
          "柴犬で、名前はむぎです。僕より社交的で、散歩すると必ず誰かに話しかけられます。",
          "畑に行く準備をすると玄関で待ってるんですよ。頼れる相棒です。",
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
          "料理が趣味って書いたんですけど、実はまだ練習中で…。",
          "まずは何もつけずに、そのまま食べてほしいです。それだけは自信あります。笑",
        ],
        typingDelay: 750,
        nextRecommendedQuestion: "reason",
        offerUnlocked: true,
      },
    ],
    fallback:
      "ありがとうございます。ここは決まった台本で楽しむ体験版なんです。下の質問を選んでみてください。トマトの話なら、任せてください🍅",
    invitation:
      "話していたら、食べてもらいたくなりました。うちのトマト、少しおすそ分けしてもいいですか？🍅",
  },
  masao: {
    greeting: [
      "いい根、ありがとうね。\nスマホはまだ慣れんけど、よろしくお願いします🌾",
      "まさおです。孫に教わって、なんとかここまで来ました。ゆっくり話しましょう。",
    ],
    questions: [
      {
        farmerId: "masao",
        questionId: "reason",
        userMessage: "どうして農家になったんですか？",
        farmerResponse: [
          "親父の代からずっとこの田んぼを守っとるんです。\n\n毎年同じように作っていても、同じ年は一度もない。\n\nそこが米作りの面白いところだね。",
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
          "新米の時期になると孫が帰ってくるんですよ。\n\n米をいっぱい食べてくれるのが、何より嬉しいですね。",
          "「じいじ、おかわり」ってね。それを聞くと、来年も頑張ろうと思うんです。",
        ],
        typingDelay: 850,
        nextRecommendedQuestion: "care",
        offerUnlocked: true,
      },
      {
        farmerId: "masao",
        questionId: "care",
        userMessage: "美味しいごはんを炊くコツは？",
        farmerResponse: [
          "わしは炊く前に、少しゆっくり水を吸わせるのが好きです。あとは炊飯器に任せとります。",
          "炊きたてに梅干しひとつ。それだけで、ごちそうですよ。",
        ],
        typingDelay: 800,
        nextRecommendedQuestion: "holiday",
        offerUnlocked: true,
      },
      {
        farmerId: "masao",
        questionId: "holiday",
        userMessage: "お休みの日は何をしていますか？",
        farmerResponse: [
          "釣りですねえ。釣れん日も、水辺に座っとるだけで気持ちがいい。",
          "最近は孫から写真が届くのも楽しみでね。返信の「いいね」の場所は、やっと覚えました。",
        ],
        typingDelay: 900,
        nextRecommendedQuestion: "reason",
        offerUnlocked: true,
      },
    ],
    fallback:
      "ありがとうね。これは台本に沿って話す体験版なんだそうです。下の質問を押してみてください。わしのこと、もう少し話しましょう。",
    invitation:
      "よかったら、うちの米も食べてみてください。食卓で思い出してもらえたら、嬉しいですね🌾",
  },
};
