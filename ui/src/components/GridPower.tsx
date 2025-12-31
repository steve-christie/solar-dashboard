import { Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface GridPowerProps {
	power?: number;
	voltage?: number;
	current?: number;
	frequency?: number;
	className?: string;
}

/**
 * GridPower component displays grid power data with visual graphics
 * Positive power = importing from grid, Negative power = exporting to grid
 */
export function GridPower({ power = 0, voltage = 0, current = 0, frequency = 0, className }: GridPowerProps) {
	const powerKw = Math.abs(power / 1000).toFixed(2);
	const isImporting = power > 0;
	const isExporting = power < 0;
	const isActive = power !== 0;

	return (
		<Card className={cn("relative overflow-hidden", className)}>
			{/* Animated background gradient */}
			<div
				className={cn(
					"absolute inset-0 bg-gradient-to-br transition-opacity duration-500",
					isImporting
						? "from-blue-500/10 via-cyan-500/5 to-transparent opacity-100"
						: isExporting
							? "from-green-500/10 via-emerald-500/5 to-transparent opacity-100"
							: "opacity-0"
				)}
			/>

			<CardHeader className="relative">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Zap
							className={cn(
								"h-6 w-6 transition-all duration-500",
								isActive
									? isImporting
										? "text-blue-400"
										: "text-green-400"
									: "text-muted-foreground"
							)}
						/>
						Grid Power
					</CardTitle>
					<div
						className={cn(
							"h-2 w-2 rounded-full transition-all duration-500",
							isActive
								? isImporting
									? "bg-blue-400 animate-pulse shadow-lg shadow-blue-400/50"
									: "bg-green-400 animate-pulse shadow-lg shadow-green-400/50"
								: "bg-muted-foreground"
						)}
					/>
				</div>
			</CardHeader>

			<CardContent className="relative">
				<div className="space-y-4">
					{/* Main power display with direction indicator */}
					<div className="flex items-baseline gap-2">
						{isExporting && (
							<span className="text-2xl text-green-400" title="Exporting to grid">
								↑
							</span>
						)}
						{isImporting && (
							<span className="text-2xl text-blue-400" title="Importing from grid">
								↓
							</span>
						)}
						<span
							className={cn(
								"text-4xl font-bold transition-colors duration-500",
								isImporting ? "text-blue-400" : isExporting ? "text-green-400" : "text-muted-foreground"
							)}
						>
							{powerKw}
						</span>
						<span className="text-lg text-muted-foreground">kW</span>
						<span
							className={cn(
								"text-sm font-medium transition-colors duration-500",
								isImporting ? "text-blue-400" : isExporting ? "text-green-400" : "text-muted-foreground"
							)}
						>
							{isImporting ? "Importing" : isExporting ? "Exporting" : "Idle"}
						</span>
					</div>

					{/* Visual power indicator with bidirectional flow */}
					<div className="relative h-3 bg-muted rounded-full overflow-hidden">
						{isImporting && (
							<div
								className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 ease-out shadow-lg shadow-blue-400/50"
								style={{
									width: `${Math.min((Math.abs(power) / 5000) * 100, 100)}%`,
								}}
							/>
						)}
						{isExporting && (
							<div
								className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000 ease-out shadow-lg shadow-green-400/50 ml-auto"
								style={{
									width: `${Math.min((Math.abs(power) / 5000) * 100, 100)}%`,
								}}
							/>
						)}
					</div>

					{/* Detailed metrics */}
					<div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
						<div>
							<p className="text-sm text-muted-foreground">Voltage</p>
							<p className="text-lg font-semibold">{voltage.toFixed(1)} V</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Current</p>
							<p className="text-lg font-semibold">{current.toFixed(2)} A</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Frequency</p>
							<p className="text-lg font-semibold">{frequency.toFixed(2)} Hz</p>
						</div>
					</div>

					{/* Grid visualization with power lines */}
					<div className="pt-4">
						<div className="relative h-20 bg-gradient-to-b from-blue-500/10 to-transparent rounded-lg border border-blue-500/30 overflow-hidden">
							{/* Power lines visualization */}
							<svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
								{/* Horizontal power lines */}
								<line
									x1="0"
									y1="20"
									x2="100"
									y2="20"
									stroke="currentColor"
									strokeWidth="2"
									className={cn(
										"transition-all duration-500",
										isActive ? "text-blue-400" : "text-muted-foreground/30"
									)}
								/>
								<line
									x1="0"
									y1="50"
									x2="100"
									y2="50"
									stroke="currentColor"
									strokeWidth="2"
									className={cn(
										"transition-all duration-500",
										isActive ? "text-blue-400" : "text-muted-foreground/30"
									)}
								/>
								<line
									x1="0"
									y1="80"
									x2="100"
									y2="80"
									stroke="currentColor"
									strokeWidth="2"
									className={cn(
										"transition-all duration-500",
										isActive ? "text-blue-400" : "text-muted-foreground/30"
									)}
								/>
								{/* Animated flow indicators */}
								{isActive && (
									<>
										{isImporting && (
											<circle
												cx="10"
												cy="20"
												r="2"
												fill="currentColor"
												className="text-blue-400 animate-[flow_2s_linear_infinite]"
											>
												<animate
													attributeName="cx"
													from="10"
													to="90"
													dur="2s"
													repeatCount="indefinite"
												/>
											</circle>
										)}
										{isExporting && (
											<circle
												cx="90"
												cy="50"
												r="2"
												fill="currentColor"
												className="text-green-400 animate-[flow_2s_linear_infinite]"
											>
												<animate
													attributeName="cx"
													from="90"
													to="10"
													dur="2s"
													repeatCount="indefinite"
												/>
											</circle>
										)}
									</>
								)}
							</svg>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

