function CuetoJsonParser(cueText: string) {
    const lines = cueText.split("\n");
    const result: { title: string; performer: string }[] = [];

    let currentTitle = "";
    let currentPerformer = "";

    for (let line of lines) {
        line = line.trim();

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

        if (line.startsWith("TRACK")) {
            // TRACK 시작 시 이전 데이터를 저장 (처음엔 무시됨)
            if (currentTitle && currentPerformer) {
                result.push({
                    title: currentTitle,
                    performer: currentPerformer,
                });
            }

            // TRACK 안에서는 TITLE, PERFORMER 초기화
            currentTitle = "";
            currentPerformer = "";
        }
    }

    // 마지막 트랙 추가
    if (currentTitle && currentPerformer) {
        result.push({
            title: currentTitle,
            performer: currentPerformer,
        });
    }

    return result;
}

export default CuetoJsonParser;
