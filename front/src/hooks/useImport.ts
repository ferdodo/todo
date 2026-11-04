import { useState } from "react";
import { useTodoContext } from "./useTodoContext";
import { importHabiticaTasks } from "@todo/core";
import { createBrowserService } from "@todo/browser";

interface UseImportReturn {
	isLoading: boolean;
	message: string;
	isSuccess: boolean;
	handleImport: () => Promise<void>;
}

export function useImport(): UseImportReturn {
	const context = useTodoContext();
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [isSuccess, setIsSuccess] = useState(false);

	const handleImport = async (): Promise<void> => {
		setIsLoading(true);
		setMessage("");
		setIsSuccess(false);

		try {
			const browserService = createBrowserService();
			const result = await importHabiticaTasks(browserService, context);

			if (result.errors.length > 0) {
				setMessage(
					`Imported ${result.imported} tasks with ${result.errors.length} error(s): ${result.errors.join("; ")}`,
				);
			} else {
				setMessage(`Successfully imported ${result.imported} tasks!`);
				setIsSuccess(true);
			}
		} catch (error) {
			setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, message, isSuccess, handleImport };
}
