function CuetoJsonParser(cueText: string) {
    const lines = cueText.split("\n");
    const result: { title: string; performer: string; time: number }[] = [];

    let currentTitle = "";
    let currentPerformer = "";
    let currentTime: number | null = null;

    for (let line of lines) {
        line = line.trim();

        if (line.startsWith("TRACK")) {
            if (currentTitle && currentPerformer && currentTime !== null) {
                result.push({
                    title: currentTitle,
                    performer: currentPerformer,
                    time: currentTime,
                });
            }

            currentTitle = "";
            currentPerformer = "";
            currentTime = null;
        }

        if (
            line.startsWith("TITLE") &&
            !line.startsWith("FILE") &&
            !line.startsWith("REM")
        ) {
            currentTitle = line.replace(/^TITLE\s+/, "").replace(/^"|"$/g, "");
        }

        if (line.startsWith("PERFORMER") && !line.startsWith("REM")) {
            currentPerformer = line
                .replace(/^PERFORMER\s+/, "")
                .replace(/^"|"$/g, "");
        }

if (line.startsWith("INDEX 01")) {
    const timeStr = line.replace(/^INDEX 01\s+/, "").trim(); // HH:MM:SS
    const [hh, mm, ss] = timeStr.split(":").map(Number);

    const seconds = hh * 3600 + mm * 60 + ss;
    currentTime = seconds;
}
    }

    // 마지막 트랙 추가
    if (currentTitle && currentPerformer && currentTime !== null) {
        result.push({
            title: currentTitle,
            performer: currentPerformer,
            time: currentTime,
        });
    }

    return result;
}

export default CuetoJsonParser;
