import { openai } from "@ai-sdk/openai";
import { generateText, generateObject } from "ai";
import { z } from "zod";

export async function improveComment(code: string) {
	let comment = "";
	let iterations = 0;
	const MAX_TRIES = 3;

	const { text: initialComment } = await generateText({
		model: openai("gpt-4o-mini"),
		system: "You are a developer writing concise, helpful code comments.",
		prompt: `Write a single-line comment for this function:

${code}`,
	});

	comment = initialComment;

	while (iterations < MAX_TRIES) {
		const { object: evaluation } = await generateObject({
			model: openai("gpt-4o"),
			schema: z.object({
				clarity: z.number().min(1).max(10),
				correctness: z.boolean(),
				helpfulness: z.number().min(1).max(10),
				issues: z.array(z.string()),
				suggestions: z.array(z.string()),
			}),
			system:
				"You are reviewing a code comment for clarity, correctness, and usefulness.",
			prompt: `Review this comment for the following code:

Code:
${code}

Comment:
${comment}`,
		});

		if (
			evaluation.clarity >= 8 &&
			evaluation.correctness &&
			evaluation.helpfulness >= 8
		) {
			break;
		}

		const { text: improvedComment } = await generateText({
			model: openai("gpt-4o"),
			system: "You are improving the clarity and usefulness of code comments.",
			prompt: `Improve this comment:

${comment}

Based on this feedback:
${evaluation.issues.join("\n")}
${evaluation.suggestions.join("\n")}`,
		});

		comment = improvedComment;
		iterations++;
	}

	return {
		comment,
		iterations,
	};
}
