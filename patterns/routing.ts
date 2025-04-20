import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import "dotenv/config";

const classificationSchema = z.object({
	type: z.enum(["code", "creative", "search"]),
	reasoning: z.string(),
});
export async function handleQuery(query: string) {
	const { object: classification } = await generateObject({
		model: openai("gpt-4o"),
		schema: classificationSchema,
		prompt: `Analyze the following user query and determine what kind of task it is:

"${query}"

Classify the query as one of the following types:
- code (e.g. write or fix code)
- creative (e.g. storytelling or ad copy)
- search (e.g. finding a specific fact or answer from context)

Also explain why you chose that classification.`,
	});

	const modelMap = {
		code: anthropic("claude-3-sonnet-20240229"),
		creative: openai("gpt-4o"),
		search: google("gemini-1.5-pro-latest"),
	};

	const model = modelMap[classification.type] ?? openai("gpt-4o-mini");

	const { text: response } = await generateText({
		model,
		prompt: query,
	});

	return { response, classification };
}

handleQuery("What is the capital of France?").then(console.log);
