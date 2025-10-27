#!/usr/bin/env python3
import re
import sys
from math import pow

CSS_PATH = 'style.css'

def hex_to_rgb(hexstr):
    hexstr = hexstr.lstrip('#')
    return tuple(int(hexstr[i:i+2], 16) for i in (0, 2, 4))

def rgb_str_to_tuple(s):
    parts = s.split(',')
    return tuple(int(p.strip()) for p in parts)

def srgb_chan_to_linear(c):
    c = c / 255.0
    if c <= 0.03928:
        return c / 12.92
    return pow((c + 0.055) / 1.055, 2.4)

def relative_luminance(rgb):
    r, g, b = rgb
    R = srgb_chan_to_linear(r)
    G = srgb_chan_to_linear(g)
    B = srgb_chan_to_linear(b)
    return 0.2126 * R + 0.7152 * G + 0.0722 * B

def contrast_ratio(rgb1, rgb2):
    L1 = relative_luminance(rgb1)
    L2 = relative_luminance(rgb2)
    lighter = max(L1, L2)
    darker = min(L1, L2)
    return (lighter + 0.05) / (darker + 0.05)


def find_variable(css_text, varname):
    # look for --varname: value;
    m = re.search(rf"{re.escape(varname)}\s*:\s*([^;]+);", css_text)
    return m.group(1).strip() if m else None


def parse_css_vars(path):
    with open(path, 'r', encoding='utf-8') as f:
        css = f.read()
    vars = {}
    # Variables we care about
    keys = [
        '--theme-primary', '--theme-primary-rgb',
        '--theme-primary-hover', '--theme-primary-active',
        '--theme-secondary', '--theme-secondary-rgb',
        '--theme-primary-cb', '--theme-primary-cb-rgb',
        '--theme-secondary-cb', '--theme-secondary-cb-rgb'
    ]
    for k in keys:
        v = find_variable(css, k)
        if v:
            vars[k] = v
    return vars


def parse_color_value(val):
    # val can be '#rrggbb' or 'r, g, b' or 'rgba(...)' or 'rgb(...)'
    val = val.strip()
    if val.startswith('#'):
        return hex_to_rgb(val)
    if val.startswith('rgba(') or val.startswith('rgb('):
        inner = val[val.find('(')+1:val.rfind(')')]
        parts = inner.split(',')[:3]
        return tuple(int(p.strip()) for p in parts)
    # comma separated rgb like "52, 168, 83"
    if re.match(r"^\d{1,3}\s*,", val):
        return rgb_str_to_tuple(val)
    return None


def report():
    vars = parse_css_vars(CSS_PATH)
    if not vars:
        print('No theme variables found in', CSS_PATH)
        sys.exit(1)

    # Map and parse
    parsed = {}
    for k, v in vars.items():
        rgb = parse_color_value(v)
        if rgb:
            parsed[k] = rgb
        else:
            # try to find hex in value
            m = re.search(r"#([0-9a-fA-F]{6})", v)
            if m:
                parsed[k] = hex_to_rgb(m.group(0))

    # defaults for white/black
    white = (255, 255, 255)
    black = (0, 0, 0)

    checks = []
    # Primary background (solid) with white text
    if '--theme-primary' in parsed:
        checks.append(('Primary (bg) vs White (text)', parsed['--theme-primary'], white))
        if '--theme-primary-hover' in parsed:
            checks.append(('Primary-hover (bg) vs White (text)', parsed['--theme-primary-hover'], white))
        if '--theme-primary-active' in parsed:
            checks.append(('Primary-active (bg) vs White (text)', parsed['--theme-primary-active'], white))
        # Also primary text on white bg
        checks.append(('Primary (text) vs White (bg)', parsed['--theme-primary'], white))
        checks.append(('Primary (text) vs Black (bg)', parsed['--theme-primary'], black))

    # Secondary (solid) with white text
    if '--theme-secondary' in parsed:
        checks.append(('Secondary (bg) vs White (text)', parsed['--theme-secondary'], white))
        if '--theme-secondary-cb' in parsed:
            pass
        checks.append(('Secondary (text) vs White (bg)', parsed['--theme-secondary'], white))

    # Color-blind palette
    if '--theme-primary-cb' in parsed:
        checks.append(('CB Primary (bg) vs White (text)', parsed['--theme-primary-cb'], white))
        checks.append(('CB Primary (text) vs White (bg)', parsed['--theme-primary-cb'], white))
    if '--theme-secondary-cb' in parsed:
        checks.append(('CB Secondary (bg) vs White (text)', parsed['--theme-secondary-cb'], white))
        checks.append(('CB Secondary (text) vs White (bg)', parsed['--theme-secondary-cb'], white))

    print('\nWCAG Contrast Report (targets: AA normal >= 4.5, Large >= 3.0)')
    print('---------------------------------------------------------------')
    results = []
    for desc, a, b in checks:
        ratio = contrast_ratio(a, b)
        pass_aa = ratio >= 4.5
        pass_large = ratio >= 3.0
        results.append((desc, a, b, ratio, pass_aa, pass_large))
        print(f"{desc}: {a} vs {b} -> {ratio:.2f}x | AA: {'PASS' if pass_aa else 'FAIL'} | Large: {'PASS' if pass_large else 'FAIL'}")

    # Summarize failures
    fails = [r for r in results if not r[4]]
    print('\nSummary:')
    if not fails:
        print('All checked pairs pass AA (4.5:1).')
    else:
        print(f"{len(fails)} pair(s) failed AA (4.5:1). See details above.")
        for desc, a, b, ratio, pass_aa, pass_large in fails:
            print(f" - {desc}: {ratio:.2f}x (needs >= 4.5)")

if __name__ == '__main__':
    report()
