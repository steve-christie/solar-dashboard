import { useRef, useEffect, useState } from "react";
import { Home, ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface EnergyFlowProps {
	solarPower?: number;
	gridPower?: number;
	batteryPower?: number;
	batteryPercentage?: number;
	consumption?: number;
	className?: string;
}

interface Connection {
	from: string;
	to: string;
	power: number;
	color: string;
	active: boolean;
}

/**
 * EnergyFlow component visualizes the flow of energy between solar, grid, battery, and house consumption
 * with animated SVG connection lines
 */
export function EnergyFlow({ solarPower = 0, gridPower = 0, batteryPower = 0, batteryPercentage = 0, consumption = 0, className }: EnergyFlowProps) {
	const isSolarActive = solarPower > 0;
	// Grid positive = exporting (solar to grid), Grid negative = importing (grid to home)
	const isGridExporting = gridPower > 0;
	const isGridImporting = gridPower < 0;
	// Battery negative = charging (solar to battery), Battery positive = discharging (battery to home/grid)
	const isBatteryCharging = batteryPower < 0;
	const isBatteryDischarging = batteryPower > 0;
	const hasConsumption = consumption > 0;

	// Refs for element positions
	const solarRef = useRef<HTMLDivElement>(null);
	const solarInnerRef = useRef<HTMLDivElement>(null);
	const houseRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);
	const gridInnerRef = useRef<HTMLDivElement>(null);
	const batteryRef = useRef<HTMLDivElement>(null);
	const batteryInnerRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null); // Reference to the actual content area
	const [pathsReady, setPathsReady] = useState(false);

	// Trigger path recalculation after render
	useEffect(() => {
		// Small delay to ensure DOM is fully rendered
		const timer = setTimeout(() => {
			setPathsReady(true);
		}, 100);
		return () => clearTimeout(timer);
	}, [solarPower, gridPower, batteryPower, consumption]);

	// Get element edge position (for connecting to outer edges)
	const getElementEdge = (ref: React.RefObject<HTMLDivElement | null>, side: "top" | "bottom" | "left" | "right" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight") => {
		if (!ref.current || !contentRef.current) return { x: 0, y: 0 };
		const containerRect = contentRef.current.getBoundingClientRect();
		const elementRect = ref.current.getBoundingClientRect();
		const relativeX = elementRect.left - containerRect.left;
		const relativeY = elementRect.top - containerRect.top;
		const width = elementRect.width;
		const height = elementRect.height;

		switch (side) {
			case "top":
				return { x: relativeX + width / 2, y: relativeY };
			case "bottom":
				return { x: relativeX + width / 2, y: relativeY + height };
			case "left":
				return { x: relativeX, y: relativeY + height / 2 };
			case "right":
				return { x: relativeX + width, y: relativeY + height / 2 };
			case "topLeft":
				return { x: relativeX, y: relativeY };
			case "topRight":
				return { x: relativeX + width, y: relativeY };
			case "bottomLeft":
				return { x: relativeX, y: relativeY + height };
			case "bottomRight":
				return { x: relativeX + width, y: relativeY + height };
			default:
				return { x: relativeX + width / 2, y: relativeY + height / 2 };
		}
	};


	// Define all 6 connections (always show, but grey when inactive)
	const allConnections: Connection[] = [
		// 1. Solar to Home
		{
			from: "solar",
			to: "house",
			power: isSolarActive && hasConsumption ? Math.min(solarPower, consumption) : 0,
			color: "#fbbf24", // yellow-400
			active: isSolarActive && hasConsumption,
		},
		// 2. Solar to Battery (when battery is charging - negative power)
		{
			from: "solar",
			to: "battery",
			power: isSolarActive && isBatteryCharging ? Math.abs(batteryPower) : 0,
			color: "#4ade80", // green-400
			active: isSolarActive && isBatteryCharging,
		},
		// 3. Solar to Grid (when grid is positive - exporting)
		{
			from: "solar",
			to: "grid",
			power: isSolarActive && isGridExporting ? gridPower : 0,
			color: "#4ade80", // green-400
			active: isSolarActive && isGridExporting,
		},
		// 4. Battery to Home (when battery is discharging - positive power)
		{
			from: "battery",
			to: "house",
			power: isBatteryDischarging && hasConsumption ? batteryPower : 0,
			color: "#fb923c", // orange-400
			active: isBatteryDischarging && hasConsumption,
		},
		// 5. Battery to Grid (when battery discharging and grid exporting)
		{
			from: "battery",
			to: "grid",
			power: isBatteryDischarging && isGridExporting ? Math.min(batteryPower, gridPower) : 0,
			color: "#4ade80", // green-400
			active: isBatteryDischarging && isGridExporting,
		},
		// 6. Grid to Home (when grid is negative - importing)
		{
			from: "grid",
			to: "house",
			power: isGridImporting && hasConsumption ? Math.abs(gridPower) : 0,
			color: "#60a5fa", // blue-400
			active: isGridImporting && hasConsumption,
		},
	];

	// Calculate path between two points connecting to edges
	const getPath = (from: string, to: string): string => {
		// Determine which edges to connect
		let fromEdge: "top" | "bottom" | "left" | "right" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" = "bottom";
		let toEdge: "top" | "bottom" | "left" | "right" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" = "top";

		// Solar connections (at 12 o'clock)
		if (from === "solar") {
			if (to === "house") {
				fromEdge = "bottom";
				toEdge = "top";
			} else if (to === "battery") {
				// Outer curved path: left edge of solar
				fromEdge = "left";
				toEdge = "top";
			} else if (to === "grid") {
				// Outer curved path: right edge of solar
				fromEdge = "right";
				toEdge = "top";
			}
		}
		// Battery connections (at 8 o'clock)
		else if (from === "battery") {
			if (to === "house") {
				// Top right corner of battery
				fromEdge = "topRight";
				toEdge = "left";
			} else if (to === "grid") {
				// Bottom right corner of battery
				fromEdge = "right";
				toEdge = "left";
			}
		}
		// Grid connections (at 4 o'clock)
		else if (from === "grid") {
			if (to === "house") {
				// Top left corner of grid
				fromEdge = "topLeft";
				toEdge = "right";
			}
		}

		const fromPos = getElementEdge(
			from === "solar" ? solarInnerRef : from === "house" ? houseRef : from === "grid" ? gridInnerRef : batteryInnerRef,
			fromEdge
		);
		const toPos = getElementEdge(
			to === "solar" ? solarInnerRef : to === "house" ? houseRef : to === "grid" ? gridInnerRef : batteryInnerRef,
			toEdge
		);

		// Skip if positions are invalid
		if (fromPos.x === 0 && fromPos.y === 0 && toPos.x === 0 && toPos.y === 0) {
			return "";
		}

		// Special paths for outer edge connections (solar-grid, solar-battery, battery-grid)
		// Use straight lines for simplicity
		const isOuterEdgeConnection =
			(from === "solar" && to === "grid") ||
			(from === "solar" && to === "battery") ||
			(from === "battery" && to === "grid");

		if (isOuterEdgeConnection) {
			// Simple straight line from source edge to destination edge
			return `M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`;
		}

		// Straight line paths for connections to/from house (center)
		return `M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`;
	};

	// Calculate path length for animation (with fallback)
	const getPathLength = (path: string): number => {
		if (!path) return 100;
		try {
			const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
			pathElement.setAttribute("d", path);
			const length = pathElement.getTotalLength();
			return length > 0 ? length : 100;
		} catch {
			return 100;
		}
	};

	// Removed totalLoad calculation as it's no longer displayed

	return (
		<Card className={cn("relative overflow-hidden", className)}>
			<CardHeader>
				<CardTitle>Energy Flow</CardTitle>
			</CardHeader>
			<CardContent>
				<div ref={containerRef} className="flex justify-center">
					<div ref={contentRef} className="relative min-h-[480px] min-w-[400px]">
						{/* SVG overlay for connections */}
						<svg
							className="absolute inset-0 w-full h-full pointer-events-none z-0"
							style={{ overflow: "visible" }}
						>
						{/* Draw all connections - always visible */}
						{pathsReady && allConnections.map((conn, idx) => {
							const path = getPath(conn.from, conn.to);
							if (!path) return null;
							const pathLength = getPathLength(path);
							const strokeWidth = conn.active ? Math.max(2.5, Math.min(4.5, (conn.power / 1000) * 2)) : 2;

							return (
								<g key={`${conn.from}-${conn.to}-${idx}`}>
									{/* Base path - always visible, grey when inactive */}
									<path
										d={path}
										fill="none"
										stroke={conn.active ? conn.color : "#6b7280"} // grey-500 when inactive
										strokeWidth={strokeWidth}
										strokeOpacity={conn.active ? 0.4 : 0.2}
										className="transition-all duration-500"
									/>
									{/* Animated flow path - only when active */}
									{conn.active && conn.power > 0 && (
										<path
											d={path}
											fill="none"
											stroke={conn.color}
											strokeWidth={strokeWidth}
											strokeLinecap="round"
											strokeDasharray={`${pathLength / 8} ${pathLength}`}
											strokeDashoffset={pathLength}
											opacity="0.9"
										>
											<animate
												attributeName="stroke-dashoffset"
												values={(() => {
													// Generate 16 intermediate values (4x more frames) for smoother animation
													const steps = 16;
													const stepSize = (pathLength * 2) / steps;
													const values: string[] = [];
													for (let i = 0; i <= steps; i++) {
														values.push((pathLength - stepSize * i).toString());
													}
													return values.join(";");
												})()}
												dur={`${Math.max(1, 3 - (conn.power / 5000))}s`}
												repeatCount="indefinite"
												calcMode="linear"
											/>
										</path>
									)}
								</g>
							);
						})}
						</svg>

						{/* Energy sources positioned in clock layout */}
						<div className="relative z-10" style={{ minHeight: "480px" }}>
						{/* Solar Panel - 12 o'clock (Top) */}
						<div className="absolute top-0 left-1/2 -translate-x-1/2">
							<div ref={solarRef} className="flex flex-col items-center">
								<div ref={solarInnerRef}
									className={cn(
										"w-20 h-20 rounded-lg border-2 flex items-center justify-center transition-all duration-500",
										isSolarActive
											? "bg-yellow-500/20 border-yellow-400 shadow-lg shadow-yellow-400/30"
											: "bg-muted border-border"
									)}
								>
									<span className="text-2xl">☀️</span>
								</div>
								<p className="text-sm text-muted-foreground mt-2">Solar</p>
								<p className="text-xs font-semibold text-yellow-400">
									{(solarPower / 1000).toFixed(2)} kW
								</p>
							</div>
						</div>

						{/* Grid - 4 o'clock (Bottom Right) */}
						<div className="absolute bottom-10 right-0 translate-x-1/4 translate-y-1/4">
							<div ref={gridRef} className="flex flex-col items-center">
								<div ref={gridInnerRef}
									className={cn(
										"w-20 h-20 rounded-lg border-2 flex items-center justify-center transition-all duration-500",
										isGridImporting
											? "bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-400/30"
											: isGridExporting
												? "bg-green-500/20 border-green-400 shadow-lg shadow-green-400/30"
												: "bg-muted border-border"
									)}
								>
									<span className="text-xl">⚡</span>
								</div>
								<p className="text-sm text-muted-foreground mt-2">Grid</p>
								<div
									className={cn(
										"flex items-center gap-1 text-xs font-semibold",
										isGridImporting ? "text-blue-400" : isGridExporting ? "text-green-400" : "text-muted-foreground"
									)}
								>
									{isGridImporting && <ArrowLeft className="h-3 w-3" />}
									{isGridExporting && <ArrowRight className="h-3 w-3" />}
									<span>{(Math.abs(gridPower) / 1000).toFixed(2)} kW</span>
								</div>
							</div>
						</div>

						{/* Battery - 8 o'clock (Bottom Left) */}
						<div className="absolute bottom-10 left-0 -translate-x-1/4 translate-y-1/4">
							<div ref={batteryRef} className="flex flex-col items-center">
								<div
									ref={batteryInnerRef}
									className={cn(
										"w-20 h-20 rounded-lg border-2 flex items-center justify-center transition-all duration-500 relative overflow-hidden",
										isBatteryCharging
											? "bg-green-500/20 border-green-400 shadow-lg shadow-green-400/30"
											: isBatteryDischarging
												? "bg-orange-500/20 border-orange-400 shadow-lg shadow-orange-400/30"
												: "bg-muted border-border"
									)}
								>
									<span className="text-2xl">🔋</span>
									{/* Battery level indicator */}
									<div
										className={cn(
											"absolute bottom-0 left-0 right-0 transition-all duration-1000",
											batteryPercentage > 60
												? "bg-green-400/50"
												: batteryPercentage > 30
													? "bg-yellow-400/50"
													: "bg-red-400/50"
										)}
										style={{ height: `${batteryPercentage}%` }}
									/>
								</div>
								<p className="text-sm text-muted-foreground mt-2">Battery</p>
								<p className="text-xs font-semibold">
									<span className={cn(isBatteryCharging ? "text-green-400" : isBatteryDischarging ? "text-orange-400" : "text-muted-foreground")}>
										{isBatteryCharging ? "+" : isBatteryDischarging ? "-" : ""}
										{(Math.abs(batteryPower) / 1000).toFixed(2)} kW
									</span>
									{" • "}
									<span>{batteryPercentage.toFixed(0)}%</span>
								</p>
							</div>
						</div>

						{/* House - Center */}
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
							<div ref={houseRef} className="flex flex-col items-center">
								<div
									className={cn(
										"w-24 h-24 rounded-lg border-2 flex items-center justify-center transition-all duration-500 relative",
										hasConsumption
											? "bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-400/30"
											: "bg-muted border-border"
									)}
								>
									<Home className="h-10 w-10 text-blue-400" />
								</div>
								<p className="text-sm text-muted-foreground mt-2">House</p>
								<p className="text-xs font-semibold text-blue-400">
									{(consumption / 1000).toFixed(2)} kW/h
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			</CardContent>
		</Card>
	);
}
