export default function textLimiter(raw : string | undefined, limit: number | undefined) {
    if(raw === undefined) {
        return "";
    }
    if(limit === null || limit === undefined) {
        return raw.slice(0, 10) + "...";
    }
    if(raw.length <= limit) {
        return raw;
    }
    return raw.slice(0, limit) + "...";
}