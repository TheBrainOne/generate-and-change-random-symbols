/** @const {Element} Хранит элемент для длинны генерируемой строки. */
const input = document.querySelector('.input_numbersLength');

/** @const {Element} Хранит элемент для первого заменяемого символа. */
const inputFirstSymbol = document.querySelector('.input_firstSymbol');

/** @const {Element} Хранит элемент для второго заменяемого символа. */
const inputSecondSymbol = document.querySelector('.input_secondSymbol');

/** @const {Element} Хранит элемент кнопки для очистки результата. */
const resetButton = document.querySelector('.reset__button');
/** @const {Element} Хранит элемент для вывода рандомных символов. */
const outputRandomSymbols = document.querySelector('.output__random__symbols');

/** @const {Element} Хранит элемент для вывода измененных символов. */
const outputChangedSymbols = document.querySelector('.output__changed__symbols');

/** @const {Element} Хранит элемент для вывода статистики. */
const statistic = document.querySelector('.statistic');

/** @const {Element} Хранит элемент для изменения отображения. */
const formDisplay = document.querySelector('.form_display');

/** @const {HTMLFormElement} Хранит элемент формы для обработчика событий. */
const outputNumbersForm = document.forms.inputNumbers;

/** @const {HTMLFormElement} Хранит элемент формы для обработчика событий. */
const outputSymbolsForm = document.forms.inputSymbols;

/** @type {String} Хранит мутированные символы. */
let outputSymbols = '';

/** @type {Number} Хранит значение статистики для замененных символов. */
let statisticSymbols = 0;

/** @type {Number} Хранит значение статистики для замененных чисел. */
let statisticNumbers = 0;

/**
 * Генерирует случайную строку из символов.
 * @param {Number} number Сколько символов используется для генерации строки из символов.
 * @returns {String}
 */
const generateString = number =>  {
    const symbols = '0123456789abcdefghijklmnopqrstuvwxyz';
    let symbolsString = '';
    for (let i = 0; i < number; i++) {
        const index = Math.floor(Math.random() * symbols.length);

        symbolsString += symbols[index];
    }

    return symbolsString;
}

/**
 * Создает элемент в DOM дереве для выведения сгенерированных строк символов.
 * @param {String} value Записываемое в элемент значение.
 * @param {String} element Тип создаваемого элемента.
 */
const createElementForSymbols = (value, element) => {
    if (element === 'inputNumbers') {
        if (outputRandomSymbols.hasChildNodes()) {
            outputRandomSymbols.removeChild(outputRandomSymbols.children[0]);
        }

        const outputSymbols = document.createElement('p');
        outputSymbols.textContent = value;

        outputRandomSymbols.appendChild(outputSymbols);
    }
    if (element === 'inputSymbols') {
        if (outputChangedSymbols.hasChildNodes()) {
            outputChangedSymbols.removeChild(outputChangedSymbols.children[0]);
        }

        const outputSymbols = document.createElement('p');
        outputSymbols.textContent = value;

        outputChangedSymbols.appendChild(outputSymbols);
    }
}

/**
 * Создает элемент в DOM дереве для выведения статистики.
 */
const createElementForStatistics = () => {
    if (statistic.hasChildNodes()) {
        statistic.removeChild(statistic.children[0]);
    }

    const outputStatistic = document.createElement('div');

    const outputSymbolStatistic = document.createElement('p');
    outputSymbolStatistic.textContent = `Количество повторов: букв - ${statisticSymbols}; цифр - ${statisticNumbers};`;

    outputStatistic.appendChild(outputSymbolStatistic);

    statistic.appendChild(outputStatistic);
}

/**
 * Производит мутацию строки.
 */
const generateChangedString = () => {
    const arraySymbols = [...outputSymbols];

    if (inputFirstSymbol) {

        for (let i = 0; i < arraySymbols.length; i++) {

            if (arraySymbols[i].match(/\D/g)) {
                arraySymbols[i] = inputFirstSymbol.value;
                statisticSymbols++;
            }
        }
    }

    if (inputSecondSymbol) {

        for (let i = 0; i < arraySymbols.length; i++) {

            if (arraySymbols[i].match(/\d/g)) {
                arraySymbols[i] = inputSecondSymbol.value;
                statisticNumbers++;
            }
        }
    }

    return arraySymbols.join('');
}

/**
 * Валидация введенных значений.
 * @param {Event} event Событие.
 */
const validateLenght = (event) => {
    if (event.target.value.length > 1) {
        event.target.value = event.target.value[0];
    }
}

/**
 * Валидация введенных значений.
 * @param {Event} event Событие.
 */
const validateNumberLimits = (event) => {
    const number = parseInt(event.target.value, 10);
    if (isNaN(number) || number <= 0 || Number.MAX_SAFE_INTEGER < number) {
        event.target.value = '';
    }
}

// Событие валидации отрицательных значений.
input.addEventListener('input', validateNumberLimits);

// Событие валидации длинны поля ввода для первого символа.
inputFirstSymbol.addEventListener('input', validateLenght);

// Событие валидации длинны поля ввода для второго символа.
inputSecondSymbol.addEventListener('input', validateLenght);

// Событие для формы ввода числа для генерации строки с символами.
outputNumbersForm.addEventListener('submit', event => {
    event.preventDefault();
    if (input.value.length != 0) {
        outputSymbols = generateString(input.value)
        createElementForSymbols(outputSymbols, event.target.name);
        event.target.classList.toggle('form_display');
        outputSymbolsForm.classList.toggle('form_display');
        input.value = '';
    }
});

// Событие для формы ввода символов для замены символов в сгенерированной строке.
outputSymbolsForm.addEventListener('submit', event => {
    event.preventDefault();
    if (inputFirstSymbol.value.length != 0 && inputSecondSymbol.value.length != 0) {
        createElementForSymbols(generateChangedString(), event.target.name);
        createElementForStatistics();
        event.target.classList.toggle('form_display');
        resetButton.classList.toggle('button_display');
        inputFirstSymbol.value = '';
        inputSecondSymbol.value = '';
    }
});

// Событие для кнопки очистки результата
resetButton.addEventListener('click', event => {
    event.preventDefault();
    resetButton.classList.toggle('button_display');
    outputNumbersForm.classList.toggle('form_display');
    statisticSymbols = 0;
    statisticNumbers = 0;

    for (let i = 0; i < statistic.childNodes.length; i++ ) {
        statistic.removeChild(statistic.children[i]);
    }

    for (let i = 0; i < outputRandomSymbols.childNodes.length; i++ ) {
        outputRandomSymbols.removeChild(outputRandomSymbols.children[i]);
    }

    for (let i = 0; i < outputChangedSymbols.childNodes.length; i++ ) {
        outputChangedSymbols.removeChild(outputChangedSymbols.children[i]);
    }
});
