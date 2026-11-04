import { useState, useEffect } from "react";

type OverflowValue = "visible" | "hidden";

interface UseAppearanceAnimationReturn {
	getMaxHeight: (maxHeightWhenVisible: number, isSwiped: boolean) => number;
	getOverflow: (isSwiped: boolean) => OverflowValue;
}

export function useAppearanceAnimation(): UseAppearanceAnimationReturn {
	const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
	const [hasAnimatedInFinished, setHasAnimatedInFinished] = useState(false);

	useEffect(() => {
		requestAnimationFrame(() => {
			setHasAnimatedIn(true);
		});
	}, []);

	useEffect(() => {
		setTimeout(() => {
			setHasAnimatedInFinished(true)
		}, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--transform-duration')))
	}, [])

	const getMaxHeight = (maxHeightWhenVisible: number, isSwiped: boolean): number => {
		if (isSwiped) return 0;
		return hasAnimatedIn ? maxHeightWhenVisible : 0;
	};

	const getOverflow = (isSwiped: boolean): OverflowValue => {
		if (isSwiped || !hasAnimatedIn || !hasAnimatedInFinished) return "hidden";
		return "visible";
	};

	return {
		getMaxHeight,
		getOverflow,
	};
}
