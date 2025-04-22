# Agentic Patterns

## Setup

1.  **Install Dependencies:** Run `pnpm install` in the project root to install all necessary packages.
2.  **Setup Environment File:** Copy or rename the `.env.example` file to `.env` in the root directory. You can use the following command:
    ```bash
    mv .env.example .env
    ```
3.  **Add API Keys:** Populate the `.env` file with the necessary API keys for the services you intend to use (e.g., OpenAI, Anthropic, Gemini). It should look something like this:

    ```dotenv
    OPENAI_API_KEY=your_openai_key_here
    ANTHROPIC_API_KEY=your_anthropic_key_here
    GEMINI_API_KEY=your_gemini_key_here
    # Add other keys as needed
    ```

## Running Patterns

Once your environment is set up, you can run any pattern script located in the `patterns/` directory using `pnpm` and `tsx`.

Navigate to the project root in your terminal and execute the desired script like so:

```bash
pnpm tsx patterns/your-pattern-file.ts
```

For example, to run the parallel processing pattern:

```bash
pnpm tsx patterns/parallel-processing.ts
```
