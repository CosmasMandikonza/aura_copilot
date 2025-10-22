#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  type CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';

/**
 * Minimal MCP server that exposes AURA Copilot insights
 * Tool: analyze_wallet({ address })
 */
const server = new Server(
  { name: 'aura-copilot-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// List tools for the client (Claude Desktop, etc.)
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze_wallet',
        description:
          'Analyze a wallet for DeFi opportunities using AURA Copilot (calls /api/insights).',
        inputSchema: {
          type: 'object',
          properties: {
            address: {
              type: 'string',
              description: 'Ethereum address (0x…) or ENS name',
            },
          },
          required: ['address'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (req): Promise<CallToolResult> => {
  const tool = req.params.name;
  if (tool !== 'analyze_wallet') {
    throw new Error(`Unknown tool: ${tool}`);
  }

  const address = String((req.params.arguments as any)?.address ?? '').trim();
  if (!address) throw new Error('Missing "address"');

  // Your Next.js app should be running locally
  const url = `http://localhost:3000/api/insights?address=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Insights failed: ${res.status} ${await res.text()}`);
  const data = await res.json();

  return {
    // MCP text content
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
});

const transport = new StdioServerTransport();
server.connect(transport);

