# ShoppingWeb

> 全端電商平台 — 從商品瀏覽、購物車到結帳與訂單管理，前後端分離並支援 Docker 一鍵部署。

**GitHub：** [https://github.com/JiaHao0423/ShoppingWeb](https://github.com/JiaHao0423/ShoppingWeb)

**Demo：** （待部署後補上連結）

---

## 專案介紹

ShoppingWeb 是一套完整的電商 Web 應用，前端以 React 建構多頁式購物介面，後端以 Spring Boot 提供 RESTful API，搭配 MySQL 持久化資料、Redis 做速率限制與快取支援。專案支援本機開發與 Docker Compose 全棧啟動，並可部署至 Zeabur 等雲端平台。

品牌名稱為 **Inez**，涵蓋服飾類商品瀏覽、搜尋篩選、規格選購、購物車、結帳流程、會員中心、訂單查詢，以及管理員分類管理等功能。

---

## 技術棧

**前端**
- React 19、TypeScript、Vite
- React Router 7、Axios
- Tailwind CSS 4、Sass/SCSS（BEM 命名）
- Radix UI、Lucide Icons

**後端**
- Java 21、Spring Boot 4
- Spring Security、JWT（Access / Refresh Token）
- Spring Data JPA、MySQL 8
- Spring Data Redis、Spring Mail
- Springdoc OpenAPI（Swagger UI）

**基礎設施**
- Docker、Docker Compose
- Nginx（前端靜態資源與 API 反向代理）

---

## 功能

**使用者端**
- 首頁輪播與商品推薦
- 商品搜尋、分類篩選、商品詳情（含規格選擇）
- 購物車新增、數量調整、刪除
- 結帳流程與訂單完成頁
- 會員註冊、登入、登出
- 忘記密碼 / 重設密碼（Email 寄送）
- 會員中心（個人資料、收件地址管理）
- 訂單歷史查詢

**管理端**
- 商品分類 CRUD（需 ADMIN 角色）

**系統**
- JWT 無狀態認證與 Token 自動刷新
- 密碼重設 API 速率限制（Redis）
- Swagger API 文件
- 健康檢查端點

---

## 技術亮點

- **JWT 雙 Token 機制**：Access Token 15 分鐘、Refresh Token 24 小時，前端 Axios 攔截器自動刷新，並發 401 時共用同一 refresh 請求，避免 Token 旋轉競態
- **Session 同步防白屏**：AuthContext 從 localStorage 還原登入狀態，並監聽 Session 過期事件，壞資料防呆避免 JSON.parse 導致頁面崩潰
- **CORS 彈性設定**：支援 localhost、Zeabur 網域與同 host 全端部署，減少跨域 403 問題
- **Redis 速率限制**：忘記密碼 / 重設密碼 API 以 IP 為 key 限流，Redis 不可用時優雅降級
- **Docker 全棧部署**：單一 Dockerfile 打包 Nginx + Spring Boot，Zeabur 等平台可直接從 GitHub 部署
- **路由懶載入**：React.lazy + Suspense 分割頁面 bundle，提升首屏載入速度

---

## 專案架構

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (React)                     │
│  Pages / Components / Contexts / Services / Axios       │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (/api)
┌────────────────────────▼────────────────────────────────┐
│              Nginx（生產環境反向代理）                      │
│         靜態資源 → dist/    API → Spring Boot :8080       │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   Spring Boot Backend                    │
│  Controller → Service → Repository → JPA Entity          │
│  Security Filter (JWT) / GlobalExceptionHandler          │
└──────────────┬─────────────────────────┬────────────────┘
               │                         │
        ┌──────▼──────┐           ┌──────▼──────┐
        │   MySQL 8   │           │  Redis 7    │
        │  商品/訂單   │           │  速率限制    │
        └─────────────┘           └─────────────┘
```

**前後端分離流程**
1. 前端透過 Axios 呼叫 `/api/*` REST 端點
2. JwtAuthenticationFilter 驗證 Bearer Token
3. Service 層處理業務邏輯，Repository 存取 MySQL
4. 敏感操作（如分類管理）以 `@PreAuthorize("hasAuthority('ADMIN')")` 控管

---

## 安裝方式

### 前置需求

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)（推薦）
- 或本機安裝：Node.js 22+、Java 21、Maven、MySQL 8、Redis 7

### 1. 複製專案

```bash
git clone https://github.com/JiaHao0423/ShoppingWeb.git
cd ShoppingWeb
```

### 2. 建立環境變數

`.env` 不會被 Git 追蹤，首次請從範例複製：

```bash
cp .env.example .env
```

Windows PowerShell：

```powershell
Copy-Item .env.example .env
```

依 `.env.example` 註解修改密碼與連線（本機 Docker 可先用範例值）。

### 3. 以 Docker 啟動（推薦）

在專案根目錄執行：

```bash
docker compose up --build
```

| 服務   | 環境變數         | 預設埠 |
|--------|------------------|--------|
| 前端   | `FRONTEND_PORT`  | 80     |
| 後端   | `BACKEND_PORT`   | 8080   |
| MySQL  | `MYSQL_PORT`     | 3307   |
| Redis  | `REDIS_PORT`     | 6379   |

啟動後：
- 前端：http://localhost
- 後端 API：http://localhost:8080/api
- Swagger：http://localhost:8080/api/swagger-ui.html

### 4. 本機開發（選用）

**前端**

```bash
cd frontend
npm install
npm run dev
```

預設開發伺服器：http://localhost:5173，API 指向 `http://localhost:8080/api`

**後端**

```bash
cd backend
./mvnw spring-boot:run
```

後端會透過 `DotenvLoader` 讀取專案根目錄的 `.env`。

---

## 資料夾結構

```
ShoppingWeb/
├── frontend/                  # React 前端
│   ├── src/
│   │   ├── api/               # Axios 設定與攔截器
│   │   ├── components/        # 可複用元件（layout、ui、home…）
│   │   ├── contexts/          # AuthContext、CartContext
│   │   ├── pages/             # 各頁面（Home、Cart、Checkout…）
│   │   ├── services/          # API 呼叫封裝
│   │   ├── hooks/             # 自訂 Hooks
│   │   ├── utils/             # 工具函式（authSession、notify）
│   │   └── constants/         # 路由、選單、首頁內容
│   ├── Dockerfile
│   └── package.json
│
├── backend/                   # Spring Boot 後端
│   └── src/main/java/com/ben/com/backend/
│       ├── controller/        # REST 控制器
│       ├── service/           # 業務邏輯
│       ├── repository/        # JPA Repository
│       ├── model/             # 實體（User、Product、Order…）
│       ├── dto/               # 請求 / 回應 DTO
│       ├── security/          # JWT、SecurityConfig
│       ├── config/            # 設定（CORS、Auditing、Dotenv）
│       └── exception/         # 全域例外處理
│
├── docker/                    # Nginx 設定、全棧啟動腳本
├── docker-compose.yml         # 本機四服務編排
├── Dockerfile                 # 全端單一映像（Zeabur 部署）
├── Dockerfile.frontend        # 僅前端
├── Dockerfile.backend         # 僅後端
├── .env.example               # 環境變數範例（可提交）
└── README.md
```

---

## 技術挑戰

| 挑戰 | 解法 |
|------|------|
| Token 過期導致操作中斷 | Axios response 攔截器偵測 401 後自動 refresh，失敗才清除 Session 並導向登入 |
| 並發請求同時 refresh | 以 `refreshPromise` 單例化 refresh 流程，避免 refresh token 被重複消耗 |
| 刷新頁面登入狀態遺失 | AuthContext 初始化時從 localStorage 還原，並以 `AuthSessionSync` 監聽跨 tab 過期事件 |
| 跨域 / 部署環境 CORS | SecurityConfig 支援 origin pattern、環境變數與同 host 自動放行 |
| 密碼重設濫用 | Redis 以 IP 為 key 做滑動窗口限流，異常時 fallback 放行並記錄 warn log |
| 全端同容器埠衝突 | Nginx 對外監聽 `$PORT`，Java 使用 `$BACKEND_PORT`，以反向代理串接 |

---

## 未來改善方向

- [ ] 第三方支付整合（Stripe、綠界等）
- [ ] 商品後台管理（上架、庫存、圖片上傳）
- [ ] 訂單狀態流轉（出貨、退貨、取消）
- [ ] 購物車未登入時以 localStorage 暫存，登入後合併
- [ ] 單元測試與 E2E 測試（JUnit、Playwright）
- [ ] CI/CD 自動化部署 pipeline
- [ ] 搜尋效能優化（Elasticsearch 或全文索引）
- [ ] 多語系（i18n）支援

---

## 版控慣例

- 可提交：`.env.example`
- 勿提交：`.env`、`.env.*`（範例檔除外）、`.idea/`

> **注意**：若專案曾將 `.env` 提交至遠端，舊 commit 的 Git 歷史仍可能含有當時的內容。請勿再把 `.env` 加入版控；若曾寫入正式環境密碼，請在該環境**輪替憑證**。

---

## 授權

本專案為個人學習 / 作品集用途。
