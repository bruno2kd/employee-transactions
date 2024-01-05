const AdpTestController = require('./controller/AdpTestController')
const adpTestController = new AdpTestController()

const TRANSACTION_TYPE = 'alpha'

async function main () {
  const response = await adpTestController.performCalculation(TRANSACTION_TYPE)
  console.log(response)
}

main()
