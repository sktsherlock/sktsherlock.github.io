# Organization marks used in education and research experience

Retrieved and inspected on 2026-09-29. These local assets identify the institutions in Hao Yan's education and past internships. They are original files downloaded from their respective organizations, not generated or redrawn marks.

| Organization | Local asset | Original dimensions | Size | Source page | Exact download URL |
| --- | --- | --- | --- | --- | --- |
| Central South University / 中南大学 | `images/homepage/organizations/csu.png` | 240 × 70 px, RGBA | 13,044 bytes | [Official university homepage](https://www.csu.edu.cn/) | [Official color logo](https://www.csu.edu.cn/images/logo3.png) |
| The Hong Kong Polytechnic University / 香港理工大学 | `images/homepage/organizations/polyu.png` | 668 × 128 px, RGBA | 31,900 bytes | [Official university homepage](https://www.polyu.edu.hk/) | [Official 2× header logo](https://www.polyu.edu.hk/assets/img/main-logo-2x.png) |
| Hefei University of Technology / 合肥工业大学 | `images/homepage/organizations/hfut.png` | 484 × 91 px, RGBA | 42,967 bytes | [Official university homepage](https://www.hfut.edu.cn/) | [Official footer logo](https://www.hfut.edu.cn/images/logo-b.png) |
| Microsoft / 微软 | `images/homepage/organizations/microsoft.svg` | SVG viewBox 0 0 21 21 | 343 bytes | [Microsoft's official branding asset page](https://learn.microsoft.com/en-us/entra/identity-platform/howto-add-branding-in-apps) | [Official four-color symbol](https://learn.microsoft.com/en-us/entra/identity-platform/media/howto-add-branding-in-apps/ms-symbollockup_mssymbol_19.svg) |

The university homepages' actual image elements identify the source paths above. The PolyU homepage includes the downloaded file in its logo's `srcset`. The Microsoft documentation directly links the standalone symbol under “Microsoft logo”; the downloaded asset contains only the four official colored squares, without any sign-in-button treatment.

The existing repository was searched first. `images/logo.png` belongs to the old MICCALL theme, and `images/lovecsu.jpg` is a large photograph; neither was reused as an institutional logo.

## Display notes

- Keep the full university logos visible, with their original proportions. Use `object-fit: contain` and allow horizontal space for their wordmarks.
- A neutral white logo area works in both light and dark themes. The color CSU logo was chosen in preference to the university's white header variant. Do not recolor or invert the marks.
- Microsoft Research Asia and Microsoft STCA may share `microsoft.svg`; the adjacent text should retain their distinct organization names and internship dates.
- No cropping, resampling, color changes, or metadata rewriting was applied to the delivered files. All four are below 100 KB, and HTML should reference these local copies rather than hotlinking the source servers.
- Brand-reference pages: [CSU emblem](https://www.csu.edu.cn/zjzn/xxbs/xh.htm) and [HFUT visual identity system](https://www.hfut.edu.cn/info/1008/9011.htm). These establish the institution's own identity sources; they do not imply that the homepage is institutionally endorsed.

## File verification

All PNG files were decoded and verified; their local images were visually inspected. The Microsoft SVG was parsed and checked: its four rect elements retain Microsoft's red, green, blue, and yellow fills, with no embedded scripts or external resources.

| Asset | SHA-256 |
| --- | --- |
| `csu.png` | `9cd2fc1df82148f4e789a83095677ef9c62f70b91dacaa8d3e81aae780fefebd` |
| `polyu.png` | `77662ff3372446cba4a5ad2c4602918f55fcae671de0b0dbdc3042f1ced9effb` |
| `hfut.png` | `0c14662706352113d11f9ecff2dbefebb818da551efc57e8816bf8e178b3afbc` |
| `microsoft.svg` | `929f48f88c8ca7f3f5d294be47ec4caf51acc28ac25340c19a903125d7ecd84a` |
