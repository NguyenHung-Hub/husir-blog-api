const path = require("path");
const DataUri = require("datauri/parser");
const parser = new DataUri();

const formatBufferTo64 = (file) => {
    return parser.format(
        path.extname(file.originalname).toString(),
        file.buffer
    );
};

module.exports = formatBufferTo64;
