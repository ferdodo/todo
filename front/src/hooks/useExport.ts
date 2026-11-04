import { useState, useCallback } from "react";
import { exportTasks } from "@todo/core";
import { useTodoContext } from "./useTodoContext";

export function useExport(): {
	isLoading: boolean;
	message: string;
	isSuccess: boolean;
	handleExport: () => Promise<void>;
} {
	const context = useTodoContext();
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [isSuccess, setIsSuccess] = useState(false);

	const handleExport = useCallback(async (): Promise<void> => {
		setIsLoading(true);
		setMessage("");
		setIsSuccess(false);

		try {
			const json = exportTasks(context);

			const blob = new Blob([json], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `tasks-export-${new Date().toISOString().slice(0, 10)}.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			setMessage("Tasks exported successfully!");
			setIsSuccess(true);
		} catch (error) {
			setMessage(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
			setIsSuccess(false);
		} finally {
			setIsLoading(false);
		}
	}, [context]);

	return { isLoading, message, isSuccess, handleExport };
}
