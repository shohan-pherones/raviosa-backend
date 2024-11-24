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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const order_service_1 = require("./order.service");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderData = req.body;
        const order = yield order_service_1.OrderServices.createOrder(orderData);
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json({ message: "Order created successfully", order });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
const getSingleOrderForConfirm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const order = yield order_service_1.OrderServices.getSingleOrderForConfirm(userId);
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: "Order retrieved successfully", order });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: error.message });
    }
});
const confirmOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const order = yield order_service_1.OrderServices.confirmOrder(req.body, orderId);
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json({ message: "Order has been confirmed", order });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
const getOrdersByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const orders = yield order_service_1.OrderServices.getOrdersByUserId(userId);
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json({ message: "Orders retrieved successfully", orders });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_service_1.OrderServices.getAllOrders();
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json({ message: "Orders retrieved successfully", orders });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
const getOrderDetailsByOrderId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const orderedItems = yield order_service_1.OrderServices.getOrderDetailsByOrderId(orderId);
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json({ message: "Ordered items retrieved successfully", orderedItems });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
const mutateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, status } = req.params;
        const order = yield order_service_1.OrderServices.mutateOrderStatus(orderId, status);
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json({ message: "Order status updated successfully", order });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
exports.OrderControllers = {
    createOrder,
    getSingleOrderForConfirm,
    confirmOrder,
    getOrdersByUserId,
    getAllOrders,
    mutateOrderStatus,
    getOrderDetailsByOrderId,
};
