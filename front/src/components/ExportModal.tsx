import { useEffect, type ReactNode } from "react";
import { TodoExportModal } from "@todo/ui";
import { useExport } from "../hooks/useExport";

interface ExportModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

export function ExportModal({ isOpen, onOpenChange }: ExportModalProps): ReactNode {
	const { isLoading, message, isSuccess, handleExport } = useExport();

	useEffect(() => {
		if (isSuccess) {
			const timer = setTimeout(() => onOpenChange(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [isSuccess, onOpenChange]);

	const handleClose = (): void => {
		if (!isLoading) onOpenChange(false);
	};

	return (
		<TodoExportModal
			isOpen={isOpen}
			isLoading={isLoading}
			message={message}
			isSuccess={isSuccess}
			onClose={handleClose}
			onExport={handleExport}
		/>
	);
}
