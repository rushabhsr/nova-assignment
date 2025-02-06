export const formatDateToIST = (date) => {
    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata',
    };

    const formattedDate = new Date(date).toLocaleString('en-IN', options);
    return formattedDate;
};