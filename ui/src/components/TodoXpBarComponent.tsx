import type { ReactNode } from "react";
import styles from "./TodoXpBarComponent.module.css";

interface TodoXpBarComponentProps {
	level: number;
	xp: number;
	gainedXp: number;
}

export function TodoXpBarComponent({
	level,
	xp: _xp,
	gainedXp: _gainedXp,
}: TodoXpBarComponentProps): ReactNode {
	const xp = Math.max(Math.floor(_xp), 1);
	const gainedXp = Math.floor(_gainedXp);
	const background = `linear-gradient(90deg, var(--color-blue) ${xp}%, var(--color-blue-weak) ${xp}%, var(--color-blue-weak) ${gainedXp}%, var(--color-minimal) ${gainedXp}%)`;

	return (
		<div className={styles.container}>
			<div className={styles.xp} style={{ background }} />
			<div className={styles.xpBase}></div>
			<div className={styles.level}>{level}</div>
		</div>
	);
}