import { exportHighlightedToExcel } from './exportExcel.js';
const translateBtn = document.getElementById('translateBtn');
const inputText = document.getElementById('inputText');
const translatedTextDiv = document.getElementById('translatedText');
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const translatedTextField = document.getElementById('translatedTextField');
const originalTextDiv = document.getElementById('originalText');
const highlightedListOriginal = document.getElementById('highlightedListOriginal');
const highlightedListTranslated = document.getElementById('highlightedListTranslated');

const highlightedOriginal = new Set();
const highlightedTranslated = new Set();


const languages = {
    auto: 'Auto Detect',
    ar: 'Arabic',
    zh: 'Chinese',
    nl: 'Dutch',
    en: 'English',
    fr: 'French',
    de: 'German',
    hi: 'Hindi',
    ga: 'Irish',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    pl: 'Polish',
    pt: 'Portuguese',
    ru: 'Russian',
    es: 'Spanish',
    tr: 'Turkish',
    uk: 'Ukrainian',
    vi: 'Vietnamese'
};

// Fill language dropdowns
Object.entries(languages).forEach(([code, name]) => {
    sourceLang.appendChild(new Option(name, code));
    targetLang.appendChild(new Option(name, code));
});
sourceLang.value = 'auto';
targetLang.value = 'en';

// Translate button handler
function renderText(div, text, highlightedSet, renderListFn) {
    div.innerHTML = '';
    text.split(/\s+/).forEach(word => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.className = 'word-span';
        if (highlightedSet.has(word)) span.classList.add('highlighted');
        span.onclick = () => {
            if (highlightedSet.has(word)) {
                highlightedSet.delete(word);
                span.classList.remove('highlighted');
            } else {
                highlightedSet.add(word);
                span.classList.add('highlighted');
            }
            renderListFn();
        };
        div.appendChild(span);
    });
}

function cleanWord(word) {
    return word.replace(/[.,;:{}\[\]1234567890\/?!@]/g, '');
}

function renderHighlightedListOriginal() {
    if (highlightedOriginal.size) {
        highlightedListOriginal.innerHTML =
            `<strong>Highlighted:</strong><ul>` +
            [...highlightedOriginal].map(word => {
                const cleaned = cleanWord(word);
                return cleaned ? `<li>${cleaned}</li>` : '';
            }).join('') +
            `</ul>`;
    } else {
        highlightedListOriginal.innerHTML = '';
    }
}

function renderHighlightedListTranslated() {
    if (highlightedTranslated.size) {
        highlightedListTranslated.innerHTML =
            `<strong>Highlighted:</strong><ul>` +
            [...highlightedTranslated].map(word => {
                const cleaned = cleanWord(word);
                return cleaned ? `<li>${cleaned}</li>` : '';
            }).join('') +
            `</ul>`;
    } else {
        highlightedListTranslated.innerHTML = '';
    }
}
const exportBtn = document.getElementById('exportExcelBtn');
exportBtn.onclick = () => {
    exportHighlightedToExcel(
        [...highlightedOriginal].map(cleanWord).filter(Boolean),
        [...highlightedTranslated].map(cleanWord).filter(Boolean)
    );
};
translateBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    if (!text) return;
    highlightedOriginal.clear();
    highlightedTranslated.clear();
    renderText(originalTextDiv, text, highlightedOriginal, renderHighlightedListOriginal);

    const source = sourceLang.value;
    const target = targetLang.value;
    const translated = await translateLingva(text, source, target);
    renderText(translatedTextDiv, translated, highlightedTranslated, renderHighlightedListTranslated);

    renderHighlightedListOriginal();
    renderHighlightedListTranslated();
});

async function translateLingva(text, source, target) {
    try {
        const url = `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Lingva API error: ' + res.status);
        const data = await res.json();
        return data.translation;
    } catch (err) {
        translatedTextField.value = 'Translation failed: ' + err.message;
        translatedTextDiv.innerHTML = '';
        return '';
    }
}

function renderTranslatedText(translatedText) {
    translatedTextField.value = translatedText;
    translatedTextDiv.innerHTML = '';

    translatedText.split(/\s+/).forEach(word => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.className = 'cursor-pointer hover:bg-yellow-200 px-1';
        translatedTextDiv.appendChild(span);
    });
}
// Restore saved selections
sourceLang.value = localStorage.getItem('sourceLang') || 'auto';
targetLang.value = localStorage.getItem('targetLang') || 'en';

// Save selection on change
sourceLang.addEventListener('change', () => {
    localStorage.setItem('sourceLang', sourceLang.value);
});
targetLang.addEventListener('change', () => {
    localStorage.setItem('targetLang', targetLang.value);
});

