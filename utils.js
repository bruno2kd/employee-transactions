/**
 * Checks if the provided date is from the last year compared to the current date.
 * @param {string | Date} date - A string or Date object representing the date to be checked.
 * @returns {boolean} Returns true if the provided date is from the last year; otherwise, returns false.
 */
const isDateFromLastYear = (date) => {
  const checkingDate = new Date(date)
  const currentDate = new Date()

  const isLastYear = checkingDate.getFullYear() === currentDate.getFullYear() - 1
  return isLastYear
}

/**
 * Separates the path and parameters from a URL string.
 * @param {string} urlString - The URL string with parameters.
 * @returns {Object} An object with 'requestedPath' (URL path) and 'params' (params as key-value pairs).
 */
const separatePathAndParams = urlString => {
  const [requestedPath, queryParams] = urlString.split('?')
  const params = {}
  if (queryParams) {
    const queryParamsArray = queryParams.split('&')
    queryParamsArray.forEach(param => {
      const [key, value] = param.split('=')
      params[key] = value
    })
  }
  return { requestedPath, params }
}

module.exports = {
  isDateFromLastYear,
  separatePathAndParams
}
