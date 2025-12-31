import { Battery as BatteryIcon, BatteryCharging } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface BatteryProps {
	percent?: number;
	power?: number;
	voltage?: number;
	current?: number;
	className?: string;
}

/**
 * Battery component displays battery data with visual graphics
 * Positive power = charging, Negative power = discharging
 */
export function Battery({power = 0, voltage = 0, current = 0, percent = 0, className }: BatteryProps) {
	const powerKw = Math.abs(power / 1000).toFixed(2);
	const isCharging = power > 0;
	const isDischarging = power < 0;
	const isActive = power !== 0;
	const batteryLevel = Math.max(0, Math.min(100, percent));

	// Determine battery health color
	const getBatteryColor = (level: number) => {
		if (level > 60) return "text-green-400";
		if (level > 30) return "text-yellow-400";
		return "text-red-400";
	};

	const getBatteryBgColor = (level: number) => {
		if (level > 60) return "from-green-500/20 to-green-600/10";
		if (level > 30) return "from-yellow-500/20 to-yellow-600/10";
		return "from-red-500/20 to-red-600/10";
	};

	return (
		<Card className={cn("relative overflow-hidden", className)}>
			{/* Animated background gradient */}
			<div
				className={cn(
					"absolute inset-0 bg-gradient-to-br transition-opacity duration-500",
					isActive
						? isCharging
							? "from-green-500/10 via-emerald-500/5 to-transparent opacity-100"
							: "from-orange-500/10 via-red-500/5 to-transparent opacity-100"
						: "opacity-0"
				)}
			/>

			<CardHeader className="relative">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						{isCharging ? (
							<BatteryCharging
								className={cn(
									"h-6 w-6 transition-all duration-500",
									isActive ? "text-green-400 animate-pulse" : "text-muted-foreground"
								)}
							/>
						) : (
							<BatteryIcon
								className={cn(
									"h-6 w-6 transition-all duration-500",
									isActive ? getBatteryColor(batteryLevel) : "text-muted-foreground"
								)}
							/>
						)}
						Battery
					</CardTitle>
					<div
						className={cn(
							"h-2 w-2 rounded-full transition-all duration-500",
							isActive
								? isCharging
									? "bg-green-400 animate-pulse shadow-lg shadow-green-400/50"
									: "bg-orange-400 animate-pulse shadow-lg shadow-orange-400/50"
								: "bg-muted-foreground"
						)}
					/>
				</div>
			</CardHeader>

			<CardContent className="relative">
				<div className="space-y-4">
					{/* Battery level display */}
					<div className="flex items-center justify-between">
						<div className="flex items-baseline gap-2">
							<span className={cn("text-4xl font-bold transition-colors duration-500", getBatteryColor(batteryLevel))}>
								{batteryLevel.toFixed(0)}
							</span>
							<span className="text-lg text-muted-foreground">%</span>
						</div>
						<div className="text-right">
							<p className="text-sm text-muted-foreground">Power</p>
							<p
								className={cn(
									"text-lg font-semibold transition-colors duration-500",
									isCharging ? "text-green-400" : isDischarging ? "text-orange-400" : "text-muted-foreground"
								)}
							>
								{isCharging ? "+" : isDischarging ? "-" : ""}
								{powerKw} kW
							</p>
						</div>
					</div>

					{/* Visual battery indicator */}
					<div className="relative">
						{/* Battery outline */}
						<div className="relative h-16 bg-muted rounded-lg border-2 border-border overflow-hidden">
							{/* Battery level fill */}
							<div
								className={cn(
									"absolute inset-y-0 left-0 bg-gradient-to-r transition-all duration-1000 ease-out",
									getBatteryBgColor(batteryLevel)
								)}
								style={{
									width: `${batteryLevel}%`,
								}}
							>
								{/* Animated charging/discharging effect */}
								{isActive && (
									<div
										className={cn(
											"absolute inset-0 transition-opacity duration-500",
											isCharging
												? "bg-gradient-to-r from-green-400/30 via-transparent to-transparent animate-[shimmer_2s_infinite]"
												: "bg-gradient-to-r from-orange-400/30 via-transparent to-transparent animate-[shimmer_2s_infinite]"
										)}
									/>
								)}
							</div>
							{/* Battery terminal */}
							<div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-8 bg-border rounded-r border-l border-border" />
						</div>
						{/* Battery level text overlay */}
						<div className="absolute inset-0 flex items-center justify-center">
							<span className={cn("text-xs font-bold transition-colors duration-500", getBatteryColor(batteryLevel))}>
								{batteryLevel.toFixed(0)}%
							</span>
						</div>
					</div>

					{/* Detailed metrics */}
					<div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
						<div>
							<p className="text-sm text-muted-foreground">Voltage</p>
							<p className="text-lg font-semibold">{voltage.toFixed(1)} V</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Current</p>
							<p
								className={cn(
									"text-lg font-semibold transition-colors duration-500",
									isCharging ? "text-green-400" : isDischarging ? "text-orange-400" : ""
								)}
							>
								{isCharging ? "+" : isDischarging ? "-" : ""}
								{Math.abs(current).toFixed(2)} A
							</p>
						</div>
					</div>

					{/* Status indicator */}
					<div className="flex items-center justify-center gap-2 pt-2">
						<div
							className={cn(
								"h-2 w-2 rounded-full transition-all duration-500",
								isCharging
									? "bg-green-400 animate-pulse"
									: isDischarging
										? "bg-orange-400 animate-pulse"
										: "bg-muted-foreground"
							)}
						/>
						<span className="text-sm text-muted-foreground">
							{isCharging ? "Charging" : isDischarging ? "Discharging" : "Idle"}
						</span>
					</div>
				</div>
			</CardContent>

			<style>{`
				@keyframes shimmer {
					0% { transform: translateX(-100%); }
					100% { transform: translateX(200%); }
				}
			`}</style>
		</Card>
	);
}

