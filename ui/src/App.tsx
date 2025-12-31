import { useState, useEffect, useRef } from "react";
import AppHeader from "./components/AppHeader";
import { SolarPanel } from "./components/SolarPanel";
import { GridPower } from "./components/GridPower";
import { Battery } from "./components/Battery";
import { EnergyFlow } from "./components/EnergyFlow";
import { DebugDrawer } from "./components/DebugDrawer";
import { getFullDashboardData } from "./services/api";
import type { DashboardData } from "./types";
import "./App.css";
import { Card, CardContent } from "./components/ui/card";
import { fakeData } from "./services/fake-data";

function App() {
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
	const [cachedInverterSerial, setCachedInverterSerial] = useState<string | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const fetchDashboardData = async (fullRefresh: boolean) => {
		setLoading(true);
		setError(null);
		try {
			const data = await getFullDashboardData(fullRefresh, cachedInverterSerial || undefined);
			// const data = fakeData;
			setDashboardData(data);
			setLastRefresh(new Date());
			
			// Store inverter serial for future partial refreshes
			if (fullRefresh && data.inverter?.serial) {
				setCachedInverterSerial(data.inverter.serial);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
			setDashboardData(null);
		} finally {
			setLoading(false);
		}
	};

	// Load data on startup and set up refresh interval
	useEffect(() => {
		fetchDashboardData(true);

		// Set up 30 second refresh interval
		intervalRef.current = setInterval(() => {
			fetchDashboardData(false); // Partial refresh
		}, 30000);

		// Cleanup interval on unmount
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only run once on mount

	// Update interval when cached serial changes (after first full refresh)
	// This ensures the interval uses the latest cached serial
	useEffect(() => {
		if (cachedInverterSerial && intervalRef.current) {
			// Restart interval with new cached serial
			clearInterval(intervalRef.current);
			intervalRef.current = setInterval(() => {
				fetchDashboardData(false); // Partial refresh
			}, 30000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cachedInverterSerial]); // Restart interval when serial is cached

	return (
		<div className="h-screen bg-background flex flex-col">
			<AppHeader/>

			<main className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
				<div className="flex flex-col gap-4">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-bold">GivEnergy Dashboard</h2>
						<div className="flex gap-2 items-center">
							{lastRefresh && (
								<p className="text-sm text-muted-foreground">
									Last refresh: {lastRefresh.toLocaleTimeString()}
								</p>
							)}
							<button
								onClick={() => fetchDashboardData(true)}
								disabled={loading}
								className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? "Loading..." : "Refresh All"}
							</button>
						</div>
					</div>

					{error && (
						<div className="p-4 bg-destructive/10 border border-destructive rounded-md text-destructive">
							{error}
						</div>
					)}

					{dashboardData?.inverter?.request_data && (
						<div className="flex flex-col gap-6">
							{/* Energy Flow Visualization */}
							<EnergyFlow
								solarPower={dashboardData.inverter.request_data.solar?.power ?? 0}
								gridPower={dashboardData.inverter.request_data.grid?.power ?? 0}
								batteryPower={dashboardData.inverter.request_data.battery?.power ?? 0}
								batteryPercentage={dashboardData.inverter.request_data.battery?.percent ?? 0}
								consumption={
									typeof dashboardData.inverter.request_data.consumption === "number"
										? dashboardData.inverter.request_data.consumption
										: dashboardData.inverter.request_data.consumption?.power ?? 0
								}
							/>

							{/* Main Energy Sources Grid */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<SolarPanel
									power={dashboardData.inverter.request_data.solar?.power ?? 0}
									voltage={dashboardData.inverter.request_data.solar?.voltage ?? 0}
									current={dashboardData.inverter.request_data.solar?.current ?? 0}
								/>
								<GridPower
									power={dashboardData.inverter.request_data.grid?.power ?? 0}
									voltage={dashboardData.inverter.request_data.grid?.voltage ?? 0}
									current={dashboardData.inverter.request_data.grid?.current ?? 0}
									frequency={dashboardData.inverter.request_data.grid?.frequency ?? 0}
								/>
								<Battery
									power={dashboardData.inverter.request_data.battery?.power ?? 0}
									voltage={dashboardData.inverter.request_data.battery?.voltage ?? 0}
									current={dashboardData.inverter.request_data.battery?.current ?? 0}
									percent={dashboardData.inverter.request_data.battery?.percent ?? 0}
								/>
							</div>

							{/* Inverter Info */}
							{dashboardData.inverter.serial && (
								<Card>
									<CardContent className="pt-6">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-muted-foreground">Inverter Serial</p>
												<p className="text-lg font-semibold">{dashboardData.inverter.serial}</p>
											</div>
											{lastRefresh && (
												<div className="text-right">
													<p className="text-sm text-muted-foreground">Last Updated</p>
													<p className="text-sm font-medium">{lastRefresh.toLocaleTimeString()}</p>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					)}

					{loading && !dashboardData && (
						<div className="flex items-center justify-center h-64">
							<div className="text-center space-y-4">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
								<p className="text-muted-foreground">Loading energy data...</p>
							</div>
						</div>
					)}
				</div>
			</main>

			<footer className="flex-shrink-0 text-center bg-card border-t border-border py-4 text-sm text-muted-foreground">
				GivEnergy Dashboard v0.1.0 • Built with Rust + Tauri + React
			</footer>

			{/* Debug Drawer - Always available when data exists */}
			{dashboardData?.inverter && (
				<DebugDrawer data={dashboardData.inverter} />
			)}
		</div>
	);
}

export default App;
