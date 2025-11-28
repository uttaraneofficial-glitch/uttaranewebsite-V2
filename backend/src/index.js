"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var PORT = process.env.PORT || 3000;
// Start server
app_1.default.listen(Number(PORT), '0.0.0.0', function () {
    console.log("Server is running on port ".concat(PORT));
});
