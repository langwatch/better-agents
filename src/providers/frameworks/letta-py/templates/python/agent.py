"""Letta Python Agent Template

This template shows how to create a stateful Letta agent using the Python SDK.
Letta agents maintain persistent memory and learn from past conversations.
"""

import os
from letta_client import Letta


def create_agent():
    """
    Creates a Letta agent with memory blocks and tools.
    
    Returns:
        agent_state: The created agent state object with agent ID
    """
    # Initialize Letta client with API key from environment
    client = Letta(api_key=os.getenv("LETTA_API_KEY"))
    
    # Create agent with memory blocks and tools
    agent_state = client.agents.create(
        model="openai/gpt-4",
        embedding="openai/text-embedding-3-small",
        memory_blocks=[
            {
                "label": "human",
                "value": "User: Name and current status"
            },
            {
                "label": "persona",
                "value": "I am a helpful Letta agent built with Better Agents."
            }
        ],
        tools=["web_search", "run_code"]
    )
    
    return agent_state


def message_agent(agent_id: str, user_message: str) -> dict:
    """
    Send a message to an agent and get its response.
    
    Args:
        agent_id: The ID of the agent to message
        user_message: The user's message
        
    Returns:
        dict: The response containing messages, tool calls, and reasoning steps
    """
    client = Letta(api_key=os.getenv("LETTA_API_KEY"))
    
    # Send message to agent
    response = client.agents.messages.create(
        agent_id=agent_id,
        input=user_message
    )
    
    return response


if __name__ == "__main__":
    # Example usage
    print("Creating Letta agent...")
    agent = create_agent()
    print(f"Agent created with ID: {agent.id}")
    
    # Send a test message
    print(f"\nMessaging agent...")
    response = message_agent(agent.id, "Hello! What can you do?")
    
    # Print response messages
    for message in response.messages:
        print(f"{message.get('message_type', 'message')}: {message.get('content', message.get('reasoning', ''))}")
