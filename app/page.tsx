import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
	return (
		<div className='h-dvh container flex items-center justify-center'>
			<Link
				className='p-2 bg-blue-500'
				href={`/voice-agent`}>
				Open Odoo Agent
			</Link>
		</div>
	);
}
