export interface HotelSearchRequest {
    city: string;
    checkIn: string;
    checkOut: string;
}

export interface Hotel {
    hotelId: string;
    name: string;
    price: number;
}

export type Supplier = "A" | "B";

export interface SupplierResult {
    supplier: Supplier;
    hotels: Hotel[];
}

export interface BestHotel {
    hotelId: string;
    name: string;
    price: number;
    supplier: Supplier;
}