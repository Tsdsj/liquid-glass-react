import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from '@liquid-glass-ui/react';
/**
 * Hand-authored rows mirroring the TypeScript interfaces. Deliberately not generated at
 * runtime: reflection would ship the type metadata to every visitor and still could not
 * explain *why* a prop exists, which is the part worth reading.
 */
export function PropsTable({ rows }) {
    if (rows.length === 0)
        return null;
    return _jsx("div", { className: "props-table-wrap", children: _jsxs("table", { className: "props-table", children: [_jsx("caption", { className: "lg-visually-hidden", children: "\u7EC4\u4EF6\u5C5E\u6027" }), _jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { scope: "col", children: "\u5C5E\u6027" }), _jsx("th", { scope: "col", children: "\u7C7B\u578B" }), _jsx("th", { scope: "col", children: "\u9ED8\u8BA4\u503C" }), _jsx("th", { scope: "col", children: "\u8BF4\u660E" })] }) }), _jsx("tbody", { children: rows.map(row => _jsxs("tr", { children: [_jsxs("th", { scope: "row", children: [_jsx("code", { children: row.name }), row.required && _jsx(Text, { as: "span", variant: "caption2", tone: "destructive", className: "props-required", children: "\u5FC5\u586B" })] }), _jsx("td", { children: _jsx("code", { className: "props-type", children: row.type }) }), _jsx("td", { children: row.default ? _jsx("code", { children: row.default }) : _jsx("span", { "aria-hidden": "true", children: "\u2014" }) }), _jsx("td", { children: row.description })] }, row.name)) })] }) });
}
