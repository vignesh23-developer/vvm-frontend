export function formatPrice(number: any): string {
    let num = Number(number);
    const units = [
        { value: 1e17, word: "Shankh" },
        { value: 1e15, word: "Padma" },
        { value: 1e13, word: "Neel" },
        { value: 1e11, word: "Kharab" },
        { value: 1e9, word: "Arab" },     
        { value: 1e7, word: "Crore" },    
        { value: 1e5, word: "Lakh" },
        { value: 1e3, word: "Thousand" },
        { value: 1e2, word: "Hundred" },
    ];

    for (const u of units) {
        if (num >= u.value) {
            const qty = num / u.value;
            return `${trimDecimal(qty)} ${u.word}`;
        }
    }

    return num.toString();
}

function trimDecimal(value: number): string {
    return Number(value.toFixed(2)).toString();
}
