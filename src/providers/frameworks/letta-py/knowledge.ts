import type { FrameworkKnowledge } from "../index.js";
import type { ProjectConfig } from "../../../types.js";

export const getKnowledge = ({
  config: _config,
}: {
  config: ProjectConfig;
}): FrameworkKnowledge => ({
  setupInstructions: "pip install letta-client",

  knowledgeBase: `Always use the Letta Python SDK for stateful agents:

- Letta manages long-term memory and agent state
- Use memory blocks for self-editing memory
- Start with single agent, scale only when needed
- PostgreSQL for production, SQLite for development

Basic Usage:
from letta_client import Letta
client = Letta(api_key=os.getenv("LETTA_API_KEY"))
agent = client.agents.create()
response = client.agents.messages.create(agent_id=agent.id, messages=[...])
`,
});
