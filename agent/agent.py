import asyncio
import websockets
import json
import logging
import os
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

BACKEND_WS_URL = os.getenv("VETOS_BACKEND_WS", "ws://localhost:8000/ws/agent")
AGENT_TOKEN = os.getenv("VETOS_AGENT_TOKEN", "default-token")

async def handle_command(command):
    cmd_type = command.get("type")
    logger.info(f"Handling command: {cmd_type}")
    
    if cmd_type == "print":
        # Logic for printing (win32print or cups)
        logger.info(f"Printing: {command.get('content')}")
    elif cmd_type == "lab":
        # Logic for laboratory equipment
        logger.info("Initializing lab equipment communication")
    else:
        logger.warning(f"Unknown command type: {cmd_type}")

async def agent_main():
    while True:
        try:
            logger.info(f"Connecting to VetOS Backend at {BACKEND_WS_URL}...")
            async with websockets.connect(
                BACKEND_WS_URL,
                extra_headers={"Authorization": f"Bearer {AGENT_TOKEN}"}
            ) as websocket:
                logger.info("Connected to backend.")
                async for message in websocket:
                    command = json.loads(message)
                    await handle_command(command)
        except Exception as e:
            logger.error(f"Connection lost/failed: {e}. Retrying in 5 seconds...")
            await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(agent_main())
