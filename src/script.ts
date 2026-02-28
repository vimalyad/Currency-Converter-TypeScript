import { CONFIG } from "./config.js";

const currencyFromSelect = document.getElementById('from-currency') as HTMLSelectElement;
const currencyToSelect = document.getElementById('to-currency') as HTMLSelectElement;


// The expected country api's response
interface CountryData {
    flag: string,
    name: {
        common: string;
        official?: string;
        nativeName?: object
    },
    currencies?: {
        [currencyCode: string]: {
            name: string;
            symbol: string
        }
    }
}

// taking only those which are of our use
interface ExchangeData {
    base_code: string,
    conversion_rate: string,
    target_code: string
}

const COUNTRY_LIST_API = CONFIG.COUNTRY_LIST_API;

async function populateCurrencyDropdowns(): Promise<void> {
    try {
        const response = await fetch(COUNTRY_LIST_API);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: CountryData[] = await response.json();

        const currencyMap = new Map<string, string>();

        data.forEach((country) => {
            if (country.currencies) {
                const currencyCodes = Object.keys(country.currencies);

                currencyCodes.forEach((currencyCode) => {
                    if (!currencyMap.has(currencyCode)) {

                        const currencyName = country.currencies![currencyCode].name
                        const flag = country.flag;

                        const displayText = `${flag} ${currencyCode} - ${currencyName}`;
                        currencyMap.set(currencyCode, displayText);
                    }
                })
            }
        });

        // converted into array with sorted on the basis of their currencyCodes
        const sortedCurrencies = Array.from(currencyMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))

        currencyFromSelect.innerHTML = '';
        currencyToSelect.innerHTML = '';

        sortedCurrencies.forEach(([currencyCode, displayText]) => {

            const fromOption = document.createElement('option')
            fromOption.value = currencyCode;
            fromOption.textContent = displayText

            const toOption = document.createElement('option')
            toOption.value = currencyCode;
            toOption.textContent = displayText

            if (currencyCode === 'USD') fromOption.selected = true;
            if (currencyCode == 'INR') toOption.selected = true;

            currencyFromSelect.appendChild(fromOption)
            currencyToSelect.appendChild(toOption)
        });

    } catch (error) {
        console.error("Failed to fetch and populate currencies:", error)
    }
}

populateCurrencyDropdowns()


const amountInput = document.getElementById('amount') as HTMLInputElement;
const convertButton = document.getElementById('convert-btn') as HTMLButtonElement;
const resultMessage = document.getElementById('result-message') as HTMLDivElement;
const errorMessage = document.getElementById('error-message') as HTMLDivElement;


convertButton.addEventListener('click', async () => {

    const amountValue = amountInput.value;
    const fromCurrency = currencyFromSelect.value;
    const toCurrency = currencyToSelect.value;

    if (!amountValue || parseFloat(amountValue) <= 0) {
        errorMessage.textContent = "Please enter a valid amount greater than 0.";
        errorMessage.style.display = 'block';
        resultMessage.style.display = 'none';
        return;
    }

    const amount = parseFloat(amountValue);

    convertButton.textContent = "Converting...";
    errorMessage.style.display = 'none';
    resultMessage.style.display = 'none';

    try {
        const url = `${CONFIG.EXCHANGE_RATE_BASE_URL}${CONFIG.EXCHANGE_RATE_API_KEY}/pair/${fromCurrency}/${toCurrency}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const data: ExchangeData = await response.json();

        const exchangeRate = parseFloat(data.conversion_rate);
        const convertedAmount = exchangeRate * amount;

        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        resultMessage.textContent = `${amount} ${fromCurrency} = ${formatter.format(convertedAmount)} ${toCurrency}`;
        resultMessage.style.display = 'block'

    } catch (error) {
        errorMessage.textContent = "An error occurred, please try again later";
        errorMessage.style.display = 'block';
    } finally {
        convertButton.textContent = "Convert"
    }

})