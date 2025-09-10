'use client';
import { useAgentSession } from '@/utils/hooks/useSession';
import React, { useEffect, useState } from 'react';

type Props = {};

export default function VoiceAgentPage({}: Props) {
	const { session: agentSession, loading, error } = useAgentSession();
	const [userInput, setUserInput] = useState<string | null>(null);
	const [isUserMuted, setIsUserMuted] = useState<boolean>(false);

	useEffect(() => {
		agentSession?.mute(isUserMuted);
	}, [isUserMuted]);

	return (
		<div className='w-full h-dvh flex flex-col justify-center items-center'>
			{loading ? <p>Loading...</p> : <p>I'm Ready</p>}
			{error && <p>Error: {error.message}</p>}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (userInput) agentSession?.sendMessage(userInput);
				}}>
				<input
					onChange={(e) =>
						setUserInput(e.currentTarget.value ?? null)
					}
					id='user_message_input'
					name='user_message_input'
					type='text'
					placeholder='send a message to agent'
					value={userInput ?? ''}
				/>
			</form>

			{agentSession && (
				<button
					className={`rounded-full aspect-square p-2 cursor-pointer ${
						isUserMuted === true ? 'bg-green-300' : 'bg-red-500'
					}`}
					onClick={() => setIsUserMuted((prev) => !prev)}>
					{isUserMuted ? 'unMute' : 'mute'}
				</button>
			)}
		</div>
	);
}
