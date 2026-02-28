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
        const sortedCurrencies = Array.from(currencyMap.entries()).sort((a , b) => a[0].localeCompare(b[0]))

        currencyFromSelect.innerHTML = '';
        currencyToSelect.innerHTML = '';

        sortedCurrencies.forEach(([currencyCode , displayText]) => {

            const fromOption = document.createElement('option')
            fromOption.value = currencyCode;
            fromOption.textContent = displayText

            const toOption = document.createElement('option')
            toOption.value = currencyCode;
            toOption.textContent = displayText

            if(currencyCode === 'USD') fromOption.selected = true;
            if(currencyCode == 'INR') toOption.selected = true;

            currencyFromSelect.appendChild(fromOption)
            currencyToSelect.appendChild(toOption)
        });

    } catch (error) {
        console.error("Failed to fetch and populate currencies:", error)
    }
}

populateCurrencyDropdowns()