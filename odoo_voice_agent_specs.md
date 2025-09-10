# Odoo Voice Agent - Technical Specification Document

## 1. Executive Summary

### Project Overview

The Odoo Voice Agent is an innovative voice-controlled interface for Odoo ERP systems that enables users to interact with their business management platform through natural language voice commands. The system leverages OpenAI's Realtime Agent for voice processing and the Model Context Protocol (MCP) for seamless Odoo integration.

### Business Objectives

- **Hands-free Operation**: Enable users to perform Odoo operations without manual input
- **Efficiency**: Accelerate common ERP tasks through voice commands
- **User Experience**: Provide a modern, intuitive interface for ERP interaction

## 2. Technical Architecture

### System Overview

The architecture follows a modern microservices approach with clear separation of concerns:

```
┌─────────────────────┐
│   User (Voice)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Voice Agent UI     │  ← Next.js Frontend
│  (odoo-voice-agent) │     - React 19.1.0
└──────────┬──────────┘     - TypeScript
           │
           ├─────────────────┐
           ▼                 ▼
┌─────────────────────┐  ┌─────────────────────┐
│  OpenAI Realtime    │  │   MCP Server        │
│      Agent          │  │ (odoo-mcp-server)   │
└─────────────────────┘  └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Odoo ERP          │
                         │   (JSON-RPC)        │
                         └─────────────────────┘
```

### System Communication Flow

1. **Upstream Flow**:

   - User speaks commands into the microphone
   - Voice data flows via WebRTC to OpenAI
   - AI agent interprets natural language commands
   - MCP server translates commands to Odoo operations via JSON-RPC
   - Odoo processes requests and returns results

2. **Downstream Flow**:
   - Odoo sends response data to MCP Server
   - MCP Server formats data for AI consumption
   - OpenAI generates natural language response
   - Response is transmitted via WebRTC to the user's device
   - Audio output delivers feedback to the user

## 3. Technology Stack

### Frontend (Voice Agent)

- **Framework**: Next.js
- **UI Library**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Voice Integration**: @openai/agents
- **AI SDK**: @ai-sdk/openai
- **Validation**: Zod

### Backend (MCP Server)

- **Framework**: Next.js (API Routes)
- **Protocol**: Model Context Protocol (MCP)
- **MCP Adapter**: @vercel/mcp-adapter
- **JSON-RPC Client**: Jayson -> used to interact with Odoo server
- **AI Integration**: ai (vercel AI SDK)
- **Language**: TypeScript
- **Validation**: Zod

### External Services

- **Voice Processing**: OpenAI Realtime Agent
- **ERP System**: Odoo (via JSON-RPC)
- **Session Storage**: Redis (for MCP session management)
- **Database**: SQL, Convex or anything that supports vectors embeddings

## 4. Feature Specifications & API Integration

### Voice Interaction Capabilities

- **Voice Commands**: Natural language processing for ERP operations
- **Real-time Feedback**: Immediate audio responses to user queries
- **Mute/Unmute Control**: User-controlled voice input toggle
- **Voice Recorder**: Voice recorder for AI-user interactions, useful for tracking changes done on Odoo db
- **Text Input**: Manual text input option for commands. Useful for inputs where correct spelling is crucial

### Odoo ERP Operations & API Specifications

#### 1. Connection Management

**API Tool: connectToOdoo**

```typescript
Input: {
  url: string;      // Odoo instance URL
  db: string;       // Database name
  username: string; // User credentials
  password: string;
}
Output: {
  success: boolean;
  connection?: OdooConnection;
  serverInfo?: any;
}
```

#### 2. Model Introspection

**API Tool: getModelFields**

```typescript
Input: {
	model: string; // Odoo model name
	connection: OdooConnection;
}
Output: {
	fields: Record<string, FieldDefinition>;
}
```

#### 3. CRUD Operations

**Create - API Tool: createRecords**

```typescript
Input: {
  model: string;
  records: Record<string, any>[];
  connection: OdooConnection;
}
Output: {
  ids: number[];
  success: boolean;
}
```

**Read - API Tool: smartSearch**

```typescript
Input: {
  model: string;
  searchQuery: string;
  fields?: string[];
  limit?: number;
  connection: OdooConnection;
}
Output: {
  records: any[];
  count: number;
}
```

**Update - API Tool: updateRecord**

```typescript
Input: {
	model: string;
	id: number;
	values: Record<string, any>;
	connection: OdooConnection;
}
Output: {
	success: boolean;
}
```

**Delete - API Tool: deleteRecord**

```typescript
Input: {
	model: string;
	id: number;
	connection: OdooConnection;
}
Output: {
	success: boolean;
}
```

### Authentication Flow

1. **Client Request**: User initiates voice session
2. **Ephemeral Key Generation**: Backend generates temporary OpenAI API key
3. **Session Establishment**: WebRTC connection established with OpenAI
4. **MCP Tool Registration**: Voice agent registers available Odoo tools
5. **Odoo Authentication**: User provides Odoo credentials via voice
6. **Session Maintenance**: Connection persisted for operation duration

### Real-time Communication

- **WebRTC Integration**: Low-latency voice streaming
- **Ephemeral Key Management**: Secure, temporary API keys
- **Session Persistence**: Maintain context across interactions
- **Error Handling**: Graceful fallback and error recovery

## 5. MCP Protocol Implementation

### Endpoint Structure

- **Base URL**: `/api/odoo-mcp/[transport]`
- **Supported Methods**: GET, POST, DELETE
- **Protocol**: JSON-RPC over HTTP

## Demo

- Odoo MCP is currently hosted [here](https://odoo-mcp-server.vercel.app/api/odoo-mcp/mcp)
