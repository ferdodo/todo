import { useState, useEffect } from "react";

const SWIPE_THRESHOLD = 80;
const MIN_SWIPE_DISTANCE = 0;

const shouldTrackMovement = (touchStart: number | null, clientX: number): boolean => {
	return touchStart !== null && Math.abs(clientX - touchStart) > MIN_SWIPE_DISTANCE;
};

const shouldProcessSwipe = (
	touchStart: number | null,
	touchMoved: boolean,
): touchStart is number => {
	return touchStart !== null && touchMoved;
};

interface UseSwipeOutOptions {
	onDone: () => void;
	onPostpone: () => void;
}

interface UseSwipeOutReturn {
	swipeOffset: number;
	swipeOutStyle: React.CSSProperties;
	swipeOutDirection: "left" | "right" | null;
	handleTouchStart: (e: React.TouchEvent<HTMLElement>) => void;
	handleTouchMove: (e: React.TouchEvent<HTMLElement>) => void;
	handleTouchEnd: (e: React.TouchEvent<HTMLElement>) => void;
}

export function useSwipeOut({ onDone, onPostpone }: UseSwipeOutOptions): UseSwipeOutReturn {
	const [touchStart, setTouchStart] = useState<number | null>(null);
	const [touchCurrent, setTouchCurrent] = useState<number | null>(null);
	const [touchMoved, setTouchMoved] = useState(false);
	const [swipeOutDirection, setSwipeOutDirection] = useState<"left" | "right" | null>(null);
	const [swipeOutHandler, setSwipeOutHandler] = useState<(() => void) | null>(null);

	useEffect(() => {
		if (!swipeOutDirection || !swipeOutHandler) return;
		const timer = setTimeout(swipeOutHandler, 600);
		return () => clearTimeout(timer);
	}, [swipeOutDirection, swipeOutHandler]);

	const handleTouchStart = (e: React.TouchEvent<HTMLElement>): void => {
		const clientX = e.touches[0].clientX;
		setTouchStart(clientX);
		setTouchCurrent(clientX);
		setTouchMoved(false);
	};

	const handleTouchMove = (e: React.TouchEvent<HTMLElement>): void => {
		const clientX = e.touches[0].clientX;
		setTouchCurrent(clientX);
		if (shouldTrackMovement(touchStart, clientX)) {
			setTouchMoved(true);
		}
	};

	const handleTouchEnd = (e: React.TouchEvent<HTMLElement>): void => {
		if (!shouldProcessSwipe(touchStart, touchMoved)) {
			setTouchStart(null);
			setTouchCurrent(null);
			setTouchMoved(false);
			return;
		}

		const diff = e.changedTouches[0].clientX - touchStart;

		if (diff > SWIPE_THRESHOLD) {
			setSwipeOutDirection("right");
			setSwipeOutHandler(() => onDone);
		} else if (diff < -SWIPE_THRESHOLD) {
			setSwipeOutDirection("left");
			setSwipeOutHandler(() => onPostpone);
		}

		setTouchStart(null);
		setTouchCurrent(null);
		setTouchMoved(false);
	};

	const swipeOffset = swipeOutDirection
		? swipeOutDirection === "right"
			? window.innerWidth
			: -window.innerWidth
		: touchStart !== null && touchCurrent !== null
			? touchCurrent - touchStart
			: 0;

	const swipeOutStyle = swipeOutDirection
		? { transition: "transform 2s ease-out" }
		: { transition: "transform 100ms linear" };

	return {
		swipeOffset,
		swipeOutStyle,
		swipeOutDirection,
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd,
	};
}
