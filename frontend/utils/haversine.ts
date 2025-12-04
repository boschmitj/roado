export default function haversine(a: [number, number], b: [number, number]) {
    const R = 6371e3; // meters
    const [lon1, lat1] = a.map(x => x * Math.PI/180);
    const [lon2, lat2] = b.map(x => x * Math.PI/180);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const h = Math.sin(dLat/2)**2 +
              Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2)**2;

    return 2 * R * Math.asin(Math.sqrt(h));
}
