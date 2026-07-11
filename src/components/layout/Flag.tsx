/**
 * Flag icon component.
 *
 * Wraps the flag-icons CSS classes (fi fi-XX) so we get proper SVG
 * flags that render on every OS — unlike emoji regional-indicator pairs
 * (e.g. 🇺🇸) which display as the two-letter country code on systems
 * that lack the flag-emoji font (most Windows machines).
 *
 * Usage:
 *   <Flag code="us" />
 *   <Flag code="fr" width={20} height={14} />
 */

export type FlagCode = "us" | "fr" | "de" | "es" | "gb";

interface FlagProps {
  /** ISO 3166-1 alpha-2 lower-case country code. */
  code: FlagCode | string;
  /** Width in px. Defaults to 20. */
  width?: number;
  /** Height in px. Defaults to 14 (4:3 aspect). */
  height?: number;
  /** Optional className passthrough. */
  className?: string;
  /** Accessible label; falls back to the country code. */
  title?: string;
}

export function Flag({ code, width = 20, height = 14, className = "", title }: FlagProps) {
  return (
    <span
      className={`fi fi-${code.toLowerCase()} inline-block rounded-sm overflow-hidden ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      role="img"
      aria-label={title ?? code.toUpperCase()}
    />
  );
}
