const path = require('path');

require('dotenv').config({ path: path.resolve(process.cwd(), '..', '.env') });
require('./src/app')();
