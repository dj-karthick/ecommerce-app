const fs = require('fs');
console.log(fs.readFileSync('backend/routes/orderRoutes.js', 'utf8').substring(1900, 2600));
