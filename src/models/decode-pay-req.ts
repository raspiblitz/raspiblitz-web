export interface DecodePayRequest {
	destination: string;
	payment_hash: string;
	/** epoch time in seconds */
	timestamp: number;
	/** number in seconds */
	expiry: number;
	description: string;
	description_hash: string;
	fallback_addr: string;
	cltv_expiry: number;
	route_hints: [];
	payment_addr: string;
	num_msat: number;
	features: [];
	currency: string;
}
