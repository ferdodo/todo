import { useState, useEffect } from "react";
import { useTodoContext } from "./useTodoContext";
import type { Hero } from "@todo/core";

export function useHero(): Hero {
	const context = useTodoContext();
	const [hero, setHero] = useState<Hero>(context.heroRepository.get());

	useEffect(() => {
		const unsubscribe = context.heroRepository.observe(setHero);
		return unsubscribe;
	}, [context.heroRepository]);

	return hero;
}
