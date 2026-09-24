const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No order items provided" });
    }

    let createdOrder;
    await session.withTransaction(async () => {
      let itemsPrice = 0;
      const orderItems = [];

      for (const item of items) {
        const quantity = Number(item.quantity);
        if (!Number.isInteger(quantity) || quantity < 1) {
          throw Object.assign(new Error("Each item must have a valid quantity"), { statusCode: 400 });
        }

        const product = await Product.findById(item.product).session(session);
        if (!product) throw Object.assign(new Error(`Product not found: ${item.product}`), { statusCode: 404 });
        if (product.stock < quantity) throw Object.assign(new Error(`Insufficient stock for ${product.name}`), { statusCode: 400 });

        itemsPrice += product.price * quantity;
        orderItems.push({ product: product._id, name: product.name, quantity, price: product.price });
        product.stock -= quantity;
        await product.save({ session });
      }

      const shippingPrice = itemsPrice > 100 ? 0 : 10;
      const totalPrice = itemsPrice + shippingPrice;
      [createdOrder] = await Order.create([{ user: req.user._id, items: orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice }], { session });
    });

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  } finally {
    await session.endSession();
  }
};

const getMyOrders = async (req, res, next) => { try { const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }); res.status(200).json({ success: true, count: orders.length, orders }); } catch (error) { next(error); } };
const getOrderById = async (req, res, next) => { try { const order = await Order.findById(req.params.id).populate("user", "name email"); if (!order) return res.status(404).json({ success: false, message: "Order not found" }); if (req.user.role !== "admin" && String(order.user._id) !== String(req.user._id)) return res.status(403).json({ success: false, message: "Not authorized to view this order" }); res.status(200).json({ success: true, order }); } catch (error) { next(error); } };
const getAllOrders = async (req, res, next) => { try { const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 }); res.status(200).json({ success: true, count: orders.length, orders }); } catch (error) { next(error); } };
const updateOrderStatus = async (req, res, next) => { try { const { status } = req.body; const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]; if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: "Invalid status value" }); const order = await Order.findById(req.params.id); if (!order) return res.status(404).json({ success: false, message: "Order not found" }); order.status = status; if (status === "delivered") order.deliveredAt = new Date(); await order.save(); res.status(200).json({ success: true, order }); } catch (error) { next(error); } };
const cancelOrder = async (req, res, next) => { try { const order = await Order.findById(req.params.id); if (!order) return res.status(404).json({ success: false, message: "Order not found" }); if (req.user.role !== "admin" && String(order.user) !== String(req.user._id)) return res.status(403).json({ success: false, message: "Not authorized to cancel this order" }); if (["shipped", "delivered", "cancelled"].includes(order.status)) return res.status(400).json({ success: false, message: "Order can no longer be cancelled" }); order.status = "cancelled"; await order.save(); res.status(200).json({ success: true, order }); } catch (error) { next(error); } };

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder };
