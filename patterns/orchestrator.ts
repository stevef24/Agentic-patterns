import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import "dotenv/config";

const planSchema = z.object({
	files: z.array(
		z.object({
			purpose: z.string(),
			filePath: z.string(),
			changeType: z.enum(["create", "modify", "delete"]),
		})
	),
	estimatedComplexity: z.enum(["low", "medium", "high"]),
});

export async function implementFeature(featureRequest: string) {
	const { object: plan } = await generateObject({
		model: openai("o3-mini"),
		schema: planSchema,
		system:
			"You are a senior software architect creating implementation plans.",
		prompt: `Plan the implementation for this feature request:
    "${featureRequest}"`,
	});

	const changes = await Promise.all(
		plan.files.map(async (file) => {
			const promptType = {
				create: "You are a frontend engineer writing clean new components.",
				modify: "You are improving existing code with care.",
				delete: "You are carefully removing outdated or redundant code.",
			}[file.changeType];

			const { object: implementation } = await generateObject({
				model: openai("gpt-4o"),
				system: promptType,
				schema: z.object({ explanation: z.string(), code: z.string() }),
				prompt: `Please implement the following for file: ${file.filePath}
Purpose: ${file.purpose}

Feature context: ${featureRequest}`,
			});

			return { file, implementation };
		})
	);

	return {
		plan,
		changes,
	};
}

implementFeature(
	"Add a new feature to the app that allows users to add a new task to the list."
).then(console.log);
