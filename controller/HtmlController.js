const fs = require('fs');

class HtmlController {
    renderHtml(req, res, path) {
        const viewPath = `./views/${path}.html`
        fs.readFile(viewPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            // Set the content type to HTML
            res.writeHead(200, { 'Content-Type': 'text/html' });

            // Send the HTML content as the response
            res.end(data);
        });
    }
}

module.exports = HtmlController;
