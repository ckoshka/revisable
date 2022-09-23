export type Revisable<T> = T & {
	revise: (settings: Partial<T>) => Revisable<T>;
	map: <K extends keyof T>(
		key: K,
	) => (fn: (a0: T[K]) => T[K]) => Revisable<T>;
	extend: <Rec extends Record<string, unknown>>(
		mapfn: (a0: T) => Rec,
	) => Revisable<T & Rec>;
};

export const revisable = <T>(t: T): Revisable<T> => ({
	...t,
	map: <K extends keyof T>(key: K) =>
		(fn: (a0: T[K]) => T[K]) =>
			revisable({
				...t,
				...{ [key]: fn(t[key]) } as Record<K, T[K]>,
			}),
	extend: <Rec extends Record<string, unknown>>(mapfn: (a0: T) => Rec) =>
		revisable(
			{
				...t,
				...mapfn(t),
			} as T & Rec,
		),
	revise: (settings: Partial<T>) =>
		revisable({
			...t,
			...settings,
		}),
});
