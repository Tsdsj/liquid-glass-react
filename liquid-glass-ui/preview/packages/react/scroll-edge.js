'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useGlassPolicy } from './provider.js';
import { cx } from './utils.js';
export function ScrollEdge({ targetRef, edge = 'top', variant = 'fade', className }) {
    const [active, setActive] = useState(false);
    const policy = useGlassPolicy();
    useEffect(() => {
        const target = targetRef.current;
        if (!target)
            return;
        let frame = 0;
        const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => setActive(edge === 'top' ? target.scrollTop > 1 : target.scrollTop + target.clientHeight < target.scrollHeight - 1)); };
        const observer = new ResizeObserver(update);
        observer.observe(target);
        if (target.firstElementChild)
            observer.observe(target.firstElementChild);
        const mutation = new MutationObserver(update);
        mutation.observe(target, { childList: true, subtree: true, characterData: true });
        target.addEventListener('scroll', update, { passive: true });
        update();
        return () => { observer.disconnect(); mutation.disconnect(); target.removeEventListener('scroll', update); cancelAnimationFrame(frame); };
    }, [targetRef, edge]);
    return _jsx("div", { "aria-hidden": "true", className: cx('lg-scroll-edge', className), "data-lg-theme": policy.resolvedTheme, "data-edge": edge, "data-variant": variant, "data-active": active ? 'true' : 'false' });
}
