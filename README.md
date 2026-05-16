# ShoppingWeb

電商全端專案：React 前端、Spring Boot 後端、MySQL、Redis。可用 Docker Compose 一次啟動。

## 環境設定

`.env` 不會被 Git 追蹤。首次 clone 或拉程式後請建立本機設定檔：

```bash
cp .env.example .env
```

Windows PowerShell：

```powershell
Copy-Item .env.example .env
```

依 `.env.example` 註解修改密碼與連線（本機 Docker 可先用範例值；Zeabur 等部署請填控制台提供的值）。

> **注意**：若專案曾將 `.env` 提交至遠端，舊 commit 的 Git 歷史仍可能含有當時的內容。請勿再把 `.env` 加入版控；若曾寫入正式環境密碼，請在該環境**輪替憑證**，並視需要以 [git-filter-repo](https://github.com/newren/git-filter-repo) 等工具清理公開歷史後 force-push（需與協作者協調）。

## 以 Docker 啟動

在專案根目錄、且已存在 `.env` 後：

```bash
docker compose up --build
```

預設對外埠（可在 `.env` 調整）：

| 服務   | 變數            | 預設  |
|--------|-----------------|-------|
| 前端   | `FRONTEND_PORT` | 80    |
| 後端   | `BACKEND_PORT`  | 8080  |
| MySQL  | `MYSQL_PORT`    | 3307  |
| Redis  | `REDIS_PORT`    | 6379  |

## 本機開發（選用）

- **前端**：見 [frontend/README.md](frontend/README.md)
- **後端**：IDE / `mvn` 會由 `DotenvLoader` 讀取專案根目錄的 `.env`

## 版控慣例

- 可提交：`.env.example`
- 勿提交：`.env`、`.env.*`（範例檔除外）、`.idea/`
