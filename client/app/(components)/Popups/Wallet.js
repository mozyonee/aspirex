'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';

const Wallet = ({ setWalletParent }) => {
	const popUp = useRef(null);

	useEffect(() => {
		const handleOutSideClick = (event) => {
			if (!popUp.current?.contains(event.target)) setWalletParent(false);
		};

		window.addEventListener("mousedown", handleOutSideClick);

		return () => {
			window.removeEventListener("mousedown", handleOutSideClick);
		};
	}, [popUp, setWalletParent]);

	return (
		<main className='text-center m-32 gap-24 grid grid-cols-3' >
			<section className='w-full h-full fixed bg-neutral-950 bg-opacity-75 top-0 left-0 bottom-0 right-0 flex items-center justify-center backdrop-blur-md'>
				<div ref={popUp} className='bg-neutral-800 text-white text-3xl p-14 min-w-96 rounded-2xl flex flex-col gap-10 items-center mx-4'>
					<Image src='/logotype.png' alt='AspireX' width={100} height={91.38} />
					<h2 className='font-bold'>Coming soon!</h2>
				</div>
			</section>
		</main>
	);
};

export default Wallet;