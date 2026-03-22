import React from "react";
import type { WebSocialIconsProps } from "./SocialIcons.js";

const LABELS: Record<string, string> = {
  instagram: "IG",
  youtube: "YT",
  facebook: "FB",
  website: "\uD83C\uDF10",
  tiktok: "TT",
  twitter_x: "X",
  linkedin: "in",
  threads: "@",
};

export function SocialIcons({ links, memberName, style, ...rest }: WebSocialIconsProps) {
  if (links.length === 0) return null;

  return (
    <ul
      style={{ display: "flex", gap: "var(--spacing-2)", listStyle: "none", padding: 0, margin: 0, ...style }}
      aria-label="Social links"
      {...rest}
    >
      {links.map((link) => (
        <li key={link.platform}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${memberName ?? "member"} on ${link.platform}`}
            style={{
              fontSize: "var(--font-size-xs)",
              color: "var(--color-surface-muted-foreground)",
              padding: "var(--spacing-0) var(--spacing-1)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-surface-border)",
              textDecoration: "none",
            }}
          >
            {LABELS[link.platform] ?? link.platform}
          </a>
        </li>
      ))}
    </ul>
  );
}
