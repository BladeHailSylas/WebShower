export default function textLimiter(raw : string | undefined, limit: number | undefined) {
    if(raw === undefined) {
        console.log("Kritische Maschinenschaden");
        return "";
    }
    if(limit === null || limit === undefined) {
        return raw.slice(0, 10) + "...";
    }
    return raw.slice(0, limit) + "...";
}