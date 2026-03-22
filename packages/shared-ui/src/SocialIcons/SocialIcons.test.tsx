import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SocialIcons } from "./index.web.js";

describe("SocialIcons", () => {
  it("renders all 8 platform labels", () => {
    const links = [
      { platform: "instagram" as const, url: "https://instagram.com/a" },
      { platform: "youtube" as const, url: "https://youtube.com/a" },
      { platform: "facebook" as const, url: "https://facebook.com/a" },
      { platform: "website" as const, url: "https://example.com" },
      { platform: "tiktok" as const, url: "https://tiktok.com/@a" },
      { platform: "twitter_x" as const, url: "https://x.com/a" },
      { platform: "linkedin" as const, url: "https://linkedin.com/in/a" },
      { platform: "threads" as const, url: "https://threads.net/@a" },
    ];
    const html = renderToStaticMarkup(<SocialIcons links={links} />);
    expect(html).toContain("IG");
    expect(html).toContain("YT");
    expect(html).toContain("FB");
    expect(html).toContain("TT");
    expect(html).toContain(">X<");
    expect(html).toContain(">in<");
    expect(html).toContain(">@<");
  });

  it("renders nothing when links empty", () => {
    const html = renderToStaticMarkup(<SocialIcons links={[]} />);
    expect(html).toBe("");
  });

  it("renders aria-label with member name", () => {
    const links = [{ platform: "instagram" as const, url: "https://instagram.com/a" }];
    const html = renderToStaticMarkup(<SocialIcons links={links} memberName="Maya" />);
    expect(html).toContain("Maya on instagram");
  });

  it("uses noopener noreferrer on links", () => {
    const links = [{ platform: "youtube" as const, url: "https://youtube.com/a" }];
    const html = renderToStaticMarkup(<SocialIcons links={links} />);
    expect(html).toContain("noopener noreferrer");
  });
});
