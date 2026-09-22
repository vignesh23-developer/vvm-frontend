export async function ISODateConvert(isoDate: string) {
    // console.log("comm date:", isoDate);
    const dateAndTimeFormatter = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    const datePars = new Date(isoDate);
    // console.log("parsed date:", datePars);
    const formatedDateAndTime = datePars ? dateAndTimeFormatter.format(datePars) : isoDate;
    // console.log("formated date:", formatedDateAndTime);
    return formatedDateAndTime;


}