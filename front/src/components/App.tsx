import type { ReactNode } from "react";
import { getBrowserService } from "@todo/browser";
import { TodoApp } from "./TodoApp";
import { DesktopNotice } from "./DesktopNotice";
import styles from "./App.module.css";

export function App(): ReactNode {
	const isDesktop = getBrowserService().getDevice().startsWith("desktop-");

	return (
		<div className={styles.app}>
			{isDesktop ? <DesktopNotice /> : <TodoApp />}
		</div>
	);
}
