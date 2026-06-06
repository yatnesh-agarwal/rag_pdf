const {PDFParse} = require("pdf-parse")

async function parsePDF(filePath) {
    try{
        const parser = new PDFParse({url: filePath})
        const result = await parser.getText()
        return result.pages.map((page) => ({
            pageNumber: page.num,
            text: page.text,
        }))
    }
    catch(err){
        console.log("Error while parsing PDF",err)
        throw err
    }
}

module.exports = parsePDF
