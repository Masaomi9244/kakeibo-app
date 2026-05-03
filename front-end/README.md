# Frontend

Next.js App Routerを使うフロントエンドです。

## 開発

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 主なコマンド

```bash
npm run check
npm run build:check
npm run lint
npm run lint:fix
npm run format
npm run format:write
npm run typecheck
npm run test
```

`npm run check`
はフロントエンド変更の完了条件です。typecheck、lint、format、test、production
buildをまとめて実行します。

pre-commit hookでも `npm run lint:staged` と `npm run check`
を実行します。速度よりも崩れにくさを優先するため、コミット前に全体検証を必須にします。

## 参照docs

- `../docs/architecture/front-end.md`
- `../docs/standards/front-end/index.md`
- `../docs/standards/front-end/checklist.md`
