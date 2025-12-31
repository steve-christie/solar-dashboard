import { useState, useEffect } from "react";
import { X, Code2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface DebugDrawerProps {
	data: unknown;
}

/**
 * DebugDrawer component provides a slide-out drawer for viewing raw JSON data
 */
export function DebugDrawer({ data }: DebugDrawerProps) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDrawer = () => {
		setIsOpen(!isOpen);
	};

	const closeDrawer = () => {
		setIsOpen(false);
	};

	// Handle ESC key to close drawer
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				closeDrawer();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			// Prevent body scroll when drawer is open
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	const jsonString = JSON.stringify(data, null, 2);

	return (
		<>
			{/* Debug Button - Fixed position */}
			<Button
				onClick={toggleDrawer}
				variant="outline"
				size="icon"
				className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
				title="Debug: View Raw JSON"
			>
				<Code2 className="h-5 w-5" />
			</Button>

			{/* Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
					onClick={closeDrawer}
					aria-hidden="true"
				/>
			)}

			{/* Drawer */}
			<div
				className={cn(
					"fixed top-0 right-0 h-full w-full max-w-2xl bg-card border-l border-border z-50 shadow-2xl transition-transform duration-300 ease-in-out transform",
					isOpen ? "translate-x-0" : "translate-x-full"
				)}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Drawer Header */}
				<div className="flex items-center justify-between p-4 border-b border-border">
					<div className="flex items-center gap-2">
						<Code2 className="h-5 w-5 text-muted-foreground" />
						<h2 className="text-lg font-semibold">Debug: Raw Inverter Data</h2>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={closeDrawer}
						className="h-8 w-8"
						title="Close drawer (ESC)"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>

				{/* Drawer Content */}
				<div className="h-[calc(100%-4rem)] overflow-auto p-4">
					<pre className="text-sm font-mono text-foreground whitespace-pre-wrap break-words bg-muted/50 p-4 rounded-lg border border-border overflow-auto">
						{jsonString}
					</pre>
				</div>
			</div>
		</>
	);
}

