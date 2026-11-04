import { useMemo, useState, useEffect } from "react";
import { useTodoContext } from "./useTodoContext";
import { calculateHeroStats } from "@todo/core";
import type { HeroStats } from "@todo/core";
import type { Hero } from "@todo/core";
import { useRecurringTasks } from "./useRecurringTasks";
import { usePunctualTasks } from "./usePunctualTasks";

export function useHeroStats(): HeroStats {
	const context = useTodoContext();
	const [hero, setHero] = useState<Hero>(context.heroRepository.get());
	const recurringTasks = useRecurringTasks();
	const punctualTasks = usePunctualTasks();

	useEffect(() => {
		const unsubscribe = context.heroRepository.observe(setHero);
		return unsubscribe;
	}, [context.heroRepository]);

	return useMemo(
		() => calculateHeroStats(hero, recurringTasks, punctualTasks),
		[hero, recurringTasks, punctualTasks]
	);
}
