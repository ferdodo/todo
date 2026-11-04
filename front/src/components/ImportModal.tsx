import { useEffect, type ReactNode } from "react";
import { TodoImportModal } from "@todo/ui";
import { useImport } from "../hooks/useImport";

interface ImportModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

export function ImportModal({ isOpen, onOpenChange }: ImportModalProps): ReactNode {
	const { isLoading, message, isSuccess, handleImport } = useImport();

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
		<TodoImportModal
			isOpen={isOpen}
			isLoading={isLoading}
			message={message}
			isSuccess={isSuccess}
			onClose={handleClose}
			onImport={handleImport}
		/>
	);
}
