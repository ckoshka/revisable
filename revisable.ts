import { produce } from "./deps.ts";

export type Revisable<T> = {
	revise: (settings: Partial<T>) => Revisable<T>;

	map: <K extends keyof T, Output>(
		key: K,
		fn: (a0: T[K]) => Output,
	) => Revisable<Omit<T, K> & Record<K, Output>>;

	mapR: <K extends keyof T, Output>(
		key: K,
		fn: (a0: Revisable<T[K]>) => Revisable<Output>,
	) => Revisable<Omit<T, K> & Record<K, Output>>;

	extend: <Rec extends Record<string, unknown>>(
		mapfn: (a0: T) => Rec,
	) => Revisable<Omit<T, keyof Rec> & Rec>;
	
	delete: <K extends keyof T>(key: K) => Revisable<Omit<T, K>>;

	contents: T;

	modify: (draft: (a0: T) => void | T) => Revisable<T>;
};

export const revisable = <T>(t: T): Revisable<T> => ({
	contents: { ...t },

	map: <K extends keyof T, Output>(key: K, fn: (a0: T[K]) => Output) =>
		revisable({
			...t,
			...{ [key]: fn(t[key]) } as Record<K, Output>,
		}) as Revisable<Omit<T, K> & Record<K, Output>>,

	mapR: <K extends keyof T, Output>(
		key: K,
		fn: (a0: Revisable<T[K]>) => Revisable<Output>,
	) => revisable({
		...t,
		...{ [key]: fn(revisable(t[key])).contents } as Record<K, Output>,
	}) as Revisable<Omit<T, K> & Record<K, Output>>,

	extend: <Rec extends Record<string, unknown>>(mapfn: (a0: T) => Rec) =>
		revisable(
			{
				...t,
				...mapfn(t),
			} as Omit<T, keyof Rec> & Rec,
		),

	revise: (settings: Partial<T>) =>
		revisable({
			...t,
			...settings,
		}),

	delete: <K extends keyof T>(key: K): Revisable<Omit<T, K>> => {
		const copy = {...t};
		delete copy[key];
		return revisable({...copy}) as unknown as Revisable<Omit<T, K>>;
	},

	modify: (draft: (a0: T) => void | T) =>
			revisable(produce(t, draft))
});
