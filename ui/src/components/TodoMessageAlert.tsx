import type { ReactNode } from "react";

interface TodoMessageAlertProps {
	message: string;
	isSuccess: boolean;
}

export function TodoMessageAlert({ message, isSuccess }: TodoMessageAlertProps): ReactNode {
	return (
		<div
			style={{
				padding: "12px",
				marginBottom: "16px",
				borderRadius: "6px",
				backgroundColor: isSuccess ? "#d1fae5" : "#fee2e2",
				color: isSuccess ? "#065f46" : "#991b1b",
				fontSize: "14px",
			}}
		>
			{message}
		</div>
	);
}
