function chunkText(pages, chunkSize = 1000, overlap = 200){
    const chunks = []

    for (const page of pages){
        const pageText = page.text || ""
        let start = 0

        while (start < pageText.length){
            const end = start + chunkSize
            const chunk = pageText.slice(start, end).trim()

            if (chunk) {
                chunks.push({
                    text: chunk,
                    startPage: page.pageNumber,
                    endPage: page.pageNumber,
                })
            }

            start += chunkSize - overlap
        }
    }

    return chunks
}

module.exports = chunkText
