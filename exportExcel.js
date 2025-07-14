import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs";

export function exportHighlightedToExcel(originalWords = [], translatedWords = []) {
    const maxLen = Math.max(originalWords.length, translatedWords.length);
    const wsData = [
        ['Original Highlighted', 'Translated Highlighted'],
        ...Array.from({ length: maxLen }, (_, i) => [
            originalWords[i] || '',
            translatedWords[i] || ''
        ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Highlights');
    XLSX.writeFile(wb, 'highlighted_words.xlsx');
}
