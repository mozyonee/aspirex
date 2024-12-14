'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const Restrict = ({ setVisited }) => {
	const [minor, setMinor] = useState(false);
	
	useEffect(() => {
		if(minor || localStorage.getItem('minor')) {
			localStorage.setItem('minor', true);
			setMinor(true);
		}
	}, [minor]);

	return (
		<main className='text-center' >
			<section className='flex items-center justify-center min-h-screen'>
				<div className='bg-neutral-800 text-white text-lg p-14 max-w-2xl rounded-2xl flex flex-col gap-10 items-center m-4'>
					<Image src='/restrict.png' alt='Restricted to 18 and over' width={256} height={97.9} />
					<h2 className='text-3xl font-bold'>{minor ? 'Please leave this website' : 'Are you over 18?'}</h2>
					<p>This website contains content intended for adults, including explicit material. By accessing this website, you confirm that you are at least 18 years old (or the age of majority in your jurisdiction) and consent to viewing such content.</p>
					<div className='flex flex-col gap-3 w-full'>
						<button className='bg-yellow-300 text-neutral-950 px-4 py-2 rounded-xl hover:brightness-75' onClick={() => setVisited(true)}>YES - Enter</button>
						<button className='bg-white text-neutral-950 px-4 py-2 rounded-xl hover:brightness-75' onClick={() => setMinor(true)}>NO - Leave</button>
					</div>
				</div>
			</section>
		</main>
	);
};

export default Restrict;