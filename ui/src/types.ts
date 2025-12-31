export interface VpnConfig {
	name: string;
	config_path: string;
	username?: string | null;
	password?: string | null;
}

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

export interface LogEntry {
	message: string;
	type: "info" | "success" | "warning" | "error";
}

export interface User {
	id: string;
	username: string;
	email?: string;
	// Add other user fields as needed
}

export interface AuthCredentials {
	username: string;
	password: string;
}

export interface VpnServer {
	region: string;
	label: string;
}

export interface VpnServersResponse {
	main_servers: VpnServer[];
	network_servers: VpnServer[];
}

export interface SetupStatus {
	openvpnInstalled: boolean;
	helperInstalled: boolean;
	helperRunning: boolean;
}

export type SetupStep =
	| "openvpn"
	| "helper_install"
	| "helper_start"
	| "complete";

export interface VpnConfigResult {
	config_path: string;
	config_content: string;
	filename: string;
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
