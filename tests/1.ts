import { revisable } from "../revisable.ts";

`
revisable(null).map("key")
`;

const x = revisable({
	domainName: "https://watch-hamsters-cagefight.com",
	videoName: `Fluffy annihilated in 1:1 with Chestnut`,
	checkCache: true,
	storageSettings: {
		directory:
			"/Users/ckoshka/videos/rodents/hamsters/fluffy_1v1_chestnut.mp4",
	},
})
	.map("checkCache", (b) => !b)
	.mapR("storageSettings", (settings) =>
		settings.map("directory", (dir) => dir.replace(".mp4", ".mp4.gz"))
	)
	.extend(() => ({ checkCache: 4 }))
	.extend(({ domainName }) =>
		domainName.startsWith("https") ? { encrypt: true } : { encrypt: false }
	)
    .map("encrypt", bool => bool ? "SHA-1" : "none")

type inferredAsNumber = typeof x.contents.checkCache extends number ? true : false;
type inferredNewProperty = typeof x.contents.encrypt extends "SHA-1" | "none" ? true : false; 
const _d: inferredAsNumber & inferredNewProperty = true;