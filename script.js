const translateBtn = document.getElementById('translateBtn');
const inputText = document.getElementById('inputText');
const translatedTextDiv = document.getElementById('translatedText');
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const translatedTextField = document.getElementById('translatedTextField');

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