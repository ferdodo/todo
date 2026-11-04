import type { ReactNode } from "react";
import { TodoHealthBarComponent } from "@todo/ui";
import { useHeroStats } from "../hooks/useHeroStats";
import { useHero } from "../hooks/useHero";

export function HealthBar(): ReactNode {
	const hero = useHero();
	const stats = useHeroStats();

	return (
		<TodoHealthBarComponent
			healthPercent={hero.health}
			healthLoss={stats.healthLoss}
		/>
	);
}
