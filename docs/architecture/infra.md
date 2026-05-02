# Infrastructure Architecture

## MVP方針

MVPでは最小構成を優先する。

```txt
Frontend:
  Vercel

Backend:
  Render

Auth:
  Supabase Auth

DB:
  Supabase PostgreSQL
```

AWS構成はMVP完成後に検討する。

MVPでは、AWSを前提にしすぎず、まずは低コストかつ設定が少ない構成で動く状態を優先する。

Backendのデプロイ先はMVPではRenderを正とする。

デプロイ実行直前にRenderの最新プラン、料金、制約を確認する。

---

## CORS

フロントエンドからGo APIを呼び出すため、CORSを設定する。

開発環境ではローカルフロントエンドのURLを許可する。

本番環境ではデプロイ済みフロントエンドURLのみ許可する。

ワイルドカード `*` は使わない。
