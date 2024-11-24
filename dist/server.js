"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./app/config/db"));
const env_1 = __importDefault(require("./app/config/env"));
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.default)();
            server = app_1.default.listen(env_1.default.port, () => {
                console.log(`🚀 Server is listening on port: ${env_1.default.port}`);
            });
        }
        catch (error) {
            console.error("❌ Error starting server:", error);
            process.exit(1);
        }
    });
}
main();
process.on("unhandledRejection", (reason) => {
    console.error("👿 Unhandled Rejection detected, shutting down server...");
    console.error(reason);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
process.on("uncaughtException", (error) => {
    console.error("👿 Uncaught Exception detected, shutting down server...");
    console.error(error);
    process.exit(1);
});
