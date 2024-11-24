"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const http_status_codes_1 = require("http-status-codes");
const morgan_1 = __importDefault(require("morgan"));
const global_error_1 = __importDefault(require("./app/errors/global.error"));
const not_found_error_1 = __importDefault(require("./app/errors/not-found.error"));
const routes_1 = __importDefault(require("./app/routes"));
const env_1 = __importDefault(require("./app/config/env"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: env_1.default.frontend_base_url, credentials: true }));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("short"));
app.use("/api/v1", routes_1.default);
app.get("/api/v1/health", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Server is running healthy!" });
});
app.use(not_found_error_1.default);
app.use(global_error_1.default);
exports.default = app;
