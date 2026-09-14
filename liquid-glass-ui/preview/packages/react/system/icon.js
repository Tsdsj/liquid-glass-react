'use client';
import { jsx as _jsx } from "react/jsx-runtime";
const paths = {
    chevronForward: 'M9 5l7 7-7 7',
    chevronDown: 'M5 9l7 7 7-7',
    checkmark: 'M5 12.5l4.5 4.5L19 7',
    close: 'M6 6l12 12M18 6L6 18',
    search: 'M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM15.4 15.4L20 20',
    clear: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM9 9l6 6M15 9l-6 6',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    grabber: 'M5 12h14',
    ellipsis: 'M5 12h.01M12 12h.01M19 12h.01',
};
/** Decorative by default: the accessible name belongs on the control, not the glyph. */
export function LibraryIcon({ name, size = 20, ...props }) {
    return _jsx("svg", { ...props, width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: name === 'ellipsis' ? 3.4 : 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", focusable: "false", children: _jsx("path", { d: paths[name] }) });
}
