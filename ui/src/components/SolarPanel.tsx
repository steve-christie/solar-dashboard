import { Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface SolarPanelProps {
	power?: number;
	voltage?: number;
	current?: number;
	className?: string;
}

/**
 * SolarPanel component displays solar power generation data with visual graphics
 */
export function SolarPanel({ power = 0, voltage = 0, current = 0, className }: SolarPanelProps) {
	const powerKw = (power / 1000).toFixed(2);
	const isActive = power > 0;

	return (
		<Card className={cn("relative overflow-hidden", className)}>
			{/* Animated background gradient */}
			<div
				className={cn(
					"absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent transition-opacity duration-500",
					isActive ? "opacity-100" : "opacity-0"
				)}
			/>
			
			<CardHeader className="relative">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Sun
							className={cn(
								"h-6 w-6 transition-all duration-500",
								isActive ? "text-yellow-400 animate-pulse" : "text-muted-foreground"
							)}
						/>
						Solar Generation
					</CardTitle>
					<div
						className={cn(
							"h-2 w-2 rounded-full transition-all duration-500",
							isActive ? "bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50" : "bg-muted-foreground"
						)}
					/>
				</div>
			</CardHeader>

			<CardContent className="relative">
				<div className="space-y-4">
					{/* Main power display */}
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-bold text-yellow-400">{powerKw}</span>
						<span className="text-lg text-muted-foreground">kW</span>
					</div>

					{/* Visual power indicator */}
					<div className="relative h-3 bg-muted rounded-full overflow-hidden">
						<div
							className={cn(
								"h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000 ease-out",
								isActive ? "shadow-lg shadow-yellow-400/50" : ""
							)}
							style={{
								width: `${Math.min((power / 5000) * 100, 100)}%`, // Assuming max 5kW for visualization
							}}
						/>
					</div>

					{/* Detailed metrics */}
					<div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
						<div>
							<p className="text-sm text-muted-foreground">Voltage</p>
							<p className="text-lg font-semibold">{voltage.toFixed(1)} V</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Current</p>
							<p className="text-lg font-semibold">{current.toFixed(2)} A</p>
						</div>
					</div>

					{/* Solar panel visualization */}
					<div className="pt-4">
						<div className="relative h-20 bg-gradient-to-b from-yellow-500/20 to-transparent rounded-lg border border-yellow-500/30 overflow-hidden">
							{/* Grid pattern representing solar panels */}
							<svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
								{Array.from({ length: 4 }).map((_, i) => (
									<g key={i}>
										<line
											x1="0"
											y1={(i + 1) * 20}
											x2="100"
											y2={(i + 1) * 20}
											stroke="currentColor"
											strokeWidth="0.5"
											className="text-yellow-500/30"
										/>
										<line
											x1={(i + 1) * 20}
											y1="0"
											x2={(i + 1) * 20}
											y2="100"
											stroke="currentColor"
											strokeWidth="0.5"
											className="text-yellow-500/30"
										/>
									</g>
								))}
							</svg>
							{/* Animated shine effect */}
							{isActive && (
								<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite] -translate-x-full" />
							)}
						</div>
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

