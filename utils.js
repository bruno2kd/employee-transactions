/**
 * Checks if the provided date is from the last year compared to the current date.
 * @param {string | Date} date - A string or Date object representing the date to be checked.
 * @returns {boolean} Returns true if the provided date is from the last year; otherwise, returns false.
 */
const isDateFromLastYear = (date) => {
    const checkingDate = new Date(date);
    const currentDate = new Date();

    const isLastYear = checkingDate.getFullYear() === currentDate.getFullYear() - 1;
    return isLastYear
}

module.exports = {
    isDateFromLastYear   
}