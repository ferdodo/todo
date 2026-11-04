import type { Hero, RecurringTask, PunctualTask } from "../entities";
import type { HeroStats } from "../types/HeroStats";
import { calculateHealthLoss } from "./calculateHealthLoss";
import { calculateXpGained } from "./calculateXpGained";

export function calculateHeroStats(
	hero: Hero,
	recurringTasks: RecurringTask[],
	punctualTasks: PunctualTask[],
): HeroStats {
	const healthPercent = (hero.health / 100) * 100;
	const healthLoss = calculateHealthLoss(recurringTasks, punctualTasks);
	const projectedHealth = Math.max(0, hero.health - healthLoss);
	const projectedHealthPercent = (projectedHealth / 100) * 100;

	const xpGained = calculateXpGained(recurringTasks, punctualTasks);
	const projectedXp = hero.xp + xpGained;
	const willLevelUp = projectedXp >= 100 && projectedHealth > 0;
	const projectedLevel = willLevelUp ? hero.level + 1 : hero.level;
	const projectedXpAfterLevelUp = willLevelUp ? projectedXp - 100 : projectedXp;

	return {
		healthPercent,
		healthLoss,
		projectedHealth,
		projectedHealthPercent,
		xpGained,
		projectedXp,
		willLevelUp,
		projectedLevel,
		projectedXpAfterLevelUp,
	};
}
