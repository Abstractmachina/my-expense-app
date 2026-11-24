import fs from 'fs';
import path from 'path';

import { THEME } from '@/lib/theme';

const tailwindColors = require('../../tailwind.config.js').theme.extend.colors as Record<string, string>;

const palette = Object.fromEntries(Object.entries(THEME.dark).filter(([, value]) => value.startsWith('#')));
const lightPalette = Object.fromEntries(Object.entries(THEME.light).filter(([, value]) => value.startsWith('#')));

const css = fs.readFileSync(path.join(__dirname, '../../src/global.css'), 'utf8');

/**
 * Parses the `--name: value;` declarations inside a CSS block body.
 *
 * @param body - The text between the braces of a CSS rule.
 * @returns Map from variable name (without `--`) to its raw value.
 */
function parseDeclarations(body: string): Map<string, string> {
  const vars = new Map<string, string>();
  for (const match of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    vars.set(match[1], match[2].trim());
  }
  return vars;
}

/**
 * Pulls the body of the first rule matching a selector pattern.
 *
 * @param source - The CSS text to search.
 * @param selector - Regex source matching the selector, e.g. `:root`.
 * @returns The declarations found in that rule.
 */
function ruleVars(source: string, selector: string): Map<string, string> {
  const match = source.match(new RegExp(`${selector}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`Rule not found: ${selector}`);
  return parseDeclarations(match[1]);
}

const baseLayer = css.slice(css.indexOf('@layer base'));
const lightVars = ruleVars(baseLayer, ':root');
const darkOwnVars = ruleVars(baseLayer, '\\.dark:root');

// The dark rule only overrides some variables; the rest cascade from :root, so mirror that.
const darkVars = new Map([...lightVars, ...darkOwnVars]);

/**
 * Converts a THEME key to its CSS variable name, e.g. `cardForeground` -> `card-foreground`, `chart1` -> `chart-1`.
 *
 * @param key - A camelCase key from THEME.
 * @returns The kebab-case CSS variable name without the leading `--`.
 */
function toCssName(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/([a-z])(\d)/g, '$1-$2').toLowerCase();
}

/**
 * Strips the `hsl(...)` wrapper so THEME values compare with the bare CSS channel values.
 *
 * @param value - A THEME color string such as `hsl(0 0% 3.9%)`.
 * @returns The inner value, e.g. `0 0% 3.9%`, or the input unchanged if it has no wrapper.
 */
function stripHsl(value: string): string {
  const match = value.match(/^hsl\((.*)\)$/);
  return match ? match[1].trim() : value;
}

/**
 * Converts a hex color to the space-separated RGB channels stored in global.css, e.g. `#00f0ff` -> `0 240 255`.
 *
 * @param hex - A six-digit hex color such as `#00f0ff`.
 * @returns The red, green and blue channels as decimal numbers separated by spaces.
 */
function hexToChannels(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

describe('PALETTE in tailwind.config.js points at its CSS variables', () => {
  it('maps every palette key to rgb(var(--key) / <alpha-value>)', () => {
    const configPalette = Object.fromEntries(
      Object.entries(tailwindColors).filter(([key]) => key in palette),
    );
    expect(configPalette).toEqual(
      Object.fromEntries(Object.keys(palette).map((key) => [key, `rgb(var(--${key}) / <alpha-value>)`])),
    );
    expect(Object.keys(palette)).toHaveLength(16);
  });
});

describe('THEME.light palette has the same keys as THEME.dark', () => {
  it('uses matching hex key names', () => {
    expect(Object.keys(lightPalette).sort()).toEqual(Object.keys(palette).sort());
  });
});

describe('THEME matches the CSS variables in global.css', () => {
  it.each(['light', 'dark'] as const)('%s palette matches its CSS variables', (scheme) => {
    const vars = scheme === 'light' ? lightVars : darkVars;
    const mismatches: string[] = [];

    for (const [key, value] of Object.entries(THEME[scheme])) {
      const cssName = toCssName(key);
      const cssValue = vars.get(cssName);
      if (cssValue === undefined) {
        mismatches.push(`${key}: no --${cssName} in global.css`);
        continue;
      }
      const expected = key === 'radius' ? value : value.startsWith('#') ? hexToChannels(value) : stripHsl(value);
      if (expected !== cssValue) {
        mismatches.push(`${key}: THEME "${value}" vs --${cssName} "${cssValue}"`);
      }
    }

    expect(mismatches).toEqual([]);
  });
});
