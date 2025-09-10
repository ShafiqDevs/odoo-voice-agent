'use server';
export async function getEphemeralKey() {
	const response = await fetch(
		'https://api.openai.com/v1/realtime/client_secrets',
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				session: {
					type: 'realtime',
					model: 'gpt-realtime',
				},
			}),
		}
	);
	if (!response.ok) {
		throw new Error('Failed to fetch ephemeral key');
	}
	const data = await response.json();
	// console.log(data);
	return data.value;
}
