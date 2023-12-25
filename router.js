const AdpTestController = require("./controller/AdpTestController")
const HtmlController = require("./controller/HtmlController")
const adpTestController = new AdpTestController
const htmlController = new HtmlController


// Define route handlers
const routes = {
    '/api/adp-test': {
        "GET": adpTestController.index
    },
    '/': {
        "GET": (req, res) => htmlController.renderHtml(req, res, 'home')
    },
    'notFound': (req, res) => htmlController.renderHtml(req, res, 'notFound'),
};

const router = async function (req, res) {
    try {
        const requestedPath = req.url
        const requestMethod = req.method
        const routesPath = routes[requestedPath];
        const handler = routesPath && routesPath[requestMethod] || routes['notFound'];

        handler(req, res);
    } catch (error) {
        console.log(error);
    }
};

module.exports = router;