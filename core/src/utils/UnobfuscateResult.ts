export type UnobfuscateResult = 
	| { result: { code: string } }
	| { result: "error"; hint: string };
