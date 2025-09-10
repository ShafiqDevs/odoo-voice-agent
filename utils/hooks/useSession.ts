import { useEffect, useState } from 'react';
import { getEphemeralKey } from '@/actions/openai/api-keys';
import {
	RealtimeAgent,
	RealtimeSession,
} from '@openai/agents/realtime';
import { hostedMcpTool } from '@openai/agents-core';

export function useAgentSession() {
	const [session, setSession] = useState<RealtimeSession | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function initSession() {
			try {
				const agent = new RealtimeAgent({
					name: 'Bob',
					instructions: `You are a helpful assistant. who speaks only in english
						if spoken to in any other language, say EXACTLY this: "I only speak english, can we continue?"
						###
						-Before you use any tool or do any task, give the user a friendly notification like "I'm on it", "easy enough, one sec" or "I'm on it"  (use variations of these also)`,
					tools: [
						hostedMcpTool({
							serverLabel: 'oodo-mcp',
							serverUrl:
								'https://odoo-mcp-server.vercel.app/api/odoo-mcp/mcp',
						}),
					],
				});

				const newSession = new RealtimeSession(agent);
				const apiKey = await getEphemeralKey();
				await newSession.connect({ apiKey });

				if (isMounted) {
					setSession(newSession);
					setLoading(false);
				}
			} catch (err) {
				if (isMounted) {
					setError(err as Error);
					setLoading(false);
				}
			}
		}

		initSession();

		return () => {
			isMounted = false;
		};
	}, []);

	return { session, loading, error };
}
