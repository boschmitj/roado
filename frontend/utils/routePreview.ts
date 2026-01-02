export function normalizePath(
    coords: { lat: number, lng: number}[],
    size = 120
) {
    const lats = coords.map((c) => c.lat);
    const lngs = coords.map((c) => c.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;

    return coords.map((c) => {
        const x = ((c.lng - minLng) / lngRange) *  size;
        const y = ((maxLat - c.lat) / latRange) * size;

        return { x, y };
    });

}

export function buildSvgPath(points: { x: number; y: number }[]) {
  return points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");
}

export function generateRoutePreviewSvg(
    coords: { lat: number, lng: number }[],
    size = 120
) : string | null {
    if (!coords || coords.length < 2) return null;

    const normalized = normalizePath(coords, size);
    const path = buildSvgPath(normalized);

    return `
        <svg
        width="${size}"
        height="${size}"
        viewBox="0 0 ${size} ${size}"
        xmlns="http://www.w3.org/2000/svg"
        >
        <path
            d="${path}"
            stroke="#0070f3"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
        />
        </svg>
    `;
}