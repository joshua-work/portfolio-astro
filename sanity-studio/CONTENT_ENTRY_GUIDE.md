# Sanity Content Entry Guide

這份清單是給目前這個作品集專案用的。目標不是一次把所有資料建完，而是先建立「足夠讓前端開始讀 Sanity」的第一批內容。

## 建議建立順序

1. `Site Settings`
2. `Home Page`
3. `About Page`
4. `Contact Page`
5. `Tags`
6. `Films`

---

## 1. Site Settings

請建立並填寫這些欄位：

- `siteTitle`: `Joshua Yue`
- `siteDescription`: `A cinematic portfolio of documentary, art event, and brand moving-image work rebuilt with Astro and Sanity-ready content models.`
- `primaryNav`
  - `/` / `Work`
  - `/about` / `About`
  - `/contact` / `Contact`
- `footerNote`: `Static-first portfolio prototype with legacy content migrated from the previous WordPress build.`
- `contactEmail`: 先填你要公開的信箱
- `socialLinks`
  - `YouTube`
  - `Instagram`
- `logo`: 可先留空，之後再補

---

## 2. Home Page

請建立並填寫：

- `eyebrow`: `Selected Work`
- `title`: `Moving-image work across cultural commissions, documentary texture, and brand storytelling.`
- `intro`: `This first Astro build brings the legacy portfolio into a cleaner static-first structure while keeping the project archive easy to browse and ready for Sanity-backed editing later.`
- `focusAreas`
  - `Documentary`
  - `Commercial`
  - `Short Form`
  - `Art Event`
- `featuredSlugs`
  - 先填你已經建立好的 film slug
  - 建議先放 3 到 6 筆
- `closingNote`: `For this testing phase, legacy media is kept local inside the repo so the site remains buildable before Sanity asset delivery is finalized.`

---

## 3. About Page

- `eyebrow`: `About`
- `title`: `Joshua Yue builds films that stay attentive to place, texture, and editorial rhythm.`
- `intro`: `The original WordPress portfolio was centered on the work itself. This rebuilt version keeps that focus, but adds structure for biography, contact, and future CMS-managed updates.`
- `bio`
  - `Joshua Yue is a filmmaker working across documentary, cultural commissions, exhibition media, and brand storytelling.`
  - `The current site rebuild prioritizes clarity: each project is presented as a durable film entry with roles, media, and context, instead of living as a one-off WordPress page.`
  - `As the project grows, the same structure can expand into Sanity-managed copy, richer still galleries, and better editorial sequencing without changing the frontend architecture.`
- `highlights`
  - `Static-first Astro routing with deferred islands only where interaction matters`
  - `Sanity-ready content models for site settings, homepage, about, contact, and film entries`
  - `Legacy media preserved locally for testing while keeping a clean path to future CDN-backed delivery`

---

## 4. Contact Page

- `eyebrow`: `Contact`
- `title`: `Available for documentary, cultural, and commissioned moving-image projects.`
- `intro`: `This prototype keeps contact details lightweight and easy to update later from Sanity. For now, it provides a clear path for collaboration inquiries while the new portfolio is being tested.`
- `availability`: `Open to commissions, editorial collaborations, and conversations around documentary, exhibition, and culture-facing film work.`
- `email`: 請填你要公開的聯絡信箱
- `socialLinks`
  - `YouTube`
  - `Instagram`

---

## 5. Tags

第一批建議先建立這些 tag：

- `Documentary`
- `Commercial`
- `Short Form`
- `Art Event`
- `Director`
- `Editor`
- `Cinematographer`
- `Colorist`
- `Motion Graphics`

---

## 6. Films

每一筆 film 至少先填這些欄位：

- `title`
- `slug`
- `year`
- `type`
- `logline`
- `coverImage`
- `tags`
- `runtime`
- `credits`
- `mainVideo.provider`
- `mainVideo.embedUrl`
- `mainVideo.watchUrl`
- `mainVideo.title`
- `body`

`stills`、`mainVideo.poster` 可以之後再補。

---

## 第一批建議先建的 Films

先從英文標題較乾淨、最好辨識的作品開始，這樣最省力。

### Film 1

- `title`: `2023 Real Leather Stay Different Taiwan`
- `slug`: `2023-real-leather-stay-different-taiwan`
- `year`: `2023`
- `type`: `Commercial`
- `logline`: `A brand film entry in the Real Leather series, balancing tactile product imagery with a polished editorial pace.`
- `runtime`: `01:12`
- `tags`
  - `Commercial`
  - `Editor`
  - `Director`
  - `Cinematographer`
  - `Colorist`
- `credits`
  - `Director` / `Joshua Yue`
  - `Editor` / `Joshua Yue`
  - `Cinematographer` / `Joshua Yue`
  - `Colorist` / `Joshua Yue`
- `mainVideo.provider`: `youtube`
- `mainVideo.embedUrl`: `https://www.youtube.com/embed/MsdrR4XmQrU?rel=0`
- `mainVideo.watchUrl`: `https://www.youtube.com/watch?v=MsdrR4XmQrU`
- `mainVideo.title`: `2023 Real Leather Stay Different Taiwan`
- `body`
  - `The Real Leather campaign work combines direction, camera, edit, and finishing into a unified visual voice.`
  - `This project now lives in the same data model as the rest of the portfolio, making future Sanity migration straightforward.`

### Film 2

- `title`: `2022 Real Leather Stay Different Taiwan`
- `slug`: `2022-real-leather-stay-different-taiwan`
- `year`: `2022`
- `type`: `Commercial`
- `logline`: `A 2022 campaign entry shaped around confident product imagery and premium finishing.`
- `runtime`: `01:09`
- `tags`
  - `Commercial`
  - `Editor`
  - `Director`
  - `Cinematographer`
  - `Colorist`
- `credits`
  - `Director` / `Joshua Yue`
  - `Editor` / `Joshua Yue`
  - `Cinematographer` / `Joshua Yue`
  - `Colorist` / `Joshua Yue`
- `mainVideo.provider`: `youtube`
- `mainVideo.embedUrl`: `https://www.youtube.com/embed/bLXK8DyKzP8?rel=0`
- `mainVideo.watchUrl`: `https://www.youtube.com/watch?v=bLXK8DyKzP8`
- `mainVideo.title`: `2022 Real Leather Stay Different Taiwan`
- `body`
  - `This film continues the Real Leather visual line while refining pacing and material emphasis.`
  - `In the new system, yearly campaign iterations can live as independent projects without losing their relationship to the wider series.`

### Film 3

- `title`: `2021 Real Leather Stay Different Taiwan`
- `slug`: `2021-real-leather-stay-different-taiwan`
- `year`: `2021`
- `type`: `Commercial`
- `logline`: `An earlier campaign entry that established the tactile, polished tone of the Real Leather series.`
- `runtime`: `01:06`
- `tags`
  - `Commercial`
  - `Editor`
  - `Director`
  - `Cinematographer`
  - `Colorist`
- `credits`
  - `Director` / `Joshua Yue`
  - `Editor` / `Joshua Yue`
  - `Cinematographer` / `Joshua Yue`
  - `Colorist` / `Joshua Yue`
- `mainVideo.provider`: `youtube`
- `mainVideo.embedUrl`: `https://www.youtube.com/embed/Yuc1RpUiZeo?rel=0`
- `mainVideo.watchUrl`: `https://www.youtube.com/watch?v=Yuc1RpUiZeo`
- `mainVideo.title`: `2021 Real Leather Stay Different Taiwan`
- `body`
  - `As an earlier chapter in the series, this project helps show continuity across multiple years of commissioned work.`
  - `The new content model keeps series-like projects manageable without forcing them into a blog-style chronology.`

### Film 4

- `title`: `2023 Taiwan Crafts & Design Evolving Life`
- `slug`: `2023-taiwan-crafts-design-evolving-life`
- `year`: `2023`
- `type`: `Art Event`
- `logline`: `A visual introduction to a craft and design exhibition, mixing identity-led motion with exhibition imagery.`
- `runtime`: `01:32`
- `tags`
  - `Art Event`
  - `Editor`
  - `Director`
  - `Cinematographer`
  - `Colorist`
  - `Motion Graphics`
- `credits`
  - `Director` / `Joshua Yue`
  - `Editor` / `Joshua Yue`
  - `Cinematographer` / `Joshua Yue`
  - `Colorist` / `Joshua Yue`
  - `Motion Graphics` / `Joshua Yue`
- `mainVideo.provider`: `youtube`
- `mainVideo.embedUrl`: `https://www.youtube.com/embed/qWUqniwHgPc?rel=0`
- `mainVideo.watchUrl`: `https://www.youtube.com/watch?v=qWUqniwHgPc`
- `mainVideo.title`: `2023 Taiwan Crafts & Design Evolving Life`
- `body`
  - `The project brings together direction, editorial timing, and graphic treatment to frame the exhibition experience before the audience arrives on site.`
  - `It is a strong example of how cultural work can live beside brand and documentary projects inside a single portfolio system.`

### Film 5

- `title`: `Inside Out Project`
- `slug`: `inside-out-project`
- `year`: `2023`
- `type`: `Commercial`
- `logline`: `A campaign portrait centered on identity, movement, and a grounded visual tone.`
- `runtime`: `01:23`
- `tags`
  - `Commercial`
  - `Editor`
  - `Director`
  - `Cinematographer`
  - `Colorist`
- `credits`
  - `Director` / `Joshua Yue`
  - `Editor` / `Joshua Yue`
  - `Cinematographer` / `Joshua Yue`
  - `Colorist` / `Joshua Yue`
- `mainVideo.provider`: `youtube`
- `mainVideo.embedUrl`: `https://www.youtube.com/embed/TSGsDzV4sGs?rel=0`
- `mainVideo.watchUrl`: `https://www.youtube.com/watch?v=TSGsDzV4sGs`
- `mainVideo.title`: `Inside Out Project`
- `body`
  - `The piece is framed as a branded moving portrait, shaped through careful camera rhythm and a restrained finishing pass.`
  - `In the new site, it is treated like a first-class film entry rather than a one-off embedded page.`

---

## 重要提醒

- 目前 `fallback.ts` 裡有一部分舊資料出現亂碼，尤其是部分中文標題與 slug。
- 在 Sanity 內建資料時，建議你直接用正確中文或重新整理過的英文 slug，不要照抄亂碼版本。
- 如果你改了 slug，首頁的 `featuredSlugs` 也要一起改成新的值。

---

## 建議的短期目標

先完成下面這個最小可用集合：

- `Site Settings` 1 份
- `Home Page` 1 份
- `About Page` 1 份
- `Contact Page` 1 份
- `Tags` 9 筆
- `Films` 3 到 5 筆

做到這裡，前端就已經很值得開始測試 Sanity 實際出資料的流程了。
