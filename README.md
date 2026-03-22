# 寬覺堂 (KJT-Website) - 現代化佛學電子書門戶

![寛覺堂](https://img.shields.io/badge/佛法-如燈-orange)
![React](https://img.shields.io/badge/前端-React%2019-blue)
![Vite](https://img.shields.io/badge/建置-Vite%208-purple)
![Tailwind CSS](https://img.shields.io/badge/樣式-Tailwind%204-teal)

「佛法如燈，照破千年暗。」

**[寬覺堂](https://kjt-website.vercel.app/)** 是一個致力於將經典佛學文獻以現代、美觀且易於閱讀的方式呈現的手機端友善 Web 應用。我們希望透過現代網頁技術，讓古老的經典散發出新的光芒，助益更多修學佛法的人士。

---

## 🙏 特別致謝與資料來源

本專案的所有文字資料、經論原文、法師開示錄等寶貴法寶，均源自 **[報佛恩網 (BFNN)](https://book.bfnn.org/)**。

我們在此致以最誠摯的謝意。報佛恩網長期以來致力於佛法資源的免費流通與無私彙整，是當代極其重要的數位藏經閣。本專案旨在將這些珍貴資料，以符合現代網路使用習慣（如響應式設計、即時搜尋、語音朗讀、簡繁轉換）的形式重新呈現，幫助法寶流通更加廣泛。

---

## ✨ 專案特點

與傳統佛學文庫相比，本專案具備以下現代化特點：

1.  **現代美學設計 (Modern Aesthetics)**
    採用玻璃擬態 (Glassmorphism) 與優雅的卡片式佈局，並搭配暖色調調色盤，為讀者營造安靜、清淨的閱讀氛圍。
2.  **一鍵簡繁切換 (OpenCC-JS)**
    整合了 **OpenCC-JS**，實現全站內容即時轉換。系統會記憶使用者的設定（透過 LocalStorage），無論是繁體讀者還是簡體讀者，都能獲得最佳體驗。
3.  **語音朗讀支援 (TTS Integration)**
    針對視力不便或習慣聽經的使用者，我們內建了語音朗讀功能，並可自由選擇不同語音引擎，實現文字與音聲的無縫銜接。
4.  **智慧檢索與過濾**
    支援即時關鍵字搜尋（標題、作者、分類、摘要）與分頁瀏覽功能，從龐大的經論庫中精確定位目標內容只需一秒。
5.  **極致的閱讀體驗**
    提供 Markdown 渲染、多種閱讀主題（暖金、紙本、夜讀）、字級與行距調整，並支援全螢幕閱讀模式。
6.  **全平台響應式佈局**
    針對手機、平板與桌機進行了完美適配，隨時隨地，法水長流。

---

## 🛠 技術棧

-   **核心框架**: React 19 + TypeScript
-   **建置工具**: Vite 8
-   **樣式系統**: Tailwind CSS 4
-   **內容渲染**: React Markdown (客製化組件)
-   **字體轉換**: OpenCC-JS
-   **語音技術**: Web Speech API

---

## 🚀 快速開始

### 環境需求
-   Node.js (建議 v18 以上)
-   npm 或 yarn

### 安裝與啟動
```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

### 構建生產版本
```bash
# 編譯並打包
npm run build
```

---

## 📂 資料夾結構

-   `src/`: 原始程式碼
    -   `components/`: UI 元件 (如 Header, ArticleModal, LanguageToggle 等)
    -   `contexts/`: 全局狀態管理 (如 LanguageContext)
    -   `types/`: TypeScript 型別定義
-   `public/`: 靜態資源與 Markdown 庫
    -   `bfnn_md/`, `bfnn_md2/`, `bfnn_md3/`: 來自報佛恩網的 Markdown 資料

---

## 📜 版權聲明

本專案代碼僅供學習與佛法流通使用。所有文章內容之著作權歸屬原作者或原始數位化單位所有。我們秉承佛法「廣種福田、無私流通」之精神，嚴禁將本專案用於任何商業營利目的。

願一切眾生離苦得樂，共證菩提。 南無阿彌陀佛 🙏
