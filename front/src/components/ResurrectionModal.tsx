import { useState, useEffect, type ReactNode } from "react";
import { TodoResurrectionModal } from "@todo/ui";
import { resurrectHero } from "@todo/core";
import { useTodoContext } from "../hooks/useTodoContext";

export function ResurrectionModal(): ReactNode {
	const context = useTodoContext();
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const unsubscribe = context.heroRepository.observe((hero) => {
			setIsOpen(hero.health <= 0);
		});
		const hero = context.heroRepository.get();
		setIsOpen(hero.health <= 0);
		return unsubscribe;
	}, [context.heroRepository]);

	const handleResurrect = (): void => {
		resurrectHero(context);
		setIsOpen(false);
	};

	const handleCancel = (): void => {
		setIsOpen(false);
	};

	return (
		<TodoResurrectionModal
			isOpen={isOpen}
			onResurrect={handleResurrect}
			onCancel={handleCancel}
		/>
	);
}
