import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import "dotenv/config";

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

const testDiffWithoutPrefixLongEnough = `\
diff --git a/config.yaml b/config.yaml
index e69de29..e8a4ef4 100644
--- a/config.yaml
+++ b/config.yaml
@@ -0,0 +1 @@
+enableFeatureX: true
`;

console.log("\n--- Testing diff without prefix (but long enough) ---");
generateCommitMessage(testDiffWithoutPrefixLongEnough).then(console.log);
