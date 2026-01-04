
export type ConnectionState =
	| "disconnected"
	| "connecting"
	| "connected"
	| "disconnecting"
	| "error";

export interface DashboardStatus {
	state: ConnectionState;
	config_name?: string | null;
	connected_since?: string | null;
	bytes_sent: number;
	bytes_received: number;
	ip_address?: string | null;
}

// GivEnergy Dashboard Types
export interface InverterRequestData {
	solar?: {
		power?: number;
		voltage?: number;
		current?: number;
		[k: string]: unknown;
	};
	grid?: {
		power?: number;
		voltage?: number;
		current?: number;
		frequency?: number;
		[k: string]: unknown;
	};
	battery?: {
		percent?: number;
		power?: number;
		voltage?: number;
		current?: number;
		[k: string]: unknown;
	};
	consumption?: number | {
		power?: number;
		[k: string]: unknown;
	};
	[k: string]: unknown;
}

export interface InverterData {
	serial: string;
	request_data?: InverterRequestData;
	meter_data?: unknown;
}

export interface DashboardData {
	account?: unknown;
	devices?: unknown[];
	inverter?: InverterData;
	full_refresh?: boolean;
}
