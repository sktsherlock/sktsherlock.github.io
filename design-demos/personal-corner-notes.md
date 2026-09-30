# Personal corner and style lab

Implemented from the user's September 30, 2026 instructions. The academic graph toy is deferred. Interests are user-provided facts: video creation/editing; Hyouka, Arcane, Sword Art Online, My Teen Romantic Comedy SNAFU; Sherlock; Jay Chou and Hebe Tien; League of Legends and Arknights. No favorite song, album, character, or personal interpretation has been inferred.

## Interaction

- The illustrated portrait opens a native modal dialog; its regular `#life` link remains useful without JavaScript.
- Personal interests are grouped into animation, TV series, music, and games. All interests also appear in the static bilingual section.
- The dialog includes a Style lab tab. A small footer control also opens that tab directly.
- Choosing a style applies it to the full homepage and closes the dialog. A temporary Undo control restores the previous style.
- `homepage-style` persists independently of the existing light/dark and language preferences. Invalid stored values fall back to the original journal. Storage failures keep the current interaction usable.
- Native Escape, a completed backdrop click, and a close button dismiss the dialog. Focus returns to the originating control. The avatar's brief hover response respects reduced motion.

## Style references and adaptations

The user explicitly requested inspiration from [awesome-design-md](https://github.com/voltagent/awesome-design-md), a third-party collection of public design analyses. These are independent academic adaptations, not brand-affiliated templates. Brand marks are used only to identify the styles in the picker, sourced from [Simple Icons](https://simpleicons.org/).

| Style | Sources and recognizable decisions | Academic adaptation |
| --- | --- | --- |
| Research journal | Existing approved homepage | Original default retained |
| Apple | [DESIGN.md](https://github.com/voltagent/awesome-design-md/blob/main/design-md/apple/DESIGN.md), [catalog](https://getdesign.md/apple/design-md): `#0066cc`, `#1d1d1f`, `#f5f5f7`, generous white space, system sans, soft image surfaces | Moderate name size, relaxed paper spacing, softened image panels. Apple system fonts are used only where installed, with existing CJK fallbacks. |
| Claude | [DESIGN.md](https://github.com/voltagent/awesome-design-md/blob/main/design-md/claude/DESIGN.md), [catalog](https://getdesign.md/claude/design-md): `#faf9f5`, `#cc785c`, `#141413`, literary serif headings | Existing local Newsreader substitutes for proprietary display faces. `#a9583e` is the analysis's active accent and provides more readable light-background links. |
| Linear | [DESIGN.md](https://github.com/voltagent/awesome-design-md/blob/main/design-md/linear.app/DESIGN.md), [catalog](https://getdesign.md/linear.app/design-md): `#010102`, `#0f1011`, `#5e6ad2`, precise typography, charcoal panels and hairlines | Papers and research questions become structural panels. Light mode derives from the documented inverse palette; readable violet links are adapted per mode. |
| Spotify | [DESIGN.md](https://github.com/voltagent/awesome-design-md/blob/main/design-md/spotify/DESIGN.md), [catalog](https://getdesign.md/spotify/design-md): `#121212`, `#1f1f1f`, `#1ed760`, bold sans and image-led surfaces | Research becomes an image-led gallery without modifying paper order or figure content. Dark mode uses signature green; light links use a deeper green for reading. |

Full proprietary font files are not bundled. All styles support both light and dark, retain the complete academic record and public telephone number, and keep figures uncropped.

## New interest assets

These are official promotional images credited and linked from the interest entries. Original website assets remain in use for existing interests. Music visuals identify artists; the To Hebe cover is an illustration of Hebe Tien, not a claim that it is the user's favorite album. No audio or lyrics are included.

| Asset | Source page | Original image |
| --- | --- | --- |
| Sword Art Online | [Aniplex](https://www.aniplex.co.jp/lineup/swordartonline/) | https://www.aniplex.co.jp/SYS/CONTENTS/keyvisual_swordartonline/w700 |
| Oregairu | [TBS](https://www.tbs.co.jp/anime/oregairu/) | https://www.tbs.co.jp/anime/oregairu/img/ogp.png |
| Sherlock | [PBS Masterpiece](https://www.pbs.org/wgbh/masterpiece/shows/sherlock/) | https://www.pbs.org/wgbh/masterpiece/media/original_images/sherlock-pbs-passport-1920x1080-1.jpg |
| Jay Chou | [JVR Music](https://www.jvrmusic.com/artist/profile/1150822038412333056) | https://www.jvrmusic.com/upload/1153987416420388864/pic1.jpg |
| Hebe Tien | [HIM International Music](https://www.him.com.tw/CN/albumcon.php?cid=30) | https://www.him.com.tw/uploads/cd/68169_09291fb1a02ac4bacc9e612b2b94a5376.jpg |

## Validation

Browser checks cover all five styles in both modes and languages, desktop and narrow mobile layouts, full interest navigation, keyboard dismissal and focus restoration, theme/language persistence, Undo, blocked storage, invalid preferences, static no-JavaScript fallback, image loading, paper counts, and retained telephone links. Screenshots are inspected before publication.
