'use client';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/app/(helpers)/authContext';
import Image from 'next/image';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Delivery from '@/app/(components)/Popups/Delivery';
import socket from '@/app/(helpers)/socket';
import { useRouter } from 'next/navigation';

const Order = () => {
	const { user, setUser, authState, setAuthState } = useContext(AuthContext);
	const [delivery, setDelivery] = useState(false);
	const [amount, setAmount] = useState(1);
	const [width, setWidth] = useState('');
	const router = useRouter();

	useEffect(() => {
		socket.on('getOrderNumber', (data) => {
			router.push(`/order/${data}`);
		});
	  
		return () => {
			socket.off('getOrderNumber');
		};
	}, [user]);

	useEffect(() => {
		const placeholderRef = document.getElementById('hide');
		setWidth(`${placeholderRef.offsetWidth + 5}px`);
	}, [amount]);

	const validationSchemaDelivery = Yup.object().shape({
		amount: Yup.number().positive('Amount must be positive').required('Amount is required'),
	});
	const onDelivery = () => {
		setDelivery(true);
	};

	return (
		<main className='max-lg:text-center'>
		<section className='flex flex-col my-16 gap-16 max-lg:flex-col max-lg:items-center '>
			<div className='flex max-lg:flex-col justify-between gap-16'>
					<div className='flex flex-col gap-10 max-lg:items-center max-lg:text-center'>
						<h1 className='font-bold text-5xl'><span className='text-yellow-300'>ASPIREX</span> <span className='text-nowrap'>HEADSET V 1.0</span></h1>
						<p className='max-w-xs text-lg'>Introducing our VR Headset 1.0, the pinnacle of immersive technology, designed to elevate your sensual experiences to new heights. Immerse yourself in stunning virtual worlds with unparalleled clarity and realism, allowing you to explore your fantasies in a whole new dimension.</p>
						<p className='font-bold text-2xl'><span className='text-yellow-300'>$1069</span> with free worldwide shipping</p>
						<ul className='grid grid-flow-col gap-5 justify-stretch w-full text-center'>
							<li className='bg-neutral-900 text-yellow-300 rounded-full p-1 flex justify-center'>7 hours</li>
							<li className='bg-neutral-900 text-yellow-300 rounded-full p-1 flex justify-center'>Waterproof</li>
							<li className='bg-neutral-900 text-yellow-300 rounded-full p-1 flex justify-center'>Eco-friendly</li>
						</ul>
					</div>
					<div><Image src='/headset-1.png' alt='ASPIREX HEADSET 1' height={400} width={553} priority className='rounded-3xl' /></div>
				</div>
				<div className='flex justify-center'>
					<Formik initialValues={{ amount: 1 }} onSubmit={onDelivery} validationSchema={validationSchemaDelivery}>
						{({ setFieldValue }) => (
							<Form className='flex flex-col gap-5 text-lg w-1/2 max-lg:w-full'>
								<ErrorMessage name='amount' component='p' className='text-neutral-500' />
								<label htmlFor='show' className='w-full flex justify-center bg-white text-black py-3 px-6 rounded-xl cursor-text'>
									<span id='hide' className='absolute invisible'>{amount}</span>
									<Field id='show' name='amount' type='number' className='focus:outline-none bg-transparent' value={amount}
										onChange={(e) => { setAmount(e.target.value); setFieldValue('amount', e.target.value); }}
										style={{ width: width }}
										onKeyPress={(e) => { !/[0-9]/.test(e.key) && e.preventDefault(); }}
									/>
									piece{amount != 1 && 's'}
								</label>
								<button type='submit' className='bg-yellow-300 text-neutral-950 hover:brightness-75 py-3 px-6 rounded-xl'>Order</button>
							</Form>
						)}
					</Formik>
				</div>
			</section>
			{delivery && <Delivery setDeliveryParent={setDelivery} headset={1} amount={amount} user={user} setUser={setUser} authState={authState} />}
		</main>
	);
};

export default Order;