'use client';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/app/(helpers)/authContext';
import Image from 'next/image';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Delivery from '@/app/(components)/Popups/Delivery';

const Order = () => {
	const { user, setUser, authState, setAuthState } = useContext(AuthContext);
	const [delivery, setDelivery] = useState(false);
	const [amount, setAmount] = useState(1);
	const [width, setWidth] = useState('');

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
		<main className='lg:mx-24 my-24 gap-44 flex flex-col max-lg:text-center'>
			<section className='flex justify-between gap-16 max-lg:flex-col max-lg:items-center'>
				<div className='flex flex-col items-center'>
					<div className='flex flex-col gap-10 max-lg:items-center max-lg:text-center'>
						<h1 className='font-bold text-5xl'><span className='text-pink-400'>ASPIREX</span> <span className='text-nowrap'>HEADSET V 2.0</span></h1>
						<p className='max-w-xs text-lg'>Elevate your virtual experience with our VR Head and Body Set 2.0. Featuring state-of-the-art technology and ergonomic design, this set delivers unparalleled immersion and comfort, allowing you to indulge in your deepest desires with unprecedented realism and intensity. Whether you&apos;re gaming, exploring virtual worlds, or engaging in interactive experiences, our VR Head and Body Set 2.0 provides an unforgettable journey into the realms of virtual pleasure.</p>
						<p className='font-bold text-2xl'>2069 usd with free worldwide shipping</p>
						<ul className='grid grid-flow-col gap-5 justify-stretch w-full text-center'>
							<li className='bg-neutral-900 text-yellow-500 rounded-full p-1 flex justify-center'>14 hours</li>
							<li className='bg-neutral-900 text-yellow-500 rounded-full p-1 flex justify-center'>Waterproof</li>
							<li className='bg-neutral-900 text-yellow-500 rounded-full p-1 flex justify-center'>Eco-friendly</li>
						</ul>
					</div>
					<Formik initialValues={{ amount: 1 }} onSubmit={onDelivery} validationSchema={validationSchemaDelivery}>
						{({ setFieldValue }) => (
							<Form className='flex flex-col w-7/12 gap-5 my-10 text-lg max-lg:mx-auto'>
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
								<button type='submit' className='bg-pink-400 text-white py-3 px-6 rounded-xl'>Order</button>
							</Form>
						)}
					</Formik>
				</div>
				<div>
					<Image src='/headset-2.png' alt='ASPIREX HEADSET 2' height={400} width={553} priority className='rounded-3xl' />
				</div>
			</section>
			{delivery && <Delivery setDeliveryParent={setDelivery} headset={2} amount={amount} user={user} setUser={setUser} authState={authState} />}
		</main>
	);
};

export default Order;