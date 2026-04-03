# Inez - 電商網站前端切版專案

這是一個使用 React 建構的多頁式電商網站前端切版專案。
所有頁面與組件均使用 BEM 命名規範，並使用 SCSS 進行樣式管理。

---

## 技術棧

本專案主要使用以下技術：

- **前端框架：** [React](https://react.dev/) (v19)
- **建構工具：** [Vite](https://vitejs.dev/) (v7)
- **路由管理：** [React Router](https://reactrouter.com/) (v7)
- **樣式方案：** [Sass/SCSS](https://sass-lang.com/)
- **CSS 命名：** BEM (Block Element Modifier)

---

## 專案結構

```
/src
├── assets/             # 靜態資源，如圖片
├── components/         # 可複用的元件
│   ├── layout/         # 全局佈局元件 (Header, Footer)
│   ├── carousel/       # 輪播圖元件
│   └── ...             # 其他通用組件
├── constants/          # 全局數據 (路由定義, 菜單數據)
├── pages/              # 各個頁面
│   ├── Home/
│   ├── Cart/
│   ├── Auth/           # 共用的登入頁面
│   └── ...
├── _variables.scss     # SCSS 全局變數 (顏色, 字體, 間距)
├── _mixins.scss        # SCSS 通用RWD變數
├── global.scss         # 全局基礎樣式
└── App.jsx             # 根組件，定義全局路由
```

---

## 樣式與設計系統

本專案的樣式使用 **SCSS**，並以 **BEM (Block, Element, Modifier)** 作命名規範。

**`_variables.scss`** 定義了整個網站常用的樣式，包括主色調、文字顏色、背景色、字體大小，以及統一的間距系統。

**`_mixins.scss`** 為了響應式設計（RWD）定義了 `mobile`、`tablet`、`desktop` 等 mixin，使RWD樣式管理更加方便。


---

## 路由總覽

| 路由路徑              | 對應組件                                  | 頁面名稱    | 說明                           |
|:------------------|:--------------------------------------|:--------|:-----------------------------|
| `/`               | `<Navigate to="/home" />`             | 根路由重定向  | 自動將根路徑重導向至 `/home`           |
| `/home`           | `<HomePage />`                        | 首頁      | 網站主頁，包含輪播圖與商品推薦              |
| `/search`         | `<SearchPage />`                      | 商品搜尋    | 商品列表與篩選頁面                    |
| `/cart`           | `<CartPage />`                        | 購物車     | 購物車商品管理與結帳入口                 |
| `/checkout`       | `<CheckoutPage />`                    | 結帳      | 填寫收件資訊、選擇付款與運送方式             |
| `/order-complete` | `<OrderCompletePage />`               | 訂單完成    | 付款成功確認頁面                     |
| `/member`         | `<MemberPage />`                      | 會員中心    | 個人資料、訂單狀態與常用工具               |
| `/orders`         | `<OrderListPage />`                   | 訂單一覽    | 完整訂單歷史記錄與狀態篩選                |
| `/register`       | `<AuthPage variant="register" />`     | 註冊      | 建立新帳戶，包含姓名、帳號、密碼欄位           |
| `/login`          | `<AuthPage variant="login" />`        | 登入（第三方） | 含帳號密碼登入及 Google / Apple 快速登入 |
| `/simple-login`   | `<AuthPage variant="simple-login" />` | 登入（簡易）  | 僅帳號密碼的簡易登入頁面                 |

---

