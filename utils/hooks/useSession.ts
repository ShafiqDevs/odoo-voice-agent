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
					instructions:
						'You are a helpful assistant. who speaks in english',
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
