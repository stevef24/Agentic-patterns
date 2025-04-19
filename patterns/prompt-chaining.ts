import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

const model = openai("gpt-4o");

export async function generateCommitMessage(diff: string) {
	const { text: commit } = await generateText({
		model,
		prompt: `Generate a Git commit message for the following diff:

${diff}`,
	});

	const validPrefixes = ["feat", "fix", "refactor", "docs"];
	const hasPrefix = validPrefixes.some((prefix) =>
		commit.toLowerCase().startsWith(prefix)
	);

	if (!hasPrefix || commit.length < 20) {
		const { text: improved } = await generateText({
			model,
			prompt: `Improve the following commit message to follow conventional commits (e.g. 'feat: ...', 'fix: ...') and make it clearer:

${commit}`,
		});

		return improved;
	}

	return commit;
}
