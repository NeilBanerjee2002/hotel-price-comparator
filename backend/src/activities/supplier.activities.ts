import axios from "axios";
import {
    HotelSearchRequest,
    Supplier,
    SupplierResult,
} from "../types/hotel";

const SUPPLIER_BASE_URL =
    process.env.SUPPLIER_BASE_URL || "http://localhost:3000";

export async function fetchSupplierHotels(
    supplier: Supplier,
    request: HotelSearchRequest
): Promise<SupplierResult> {
    const endpoint =
        supplier === "A"
            ? "/supplierA/hotels"
            : "/supplierB/hotels";

    const response = await axios.get(
        `${SUPPLIER_BASE_URL}${endpoint}`,
        {
            params: {
                city: request.city,
                checkIn: request.checkIn,
                checkOut: request.checkOut,
            },
            timeout: 4500,
        }
    );

    return {
        supplier,
        hotels: response.data,
    };
}