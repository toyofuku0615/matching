# 農miai（のうみあい）

「運命よりも、産直。」農家という人を好きになる、約3分間のインタラクティブWebモックです。

人物・農園・会話・栽培内容・価格はすべて架空です。画像もこのモック向けの生成素材です。登録や個人情報入力はなく、外部API・AIチャット・実際の送信・注文・決済・配送には接続しません。

## 起動

Node.js 24.xを使用してください（Node.js 24.19.0で確認）。

```sh
npm install
npm run dev
```

開発用URLは `http://localhost:5173`。既定で `0.0.0.0` にバインドします。同じネットワーク上のスマートフォンからは、起動ログの `Network` に表示されるIPアドレスとポートに接続できます。クラウド環境では、その環境が提供するポート転送機能を使用してください。外部デプロイは行っていません。

```sh
npm run build
npm run preview
```

プレビューの既定URLは `http://localhost:4173`。`dist/` は静的ホスティング可能です。相対パスを使い、GitHub Pagesなどのサブディレクトリ配下にも配置できます。画像・フォント・シナリオはローカルに同梱されるため、サーバー起動後の主要体験はインターネット接続を必要としません。

## 体験の流れ

1. オープニング → 理想のタイプ診断
2. 農家を左右にスワイプ、または「ごめん根」「いい根！」で選択
3. 写真左右のボタンでギャラリーを切り替え、＋ボタンでプロフィール詳細
4. マッチング → 農家ごとのシナリオ型チャット
5. 異なる2種類の質問をすると、おすそ分けが1回だけ解放
6. おすそ分けの詳細 → 体験完了 → 「もう一度、出会う」

自由入力にも固定のデモ返信があります。全員をスキップしても再表示できます。戻るボタン、体験メニューからのリセット、キーボード操作、ダイアログのEscape終了、動きを抑えるOS設定に対応しています。

## 構成と編集

React 19 / TypeScript / Vite / Tailwind CSS 4 / Motion for React / Lucide React。日本語フォントはNoto Sans JPをローカル配信します。

- `src/data/farmers.ts`：農家3人のプロフィールと写真
- `src/data/conversations.ts`：農家別の挨拶、4問の会話台本、共通返信、誘い文
- `src/data/products.ts`：商品写真・架空価格・送料・手紙
- `src/data/copy.ts`：画面コピーと診断の表示順
- `src/useExperience.ts`：7画面の状態遷移、会話履歴、質問とオファーの状態
- `src/components/`：スワイプ、チャット、プロフィール用シートなど
- `public/images/ASSETS.md`：画像とフォントの由来

状態はブラウザのメモリだけに保存し、リロードで最初に戻ります。外部通信・認証・データベースはありません。

## 検証

```sh
npx playwright install chromium
npm test
```

Linuxの `/usr/bin/chromium` があればテストはそれを使用し、それ以外ではPlaywrightのChromiumを使用します。スマートフォン375×812・390×844・430×932、PC1440×900、モーション低減設定を検証します。

ブラウザで確認するには、開発者ツールのデバイスモードでも上記サイズを指定できます。スマートフォン実機のSafari/iOS・Chrome/Androidでの最終確認は別途行ってください。

検証はChromiumで実施しています。実機のiOS Safari・Android Chromeは未検証です。指定されたデザイン参考サイトは環境プロキシの403応答で閲覧できなかったため、添付された詳細なデザイン・操作仕様を基準に実装しています。


## Vercelで公開

このリポジトリは `package.json`、`index.html`、`src/` がリポジトリ直下にあるViteアプリです。クラウドのチェックアウト先は `/workspace/matching` ですが、GitHub内の `matching/` サブディレクトリではありません。

| Vercelの設定 | 値 |
| --- | --- |
| Root Directory | `.`（リポジトリ直下。初期値のまま） |
| Framework Preset | Vite |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js Version | 24.x |
| Production Branch | `main` |
| 環境変数 | 不要 |

`vercel.json` にFramework・インストール・ビルド・出力先を、`package.json` の `engines` にNode.jsのバージョンを保存しています。Vercel管理画面に既存の上書き設定がある場合は、上の値に揃えてください。Root DirectoryはVercelのプロジェクト設定で指定します。

1. GitHubの `toyofuku0615/matching` にコードをpushします。
2. Vercelにログインし、**Add New → Project → Import Git Repository** から `toyofuku0615/matching` を選びます。表示されなければ、VercelのGitHub連携にこのリポジトリのアクセス権を許可してください。
3. 上記の設定を確認し、**Deploy** を実行します。`main` へのpush後は、連携済みプロジェクトで自動デプロイされます。
4. **Deployments** で対象のコミットSHA・ブランチ・ビルドログを確認し、**Ready** になったデプロイの **Visit**、または **Settings → Domains** に表示される実際の公開URLを開きます。
5. 公開URLで「出会いをはじめる」から「ご縁が実りました！」まで操作し、スマートフォンでも画像とボタンが表示されることを確認してください。

公開URLはVercelが発行したものを使用してください。開発用localhost URLやクラウド開発環境の「公開」は、VercelのWebアプリ公開URLとは別のものです。
