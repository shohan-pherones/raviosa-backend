"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            );
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const app_error_1 = __importDefault(require("../../errors/app.error"));
const product_model_1 = __importDefault(require("../product/product.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const order_model_1 = __importDefault(require("./order.model"));
const ordered_item_model_1 = __importDefault(require("./ordered-item.model"));
const createOrder = (orderData) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const session = yield (0, mongoose_1.startSession)();
        try {
            session.startTransaction();
            const { subtotal, shippingCost, tax, totalPrice, items, user } =
                orderData;
            for (const item of items) {
                const product = yield product_model_1.default
                    .findById(item._id)
                    .session(session);
                if (!product) {
                    throw new app_error_1.default(
                        http_status_codes_1.StatusCodes.NOT_FOUND,
                        `Product with ID ${item._id} not found`
                    );
                }
                if (product.stock < item.quantity) {
                    throw new app_error_1.default(
                        http_status_codes_1.StatusCodes.BAD_REQUEST,
                        `Insufficient stock for product ${product.name}`
                    );
                }
            }
            const [order] = yield order_model_1.default.create(
                [
                    {
                        subtotal,
                        shippingCost,
                        tax,
                        totalPrice,
                        items,
                        user,
                    },
                ],
                { session }
            );
            for (const item of items) {
                yield product_model_1.default.updateOne(
                    { _id: item._id },
                    {
                        $push: { orders: order._id },
                    },
                    { session }
                );
            }
            yield user_model_1.default.updateOne(
                { _id: user._id },
                { $push: { orders: order._id } },
                { session }
            );
            yield session.commitTransaction();
            return (yield order.populate(["items", "user"])).toObject();
        } catch (error) {
            yield session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    });
const getSingleOrderForConfirm = (userId) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const order = yield order_model_1.default
            .findOne({
                user: userId,
                status: "placed",
            })
            .sort({ createdAt: -1 })
            .populate(["items", "user"]);
        if (!order) {
            throw new app_error_1.default(
                http_status_codes_1.StatusCodes.NOT_FOUND,
                "Order not found"
            );
        }
        return order;
    });
const getOrdersByUserId = (userId) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const orders = yield order_model_1.default
            .find({
                user: userId,
            })
            .sort({ createdAt: -1 });
        if (!orders.length) {
            throw new app_error_1.default(
                http_status_codes_1.StatusCodes.NOT_FOUND,
                "Order not found"
            );
        }
        return orders;
    });
const getAllOrders = () =>
    __awaiter(void 0, void 0, void 0, function* () {
        const orders = yield order_model_1.default
            .find({})
            .sort({ createdAt: -1 });
        if (!orders.length) {
            throw new app_error_1.default(
                http_status_codes_1.StatusCodes.NOT_FOUND,
                "Order not found"
            );
        }
        return orders;
    });
const confirmOrder = (confirmOrderData, orderId) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const session = yield (0, mongoose_1.startSession)();
        try {
            session.startTransaction();
            const order = yield order_model_1.default
                .findById(orderId)
                .session(session);
            if (!order) {
                throw new app_error_1.default(
                    http_status_codes_1.StatusCodes.NOT_FOUND,
                    `Order with ID ${orderId} not found`
                );
            }
            if (order.status !== "placed") {
                throw new app_error_1.default(
                    http_status_codes_1.StatusCodes.BAD_REQUEST,
                    `Order with ID ${orderId} cannot be confirmed because it's not in "placed" status.`
                );
            }
            const { shippingDetails, items } = confirmOrderData;
            const orderedItems = [];
            for (const item of items) {
                const product = yield product_model_1.default
                    .findById(item._id)
                    .session(session);
                if (!product) {
                    throw new app_error_1.default(
                        http_status_codes_1.StatusCodes.NOT_FOUND,
                        `Product with ID ${item._id} not found`
                    );
                }
                if (product.stock < item.quantity) {
                    throw new app_error_1.default(
                        http_status_codes_1.StatusCodes.BAD_REQUEST,
                        `Insufficient stock for product ${product.name}`
                    );
                }
                product.stock -= item.quantity;
                yield product.save({ session });
                orderedItems.push({
                    product: product._id,
                    quantity: item.quantity,
                });
            }
            yield ordered_item_model_1.default.create(
                [
                    {
                        orderId: order._id,
                        orderCosts: {
                            subtotal: order.subtotal,
                            shippingCost: order.shippingCost,
                            tax: order.tax,
                            totalPrice: order.totalPrice,
                        },
                        items: orderedItems,
                    },
                ],
                { session }
            );
            const updatedOrder = yield order_model_1.default.findOneAndUpdate(
                { _id: orderId },
                {
                    $set: {
                        shippingDetails: {
                            name: shippingDetails.name,
                            email: shippingDetails.email,
                            phone: shippingDetails.phone,
                            address: shippingDetails.address,
                            paymentMethod: shippingDetails.paymentMethod,
                        },
                        status: "confirmed",
                    },
                },
                { new: true, session }
            );
            if (!updatedOrder) {
                throw new app_error_1.default(
                    http_status_codes_1.StatusCodes.NOT_FOUND,
                    `Order with ID ${orderId} not found`
                );
            }
            yield session.commitTransaction();
            return (yield updatedOrder.populate(["items", "user"])).toObject();
        } catch (error) {
            yield session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    });
const mutateOrderStatus = (orderId, status) =>
    __awaiter(void 0, void 0, void 0, function* () {
        if (
            ![
                "placed",
                "confirmed",
                "paid",
                "processing",
                "shipping",
                "shipped",
                "cancelled",
            ].includes(status)
        ) {
            throw new app_error_1.default(
                http_status_codes_1.StatusCodes.BAD_REQUEST,
                "Invalid order status"
            );
        }
        const updatedOrder = yield order_model_1.default.findOneAndUpdate(
            { _id: orderId },
            { $set: { status } },
            { new: true }
        );
        if (!updatedOrder) {
            throw new app_error_1.default(
                http_status_codes_1.StatusCodes.NOT_FOUND,
                "Order not found"
            );
        }
        return updatedOrder;
    });
const getOrderDetailsByOrderId = (orderId) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const orderedItems = yield ordered_item_model_1.default
            .findOne({
                orderId,
            })
            .populate("items.product")
            .exec();
        if (!orderedItems) {
            throw new app_error_1.default(
                http_status_codes_1.StatusCodes.NOT_FOUND,
                "Ordered items not found"
            );
        }
        return orderedItems;
    });
exports.OrderServices = {
    createOrder,
    getSingleOrderForConfirm,
    confirmOrder,
    getOrdersByUserId,
    getAllOrders,
    mutateOrderStatus,
    getOrderDetailsByOrderId,
};
