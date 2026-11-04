import { useState, useEffect, type ReactNode } from "react";
import { TodoHabiticaImportModal } from "@todo/ui";
import { useHabiticaImport } from "../hooks/useHabiticaImport";

export function HabiticaImportModal(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const { isLoading, message, isSuccess, handleImport } = useHabiticaImport();

	useEffect(() => {
		if (isSuccess) {
			const timer = setTimeout(() => setIsOpen(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [isSuccess]);

	const handleClose = (): void => {
		if (!isLoading) setIsOpen(false);
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				style={{
					backgroundColor: "var(--color-green)",
				}}
			>
				Import Habitica
			</button>

			<TodoHabiticaImportModal
				isOpen={isOpen}
				isLoading={isLoading}
				message={message}
				isSuccess={isSuccess}
				onClose={handleClose}
				onImport={handleImport}
			/>
		</>
	);
}
