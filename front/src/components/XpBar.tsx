import type { ReactNode } from "react";
import { TodoXpBarComponent } from "@todo/ui";
import { useHero } from "../hooks/useHero";
import { useHeroStats } from "../hooks/useHeroStats";

export function XpBar(): ReactNode {
	const hero = useHero();
	const stats = useHeroStats();

	return (
		<TodoXpBarComponent
			level={hero.level}
			xp={hero.xp}
			gainedXp={stats.projectedXp}
		/>
	);
}
