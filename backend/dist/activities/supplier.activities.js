"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSupplierHotels = fetchSupplierHotels;
const axios_1 = __importDefault(require("axios"));
const SUPPLIER_BASE_URL = process.env.SUPPLIER_BASE_URL || "http://localhost:3000";
async function fetchSupplierHotels(supplier, request) {
    const endpoint = supplier === "A"
        ? "/supplierA/hotels"
        : "/supplierB/hotels";
    const response = await axios_1.default.get(`${SUPPLIER_BASE_URL}${endpoint}`, {
        params: {
            city: request.city,
            checkIn: request.checkIn,
            checkOut: request.checkOut,
        },
        timeout: 4500,
    });
    return {
        supplier,
        hotels: response.data,
    };
}
