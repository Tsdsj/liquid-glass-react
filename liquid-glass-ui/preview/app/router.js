import { useEffect, useState } from 'react';
export const normalize = (hash) => {
    const raw = hash.replace(/^#\/?/, '').trim();
    return raw === '' ? 'overview' : raw.replace(/\/+$/, '');
};
/** Minimal hash router. A real app would use its own; this keeps the demo dependency-free. */
export function useRoute() {
    const [path, setPath] = useState(() => (typeof location === 'undefined' ? 'overview' : normalize(location.hash)));
    useEffect(() => {
        const update = () => { setPath(normalize(location.hash)); window.scrollTo({ top: 0 }); };
        window.addEventListener('hashchange', update);
        return () => window.removeEventListener('hashchange', update);
    }, []);
    const go = (next) => { location.hash = `#/${next}`; };
    return [path, go];
}
export const sectionOf = (path) => {
    if (path.startsWith('components'))
        return 'components';
    if (path.startsWith('foundations'))
        return 'foundations';
    if (path.startsWith('labs'))
        return 'labs';
    if (path.startsWith('guides'))
        return 'guides';
    return 'overview';
};
