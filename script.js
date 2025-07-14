const translateBtn = document.getElementById('translateBtn');
const inputText = document.getElementById('inputText');
const translatedTextDiv = document.getElementById('translatedText');
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
// import WordFrequencyData from './eu_50k.json';


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

// const vocabularyLevels = {};
// ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].forEach(level => {
//     vocabularyLevels[level] = Object.entries(WordFrequencyData)
//         .filter(([_, data]) => data.level === level)
//         .map(([word]) => word.toLowerCase());
// });
// fill dropdowns
Object.entries(languages).forEach(([code, name]) => {
    const opt1 = new Option(name, code);
    const opt2 = new Option(name, code);
    sourceLang.appendChild(opt1);
    targetLang.appendChild(opt2);
});

// set defaults
sourceLang.value = 'auto'; // not used here, but can be added
targetLang.value = 'en';

translateBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    const source = sourceLang.value;
    const target = targetLang.value;
    if (!text || !target) return;

    const translated = await translateLingva(text, source, target);
    renderTranslatedText(translated);
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

// In your event handler:
translateBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    const source = sourceLang.value;
    const target = targetLang.value;
    if (!text || !target) return;

    const translated = await translateLingva(text, source, target);
    renderTranslatedText(translated);
});

const translatedTextField = document.getElementById('translatedTextField');

function renderTranslatedText(translatedText) {
    translatedTextField.value = translatedText; // show full translation in textarea
    translatedTextDiv.innerHTML = '';

    const words = translatedText.split(/\s+/);
    words.forEach(word => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.className = 'cursor-pointer hover:bg-yellow-200 px-1';
        translatedTextDiv.appendChild(span);
    });
}
