import { invoke } from "@tauri-apps/api/core";
import type { DashboardStatus } from "../types";

export async function getDashboardStatus(): Promise<DashboardStatus> {
	return await invoke("get_dashboard_status");
}

export async function getAccountData(): Promise<any> {
	return await invoke("get_account_data");
}

export async function getInverterData(serial: string): Promise<any> {
	return await invoke("get_inverter_data", { serial });
}

export async function getAccountDevices(accountId: string, page?: number): Promise<any> {
	return await invoke("get_account_devices", { accountId, page: page ?? 1 });
}

export async function getFullDashboardData(
	fullRefresh: boolean,
	cachedInverterSerial?: string
): Promise<any> {
	return await invoke("get_full_dashboard_data", {
		fullRefresh,
		cachedInverterSerial: cachedInverterSerial || null,
	});
}
