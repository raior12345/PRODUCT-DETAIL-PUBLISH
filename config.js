/* =========================================================================
   AMAZONA Global Asset Hub - central configuration
   -------------------------------------------------------------------------
   Everything editable lives here. index.html / app.js never need touching
   when a link, a product name or a text string changes.

   HOW TO EDIT
   1) All-products download links .......... bundles.{all|ko|en|ja}
   2) Per-product Google Drive folder .... assets.{lang}.{productId}.driveFolder
   3) Per-page PNG (preview + download) .. assets.{lang}.{productId}.files[].id
        The "id" is the part after /file/d/ in a Drive share link:
        https://drive.google.com/file/d/<THIS_PART>/view?usp=sharing
        Files must be shared as "Anyone with the link - Viewer".
   4) Product names / colors / images .... products[]  (image = package shot in assets/products/)
   5) UI copy per language ............... i18n.{ko|en|ja}

   Empty link? Use the placeholder below and the card shows "Coming soon".
     https://drive.google.com/your-drive-link-here
   ========================================================================= */

window.AMAZONA_CONFIG = {
  brand: {
    name: "AMAZONA",
    hubTitle: "GLOBAL ASSET & DETAIL PAGE HUB",
    logo: "./assets/logo.png",
    // Public URL of this site. Used for the QR code when the page is opened
    // locally (file:// or localhost) and the real address is unknown.
    siteUrl: "https://raior12345.github.io/PRODUCT-DETAIL-PUBLISH/",
    contactEmail: "", // optional, shown in the footer when filled
  },

  // Image delivery. {id} is replaced by the Drive file id, {w} by width.
  // primary is a fast Google CDN; fallback is used automatically on error.
  image: {
    primary: "https://lh3.googleusercontent.com/d/{id}=w{w}",
    fallback: "https://drive.google.com/thumbnail?id={id}&sz=w{w}",
    download: "https://drive.google.com/uc?export=download&id={id}",
    view: "https://drive.google.com/file/d/{id}/view",
    pageWidth: 860, // e-commerce standard width (Naver Smart Store)
  },

  placeholder: "https://drive.google.com/your-drive-link-here",

  languages: [
    { code: "ko", label: "한국어", sub: "Korean", short: "KO" },
    { code: "en", label: "English", sub: "Global", short: "EN" },
    { code: "ja", label: "日本語", sub: "Japanese", short: "JA" },
  ],

  // Display order = order of this array. Set enabled:false to hide a product.
  // "only" limits a product to specific languages.
  products: [
    {
      id: "violet",
      image: "./assets/products/violet.webp",
      color: "#6B4A8C", ground: "#EFEBF2", panel: "#DDD4E6",
      name: { ko: "올포원 바이올렛", en: "All For One Violet", ja: "オールフォーワン バイオレット" },
      enabled: true,
    },
    {
      id: "brown",
      image: "./assets/products/brown.webp",
      color: "#7A4A33", ground: "#F1ECE4", panel: "#E3D9CB",
      name: { ko: "올포원 브라운", en: "All For One Brown", ja: "オールフォーワン ブラウン" },
      enabled: true,
    },
    {
      id: "green",
      image: "./assets/products/green.webp",
      color: "#4C6B33", ground: "#ECF0E6", panel: "#D8E0CC",
      name: { ko: "그린일레븐", en: "Green Eleven", ja: "グリーンイレブン" },
      enabled: true,
    },
    {
      id: "berry",
      image: "./assets/products/berry.webp",
      color: "#8C3350", ground: "#F3EAEC", panel: "#E6D2D8",
      name: { ko: "베리베리텐", en: "Veryberry Ten", ja: "ベリーベリーテン" },
      enabled: true,
    },
    {
      id: "tropical",
      image: "./assets/products/tropical.webp",
      color: "#8F5210", ground: "#F5EEDD", panel: "#EBDDBD",
      name: { ko: "트로피칼나인", en: "Tropical Nine", ja: "トロピカルナイン" },
      enabled: true,
    },
    {
      // Korean-only 3-pack page. Switch enabled to true to list it.
      id: "set",
      color: "#2B4A2E", ground: "#ECF0E6", panel: "#D8E0CC",
      name: { ko: "동결건조 3종 모음", en: "Freeze-Dried Trio", ja: "フリーズドライ 3種セット" },
      enabled: false,
      only: ["ko"],
    },
  ],

  // Section names shown in the viewer index (keys = section in file data).
  sections: {
    Hero:         { ko: "히어로", en: "Hero", ja: "ヒーロー" },
    Solution:     { ko: "솔루션", en: "Solution", ja: "ソリューション" },
    Ingredients:  { ko: "원재료", en: "Ingredients", ja: "原材料" },
    Safety:       { ko: "안전성", en: "Safety", ja: "安全性" },
    FreezeDrying: { ko: "동결건조 공정", en: "Freeze-Drying", ja: "フリーズドライ工程" },
    Feed:         { ko: "급여 방법", en: "How to Feed", ja: "与え方" },
    Review:       { ko: "후기", en: "Reviews", ja: "レビュー" },
    ProductInfo:  { ko: "제품 정보", en: "Product Info", ja: "製品情報" },
  },

  // All-products download links
  bundles: {
    all: "https://drive.google.com/drive/folders/1x-XpkMZMwzmOrG7M7SLnXbMeEFC0DJmg?usp=sharing",
    ko:  "https://drive.google.com/drive/folders/1jiS2zgXswk36uVjTsnEZrl4tI4bHL68J?usp=sharing",
    en:  "https://drive.google.com/drive/folders/1_Exs3mxmUYxzndoeIswWowvFbGWfny_N?usp=sharing",
    ja:  "https://drive.google.com/drive/folders/1qgoDcbn76qnSbtbD7zECu3puSx2XHkf2?usp=sharing",
  },

  fileFormat: { label: "PNG", spec: "860px" },

  i18n: {
    ko: {
      htmlLang: "ko",
      landingTitle: "상세페이지 에셋을\n한 곳에서 검토하세요.",
      landingSub: "아마조나 프리미엄 동결건조 앵무새 간식 5종의 상세페이지를 언어별로 미리 보고 원본을 받을 수 있습니다.",
      chooseLanguage: "언어 선택",
      hubTitle: "무엇을 하시겠어요?",
      hubSub: "제품 5종의 한국어 상세페이지입니다.",
      previewTitle: "상세페이지 미리보기",
      previewDesc: "PC 860px 화면과 실제 스마트폰 화면으로 검토합니다.",
      downloadTitle: "고해상도 에셋 다운로드",
      downloadDesc: "제품별 원본 PNG 또는 전체 패키지를 구글 드라이브에서 받습니다.",
      open: "열기",
      products: "제품",
      previewGridTitle: "검토할 제품을 선택하세요.",
      downloadGridTitle: "필요한 에셋을 받으세요.",
      pcView: "PC View (860px)",
      mobileView: "Mobile View",
      sectionsLabel: "섹션",
      pages: "{n}장",
      files: "파일 {n}개",
      sizeMB: "{n} MB",
      openDrive: "구글 드라이브에서 받기",
      downloadFolder: "폴더 열기",
      downloadFile: "이 섹션 PNG 받기",
      bundleTitle: "전제품 상세페이지 다운로드",
      bundleDesc: "한국어 상세페이지 5종 전체를 한 번에 받습니다.",
      bundleAll: "3개 언어 전체 (KO · EN · JA)",
      scanTitle: "휴대폰으로 바로 확인",
      scanDesc: "카메라로 QR 코드를 스캔하면 이 상세페이지가 휴대폰에서 열립니다.",
      copyLink: "링크 복사",
      copied: "복사됨",
      loadError: "이미지를 불러오지 못했습니다.",
      retry: "다시 시도",
      comingSoon: "링크 준비 중",
      back: "뒤로",
      home: "처음으로",
      notFound: "페이지를 찾을 수 없습니다.",
      storeTabs: "상세정보|리뷰|Q&A|반품/교환정보",
      storeExpand: "상세정보 펼쳐보기",
      storeCollapse: "상세정보 접기",
      storeNote: "네이버 스마트스토어 화면 기준 미리보기입니다.",
      footer: "모든 상세페이지 이미지는 아마조나의 자산입니다. 판매 목적 외 사용은 사전 협의가 필요합니다.",
    },
    en: {
      htmlLang: "en",
      landingTitle: "Every detail page,\nreviewed in one place.",
      landingSub: "Preview and download the product detail pages for five Amazona freeze-dried parrot treats, in your language.",
      chooseLanguage: "Choose a language",
      hubTitle: "What would you like to do?",
      hubSub: "English detail pages for all five products.",
      previewTitle: "Preview Detail Pages",
      previewDesc: "Review each page at 860px desktop width or inside a real phone frame.",
      downloadTitle: "Download Assets",
      downloadDesc: "Get full-resolution PNGs per product, or the complete package, from Google Drive.",
      open: "Open",
      products: "Products",
      previewGridTitle: "Select a product to review.",
      downloadGridTitle: "Download the assets you need.",
      pcView: "PC View (860px)",
      mobileView: "Mobile View",
      sectionsLabel: "Sections",
      pages: "{n} pages",
      files: "{n} files",
      sizeMB: "{n} MB",
      openDrive: "Open in Google Drive",
      downloadFolder: "Open folder",
      downloadFile: "Download this PNG",
      bundleTitle: "Download All Detail Pages",
      bundleDesc: "All five English detail pages in a single folder.",
      bundleAll: "All three languages (KO · EN · JA)",
      scanTitle: "Check it on your phone",
      scanDesc: "Scan the QR code with your camera to open this detail page on your phone.",
      copyLink: "Copy link",
      copied: "Copied",
      loadError: "This image could not be loaded.",
      retry: "Retry",
      comingSoon: "Link coming soon",
      back: "Back",
      home: "Home",
      notFound: "Page not found.",
      storeTabs: "Details|Reviews|Q&A|Returns",
      storeExpand: "Show full details",
      storeCollapse: "Collapse details",
      storeNote: "Preview based on the Naver Smart Store product page layout.",
      footer: "All detail page images are property of Amazona. Please contact us before using them outside of product listings.",
    },
    ja: {
      htmlLang: "ja",
      landingTitle: "商品詳細ページを、\nひとつの場所で。",
      landingSub: "アマゾナのフリーズドライ鳥用おやつ5種の商品詳細ページを、言語別にプレビュー・ダウンロードできます。",
      chooseLanguage: "言語を選択",
      hubTitle: "ご希望の操作を選んでください。",
      hubSub: "全5製品の日本語版商品詳細ページです。",
      previewTitle: "詳細ページをプレビュー",
      previewDesc: "PC 860px表示と、実際のスマートフォン画面で確認できます。",
      downloadTitle: "高解像度データをダウンロード",
      downloadDesc: "製品別のPNG原本、または全データ一式をGoogleドライブから取得できます。",
      open: "開く",
      products: "製品",
      previewGridTitle: "確認する製品を選択してください。",
      downloadGridTitle: "必要なデータをダウンロードしてください。",
      pcView: "PC View (860px)",
      mobileView: "Mobile View",
      sectionsLabel: "セクション",
      pages: "{n}枚",
      files: "{n}ファイル",
      sizeMB: "{n} MB",
      openDrive: "Googleドライブで開く",
      downloadFolder: "フォルダを開く",
      downloadFile: "このPNGをダウンロード",
      bundleTitle: "全製品の詳細ページをダウンロード",
      bundleDesc: "日本語版の商品詳細ページ5種をまとめて取得できます。",
      bundleAll: "全3言語 (KO · EN · JA)",
      scanTitle: "スマートフォンで確認",
      scanDesc: "カメラでQRコードを読み取ると、この詳細ページがスマートフォンで開きます。",
      copyLink: "リンクをコピー",
      copied: "コピーしました",
      loadError: "画像を読み込めませんでした。",
      retry: "再試行",
      comingSoon: "リンク準備中",
      back: "戻る",
      home: "ホーム",
      notFound: "ページが見つかりません。",
      storeTabs: "商品詳細|レビュー|Q&A|返品・交換",
      storeExpand: "商品詳細をもっと見る",
      storeCollapse: "商品詳細を閉じる",
      storeNote: "NAVERスマートストアの商品ページ表示を基準にしたプレビューです。",
      footer: "すべての商品詳細ページ画像はアマゾナに帰属します。販売目的以外でご利用の際は事前にご相談ください。",
    },
  },

  /* -----------------------------------------------------------------------
     Per-language, per-product assets (generated from the Drive link sheet)
     ----------------------------------------------------------------------- */
  assets: {
    ko: {
      violet: {
        driveFolder: "https://drive.google.com/drive/folders/1eg5-E0lLihVlpmDEwE7GlAFwJQkUVnGE?usp=sharing",
        sizeMB: 7.8,
        files: [
          { section: "Hero", name: "올포원바이올렛_01_Hero.png", id: "1gKHpQzXURmA8NRe42CcyQQECYQuFa5wd", kb: 643 },
          { section: "Solution", name: "올포원바이올렛_02_Solution.png", id: "1EwQzoxgiC0VtUPPsqLpNXxGLX8H5MUQi", kb: 2754 },
          { section: "Ingredients", name: "올포원바이올렛_03_Ingredients.png", id: "1dMNaKrs9p5LUWA7gJXcDH9YJdBdYKUuU", kb: 1184 },
          { section: "Safety", name: "올포원바이올렛_04_Safety.png", id: "1zVThra85kU5m57tIIUbcNcZj6ZwwlBxb", kb: 1607 },
          { section: "Feed", name: "올포원바이올렛_05_Feed.png", id: "1N0sLs_jJsYstfwbV7RwaxAdyu2RBVQHA", kb: 697 },
          { section: "Review", name: "올포원바이올렛_06_Review.png", id: "18R6c-hQVsFm5tuvo-2ufewqPADg5dLbo", kb: 1128 },
        ],
      },
      brown: {
        driveFolder: "https://drive.google.com/drive/folders/19PXCiH3KZ33qI8Hqnp7tdwZrHUDu6q9E?usp=sharing",
        sizeMB: 7.9,
        files: [
          { section: "Hero", name: "올포원브라운_01_Hero.png", id: "1ZhcMrDsrEwHU04X5SY2IeTJOIZGrDrAX", kb: 686 },
          { section: "Solution", name: "올포원브라운_02_Solution.png", id: "1YH7RuL3rSXMapNnKaPufH03Cjt1Vcnqd", kb: 2840 },
          { section: "Ingredients", name: "올포원브라운_03_Ingredients.png", id: "1mxEwv3oIk9MWabS5Tp7-A9y-fEL8zYxH", kb: 1210 },
          { section: "Safety", name: "올포원브라운_04_Safety.png", id: "1AtZQ8gF8CpjKF-jPl4hr3kB_gksORB4V", kb: 1547 },
          { section: "Feed", name: "올포원브라운_05_Feed.png", id: "1t7cL9UgdsbRxZx6ILbTOSDrL-bgtSB3H", kb: 669 },
          { section: "Review", name: "올포원브라운_06_Review.png", id: "11U0hTcBX67zEJuSmaPHEoMMrXTIbBQfQ", kb: 1153 },
        ],
      },
      green: {
        driveFolder: "https://drive.google.com/drive/folders/1ujC6Fn80npkuH0QdeclE5MDAJXbUpJ52?usp=sharing",
        sizeMB: 8.6,
        files: [
          { section: "Hero", name: "그린일레븐_01_Hero.png", id: "1SFV-hEw7qCmLpWX2e_vRPrWNQiyY_3ph", kb: 637 },
          { section: "Solution", name: "그린일레븐_02_Solution.png", id: "1nl0kBzvtP3UXawCfjVM2c7srNK5C6AKk", kb: 3190 },
          { section: "Ingredients", name: "그린일레븐_03_Ingredients.png", id: "15nbEZD3jyA5NqDI9SCVclh9XFicX4yRG", kb: 1127 },
          { section: "Safety", name: "그린일레븐_04_Safety.png", id: "1N0F2buB9EUvOtPvACGUaQ28WX1c_LUQS", kb: 1448 },
          { section: "Feed", name: "그린일레븐_05_Feed.png", id: "1HxwXWkx7O8VOAMnH_hGFj6rKbzjJxqsg", kb: 1304 },
          { section: "Review", name: "그린일레븐_06_Review.png", id: "1joLtlpaoILIsEXktwZW0LTMrcNsPshdj", kb: 1136 },
        ],
      },
      berry: {
        driveFolder: "https://drive.google.com/drive/folders/15WDQ_wQg8UB1WCaWZ5u1sQe_SVfAYpgg?usp=sharing",
        sizeMB: 8.6,
        files: [
          { section: "Hero", name: "베리베리텐_01_Hero.png", id: "1LF3XY09-rCa6CQaVE-sdraT_YXKhyO_6", kb: 641 },
          { section: "Solution", name: "베리베리텐_02_Solution.png", id: "14k1a3XKi2SHiv6UW1iHvGlAWuB-Pa3R1", kb: 3168 },
          { section: "Ingredients", name: "베리베리텐_03_Ingredients.png", id: "1TRmOrwjZtyOcdjxUj2eKXXcMDDZH1J52", kb: 1092 },
          { section: "Safety", name: "베리베리텐_04_Safety.png", id: "1TKsJ34LCx1gtcedyOD7lBmX-TpJ6euGj", kb: 1469 },
          { section: "Feed", name: "베리베리텐_05_Feed.png", id: "1e7VpgsPR_8xqU3cIT7VNdTmXccLZE9Sh", kb: 1320 },
          { section: "Review", name: "베리베리텐_06_Review.png", id: "1V-QsbGjFJgTxW_wNOXwQjueTxt5FRa0k", kb: 1137 },
        ],
      },
      tropical: {
        driveFolder: "https://drive.google.com/drive/folders/1stVh3_C7iOb6UGXoAsmELtlcMP4N4KBN?usp=sharing",
        sizeMB: 8.3,
        files: [
          { section: "Hero", name: "트로피칼나인_01_Hero.png", id: "1YZtA3bt4Zor1Yb9e9UrzOzxh-Sha0c0F", kb: 697 },
          { section: "Solution", name: "트로피칼나인_02_Solution.png", id: "1nfCubRpQfEvkjzuL6PhFtk1MHfWufkqd", kb: 3054 },
          { section: "Ingredients", name: "트로피칼나인_03_Ingredients.png", id: "1hmVQgH6zwlYSNBQsCCvYVrjRkJDp1opl", kb: 1078 },
          { section: "Safety", name: "트로피칼나인_04_Safety.png", id: "1rICaIKOvQA4R3ItF7_QeWHwEzWq0KE38", kb: 1421 },
          { section: "Feed", name: "트로피칼나인_05_Feed.png", id: "1H3xAgnjitRcctXzUD-h5fyuvXxveJUMM", kb: 1081 },
          { section: "Review", name: "트로피칼나인_06_Review.png", id: "12reVSELSHHqNS4QPAjaYfFF1vSeEXgK4", kb: 1134 },
        ],
      },
      set: {
        driveFolder: "https://drive.google.com/drive/folders/1oGZh0VuI7tToiAR5REfRfFOoSYOPeyOc?usp=sharing",
        sizeMB: 10.7,
        files: [
          { section: "Hero", name: "3종모음_01_Hero.png", id: "1ucwHfp_1R8-dLMeWdOEuEvBXLuEZZRUy", kb: 478 },
          { section: "Solution", name: "3종모음_02_Solution.png", id: "1IMLP8K5hLYOW6funh04MEeV_WCs4XhiI", kb: 2546 },
          { section: "Ingredients", name: "3종모음_03A_Ingredients_그린일레븐.png", id: "11RfNkK1ePuL3c6rtiglv_gONfvx4Vpw-", kb: 1151 },
          { section: "Ingredients", name: "3종모음_03B_Ingredients_트로피칼나인.png", id: "1sBY2KEEjA4eafdYJHudxOjSD2o20PczW", kb: 1111 },
          { section: "Ingredients", name: "3종모음_03C_Ingredients_베리베리텐.png", id: "11_koygbNMOXfV6h8jfFlCUZ4C1rIfYVr", kb: 1125 },
          { section: "Safety", name: "3종모음_04A_Safety.png", id: "1Pa7fqUF61xhhX-qZZ87TmqPo0ih3CKP2", kb: 848 },
          { section: "FreezeDrying", name: "3종모음_04B_FreezeDrying.png", id: "109xz0cvvo7gRgp7pLZygim1wTBJXjUum", kb: 662 },
          { section: "Feed", name: "3종모음_05_Feed.png", id: "1_0Pe4DUg5wv9nW7Nv2KsUk7ave9k11Zc", kb: 1604 },
          { section: "Review", name: "3종모음_06_Review.png", id: "1Zo8E96Kd4PZC4EnwZl2k6XivwbBcz9cg", kb: 200 },
          { section: "ProductInfo", name: "3종모음_07_ProductInfo.png", id: "1GEqvYOdK-fqsLcBqvKdSw6yLWPGn3u9k", kb: 1260 },
        ],
      },
    },
    en: {
      violet: {
        driveFolder: "https://drive.google.com/drive/folders/1RtYDuwKSPKNgQt5C8TkLqgZT2Xa6THb-?usp=sharing",
        sizeMB: 8.1,
        files: [
          { section: "Hero", name: "AllForOneViolet_01_Hero.png", id: "1Py3733hvXEel05lP9dRR-VUa4SSMB0NL", kb: 671 },
          { section: "Solution", name: "AllForOneViolet_02_Solution.png", id: "18BSBHze4jE4xXPgqj35w3pJuqcnjyeI4", kb: 2789 },
          { section: "Ingredients", name: "AllForOneViolet_03_Ingredients.png", id: "1ufD65d6rOeRPjkocvmZRokYrnwJHUrap", kb: 1223 },
          { section: "Safety", name: "AllForOneViolet_04_Safety.png", id: "1SQFXlJRbZ1Mcg4NQhhrCVRi0mOMuneRe", kb: 1695 },
          { section: "Feed", name: "AllForOneViolet_05_Feed.png", id: "1dCT__2HEkx5f6QTobnnF-niIYW3A1P0h", kb: 725 },
          { section: "Review", name: "AllForOneViolet_06_Review.png", id: "1EhEFzSHJ5Zn8_QXTx4ikK82jK96sce1X", kb: 1188 },
        ],
      },
      brown: {
        driveFolder: "https://drive.google.com/drive/folders/1SPjlpYtao2Th6Ohlh-vZ__xuzWBr8cgv?usp=sharing",
        sizeMB: 8.2,
        files: [
          { section: "Hero", name: "AllForOneBrown_01_Hero.png", id: "1nxU6sHV3-o7ChQ9yDsws3MNmqXhGAVKM", kb: 713 },
          { section: "Solution", name: "AllForOneBrown_02_Solution.png", id: "1BnraBHomWgDTWh0Ajte6Au0R17kVDjg9", kb: 2873 },
          { section: "Ingredients", name: "AllForOneBrown_03_Ingredients.png", id: "19C2hAwLJCUwYX2Si-x22iPTtxxkSwCiN", kb: 1249 },
          { section: "Safety", name: "AllForOneBrown_04_Safety.png", id: "1_uXBasmoaxoAomPImDryyKiYzPFtMiLz", kb: 1639 },
          { section: "Feed", name: "AllForOneBrown_05_Feed.png", id: "1Le1cURJs71FUOQJjnyAYOubyLHIaZ2z3", kb: 699 },
          { section: "Review", name: "AllForOneBrown_06_Review.png", id: "1YU_dvtlMgNWks8cxhq4BDOsUKEc652tL", kb: 1199 },
        ],
      },
      green: {
        driveFolder: "https://drive.google.com/drive/folders/1fNppsSLhQ_a2ZvXW5wf18oI5l4f6b74w?usp=sharing",
        sizeMB: 8.9,
        files: [
          { section: "Hero", name: "GreenEleven_01_Hero.png", id: "1CrvNf4ECIE4RhFrp_0qFH1h0SpbP7Toq", kb: 665 },
          { section: "Solution", name: "GreenEleven_02_Solution.png", id: "1faQaSBECFTorhBMik6LlPSt6xpJlbr5A", kb: 3243 },
          { section: "Ingredients", name: "GreenEleven_03_Ingredients.png", id: "1JlgivnBE6IXIRM3axf1PXQaxpE7Q9XOi", kb: 1172 },
          { section: "Safety", name: "GreenEleven_04_Safety.png", id: "1sXLM2Nm2Q4yrU6eSWaxIuzGa-SnXqFdE", kb: 1541 },
          { section: "Feed", name: "GreenEleven_05_Feed.png", id: "1xEIvFBJm0PYZAscqm67vKoUxeAKyzyL_", kb: 1352 },
          { section: "Review", name: "GreenEleven_06_Review.png", id: "1-tRS9eyvNEcf8CN6eSerYpfeuGEIP8Tv", kb: 1176 },
        ],
      },
      berry: {
        driveFolder: "https://drive.google.com/drive/folders/1KEwgaB4Z4_CBdKF1U1crFLFysyLMlCZo?usp=sharing",
        sizeMB: 8.9,
        files: [
          { section: "Hero", name: "VeryberryTen_01_Hero.png", id: "1VPGwT5-ngtlduExyOpmGiMEn34OJAFO6", kb: 669 },
          { section: "Solution", name: "VeryberryTen_02_Solution.png", id: "1D8bFP-2mQKGo_VZ3byTuL6H3jvLJ0ulp", kb: 3222 },
          { section: "Ingredients", name: "VeryberryTen_03_Ingredients.png", id: "1pSi7W4K_0I0tnQ9H0tvUpc0iCw2qG77y", kb: 1135 },
          { section: "Safety", name: "VeryberryTen_04_Safety.png", id: "1KqJdmutYueO2dOQBZSJk4zWIi9Rc-FVb", kb: 1563 },
          { section: "Feed", name: "VeryberryTen_05_Feed.png", id: "127hOzXX5CCzNFvqmmlRM4ZH4tG0n2_h0", kb: 1370 },
          { section: "Review", name: "VeryberryTen_06_Review.png", id: "1AJk7Y7RtQsft3gZcYdBWnYJ57Ms8wgKw", kb: 1175 },
        ],
      },
      tropical: {
        driveFolder: "https://drive.google.com/drive/folders/1Vw10xoA7t-n9euE1Xa4BSakRnU6T7KD5?usp=sharing",
        sizeMB: 8.5,
        files: [
          { section: "Hero", name: "TropicalNine_01_Hero.png", id: "1kYZw2v-I0_vGzBhQ9jiVw24pUO63zVxe", kb: 722 },
          { section: "Solution", name: "TropicalNine_02_Solution.png", id: "1byKfrK2kgA4JdbHFNrk6IGjIVa9epDGb", kb: 3109 },
          { section: "Ingredients", name: "TropicalNine_03_Ingredients.png", id: "1j77KybUX3QIsWAql-cEprm2MVLA2QOI8", kb: 1112 },
          { section: "Safety", name: "TropicalNine_04_Safety.png", id: "1SzWAGF4usMCz66IAAGRz-txtLdU90e2c", kb: 1508 },
          { section: "Feed", name: "TropicalNine_05_Feed.png", id: "1Z5L7CvRkQChv-XoW44pKvSTTYneMliI9", kb: 1127 },
          { section: "Review", name: "TropicalNine_06_Review.png", id: "1RcH3m00AVH1QcugUMge8-tnqYHYrTggT", kb: 1172 },
        ],
      },
    },
    ja: {
      violet: {
        driveFolder: "https://drive.google.com/drive/folders/1XaozzsBFzDn40yeDd7xGVNAtuNYd_qW4?usp=sharing",
        sizeMB: 8.4,
        files: [
          { section: "Hero", name: "AllForOneViolet_01_Hero.png", id: "1PEnYp5Sbls4hn4f1FDlu9lrNRQb7DIf8", kb: 686 },
          { section: "Solution", name: "AllForOneViolet_02_Solution.png", id: "1_e3CXrXmRrf5D-N359WZQYdB5uD9Vlz5", kb: 2850 },
          { section: "Ingredients", name: "AllForOneViolet_03_Ingredients.png", id: "1eAR92-YkndkIq9TOp1EcyryaQz535WMt", kb: 1270 },
          { section: "Safety", name: "AllForOneViolet_04_Safety.png", id: "1TEyyG_ngkPfvc38UPVR2rPPQxFLS8K2t", kb: 1830 },
          { section: "Feed", name: "AllForOneViolet_05_Feed.png", id: "1-QMo7vwiOUVH3EoRuLaqbk9a0i1V8-Y8", kb: 756 },
          { section: "Review", name: "AllForOneViolet_06_Review.png", id: "171rMe_1WKcEF4h_2aMfEfuwQWDVBgcmC", kb: 1242 },
        ],
      },
      brown: {
        driveFolder: "https://drive.google.com/drive/folders/1yteFxAZyKhh1nQVqnA-OErrwEku41bGG?usp=sharing",
        sizeMB: 8.5,
        files: [
          { section: "Hero", name: "AllForOneBrown_01_Hero.png", id: "15feIcSvpV4lXKEPh5o8p5aKMI8jMV3Xp", kb: 730 },
          { section: "Solution", name: "AllForOneBrown_02_Solution.png", id: "1hzrODdmLEEI68FxvMknWptn26XOz7EHE", kb: 2934 },
          { section: "Ingredients", name: "AllForOneBrown_03_Ingredients.png", id: "1einNb-G1ji69zBU8juvMh7ITR_QPT7na", kb: 1297 },
          { section: "Safety", name: "AllForOneBrown_04_Safety.png", id: "1If146vo8vZLCCSq_kjZ2LUxcchxOq-qJ", kb: 1773 },
          { section: "Feed", name: "AllForOneBrown_05_Feed.png", id: "1ajgwQCeC9QOHBJ112sXwy5_OhhZQXQrd", kb: 730 },
          { section: "Review", name: "AllForOneBrown_06_Review.png", id: "1mq5FGBW0MT9g9UHULlZFxc2-zx1kaM4Q", kb: 1263 },
        ],
      },
      green: {
        driveFolder: "https://drive.google.com/drive/folders/10F6QLez14v5fmwPSdePKNy-Z0tm2EFO4?usp=sharing",
        sizeMB: 9.3,
        files: [
          { section: "Hero", name: "GreenEleven_01_Hero.png", id: "1UECH08ovfuQYO8N2abINioleJ9b5lj4f", kb: 681 },
          { section: "Solution", name: "GreenEleven_02_Solution.png", id: "1rskJM1krRjt9YxfVIMpGoav96pbmLbmh", kb: 3282 },
          { section: "Ingredients", name: "GreenEleven_03_Ingredients.png", id: "19FCIQrrmuroajfEUwF0cnn8sHIx2Kjmm", kb: 1208 },
          { section: "Safety", name: "GreenEleven_04_Safety.png", id: "1GbJJF8pcepAvut989UyIuwuD5bCTGbqQ", kb: 1676 },
          { section: "Feed", name: "GreenEleven_05_Feed.png", id: "1iQWklqSR3C_MBvhxmBAlidO1HuLtrSv3", kb: 1443 },
          { section: "Review", name: "GreenEleven_06_Review.png", id: "1L4nsfbU_Y7FTdX7JJKW757Zri4R6PAO1", kb: 1237 },
        ],
      },
      berry: {
        driveFolder: "https://drive.google.com/drive/folders/18myOqGrKti_ZpfmJqomp5KQysiuJo5fO?usp=sharing",
        sizeMB: 9.3,
        files: [
          { section: "Hero", name: "VeryberryTen_01_Hero.png", id: "1oNRynWgdonT8KOwkz6a4ficadHQjMYW8", kb: 688 },
          { section: "Solution", name: "VeryberryTen_02_Solution.png", id: "1F-TvyF-wtJfHeQhDW0E6PXDAGkgiWByd", kb: 3267 },
          { section: "Ingredients", name: "VeryberryTen_03_Ingredients.png", id: "1kajdSSv0eq1tza7FyZiDFcxJNcUX7XTU", kb: 1174 },
          { section: "Safety", name: "VeryberryTen_04_Safety.png", id: "1prnH1V-DKJXhOSRUs3VhhAIFnru6T1xq", kb: 1700 },
          { section: "Feed", name: "VeryberryTen_05_Feed.png", id: "1w0X9pP1RUjXs2p59gsJxdRyh4m5PQgBJ", kb: 1466 },
          { section: "Review", name: "VeryberryTen_06_Review.png", id: "1PW-errgPfY2YgQC8UFscUW9wRxo7Kk35", kb: 1238 },
        ],
      },
      tropical: {
        driveFolder: "https://drive.google.com/drive/folders/1BJZ9OqEfBOi1s5b4TWximVqEK9pdB4Ah?usp=sharing",
        sizeMB: 8.9,
        files: [
          { section: "Hero", name: "TropicalNine_01_Hero.png", id: "10dE__HtX3AA6Prsvx-oO3lURtCRQ76ke", kb: 744 },
          { section: "Solution", name: "TropicalNine_02_Solution.png", id: "1ObLOeo6l8a2rlO4X-ku-N8kc8n1CiKAn", kb: 3149 },
          { section: "Ingredients", name: "TropicalNine_03_Ingredients.png", id: "1ASqhwp3D8IxXV794MrOpernt5ZSWiGx1", kb: 1156 },
          { section: "Safety", name: "TropicalNine_04_Safety.png", id: "1-RQUBE_plavJI27N25EHmYif9cY0NKeb", kb: 1645 },
          { section: "Feed", name: "TropicalNine_05_Feed.png", id: "1KegpBBxecxR2THSyUl6gq7nN30KE5Sh2", kb: 1211 },
          { section: "Review", name: "TropicalNine_06_Review.png", id: "1S1x8MVeSY3sJnDQRGubuXOE-H6At0HSI", kb: 1231 },
        ],
      },
    },
  },
};
