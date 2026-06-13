export default function textLimiter(raw : string | undefined, limit: number) {
    if(raw === undefined) {
        console.log("Kritische Maschinenschaden");
        return "";
    }
    return raw.slice(0, limit) + "...";
}