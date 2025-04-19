import { openai } from "@ai-sdk/openai";
import { generateText, generateObject } from "ai";
import { z } from "zod";

const model = openai("gpt-4o");

export async function reviewCode(code: string) {
	const [security, performance, maintainability] = await Promise.all([
		generateObject({
			model,
			system: "You are a security reviewer. Spot security issues.",
			schema: z.object({ issues: z.array(z.string()) }),
			prompt: `Review for security issues: ${code}`,
		}),
		generateObject({
			model,
			system: "You are a performance reviewer. Find performance bottlenecks.",
			schema: z.object({ issues: z.array(z.string()) }),
			prompt: `Review for performance issues: ${code}`,
		}),
		generateObject({
			model,
			system:
				"You are a quality reviewer. Focus on readability and best practices.",
			schema: z.object({ issues: z.array(z.string()) }),
			prompt: `Review for maintainability: ${code}`,
		}),
	]);

	const allReviews = [
		{ type: "security", ...security.object },
		{ type: "performance", ...performance.object },
		{ type: "maintainability", ...maintainability.object },
	];

	const { text: summary } = await generateText({
		model,
		system: "You are a technical lead summarizing feedback from reviewers.",
		prompt: `Summarize the following code review results:
${JSON.stringify(allReviews, null, 2)}`,
	});

	return { reviews: allReviews, summary };
}
