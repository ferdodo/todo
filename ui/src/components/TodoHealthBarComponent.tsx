import type { ReactNode } from "react";
import styles from "./TodoHealthBarComponent.module.css";

interface TodoHealthBarComponentProps {
	healthPercent: number;
	healthLoss: number;
}

export function TodoHealthBarComponent({
	healthPercent: _healthPercent,
	healthLoss: _healthLoss,
}: TodoHealthBarComponentProps): ReactNode {
	const healthPercent = Math.floor(_healthPercent - _healthLoss);
	const healthLoss = Math.floor(_healthPercent);
	const background = `linear-gradient(90deg, var(--color-red) ${healthPercent}%, var(--color-red-strong) ${healthPercent}%, var(--color-red-strong) ${healthLoss}%, var(--color-minimal) ${healthLoss}%)`;

	return (
		<div className={styles.container}>
			<div className={styles.health} style={{ background }} />
			<div className={styles.healthBase}></div>
			<div className={styles.heart}>♥︎</div>
		</div>
	);
}
