const AdpTestController = require("./controller/AdpTestController")
const adpTestController = new AdpTestController

async function main() {
    const response = await adpTestController.performCalculation()
    console.log(response)
}

main()