'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import socket from '@/app/(helpers)/socket';

const Delivery = ({ setDeliveryParent, headset, amount, user, setUser, authState }) => {
	const popUp = useRef(null);

	useEffect(() => {
		const handleOutSideClick = (event) => {
			if (!popUp.current?.contains(event.target)) setDeliveryParent(false);
		};

		window.addEventListener("mousedown", handleOutSideClick);

		return () => {
			window.removeEventListener("mousedown", handleOutSideClick);
		};
	}, [popUp, setDeliveryParent]);



	const onDelivery = (data) => {
		if (authState) {
			setUser({ ...user, name: data.name, number: data.number, address: data.address });
			data.email = user.email;
		}

		data.amount = amount;
		data.headset = headset;
		if (headset === 1) data.price = amount * 1069;
		else if (headset === 2) data.price = amount * 2069;

		socket.emit('createOrder', data);

		setDeliveryParent(false);
	};

	const initialValuesDelivery = {
		name: user.name ? user.name : '',
		number: user.number ? user.number : '',
		email: '',
		address: user.address ? user.address : ''
	};
	const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
	const validationSchemaDelivery = Yup.object().shape({
		name: Yup.string().required('This field is required'),
		number: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Phone number is required'),
		email: authState ? Yup.string() : Yup.string().email().required('This field is required'),
		address: Yup.string().required('This field is required')
	});

	return (
		<main className='text-center m-32 gap-24 grid grid-cols-3' >
			<section className='w-full h-full fixed bg-neutral-950 bg-opacity-75 top-0 left-0 bottom-0 right-0 flex items-center justify-center backdrop-blur-md'>
				<div ref={popUp} className='bg-neutral-800 text-white text-3xl px-14 py-20 min-w-96 rounded-2xl flex flex-col gap-10 items-center mx-4'>
					<Image src='/logotype.png' alt='AspireX' width={100} height={91.38} />
					<h2 className='font-bold text-3xl'>Enter your data</h2>
					<Formik initialValues={initialValuesDelivery} onSubmit={onDelivery} validationSchema={validationSchemaDelivery}>
						<Form className='flex flex-col gap-5 text-xl'>
							{!authState && <div>
								<ErrorMessage name='email' component='p' className='text-neutral-500 mb-1' />
								<Field type='email' name='email' placeholder='Email' className='w-full placeholder:text-black text-black text-center py-3 px-6 rounded-xl focus:outline-none' />
							</div>}
							<div>
								<ErrorMessage name='name' component='p' className='text-neutral-500 mb-1' />
								<Field name='name' placeholder='Name' className='w-full placeholder:text-black text-black text-center py-3 px-6 rounded-xl focus:outline-none' />
							</div>
							<div>
								<ErrorMessage name='number' component='p' className='text-neutral-500 mb-1' />
								<Field name='number' placeholder='Phone number' className='w-full placeholder:text-black text-black text-center py-3 px-6 rounded-xl focus:outline-none' />
							</div>
							<div>
								<ErrorMessage name='address' component='p' className='text-neutral-500 mb-1' />
								<Field name='address' placeholder='Address' className='w-full placeholder:text-black text-black text-center py-3 px-6 rounded-xl focus:outline-none' />
							</div>
							<button type='submit' className='bg-yellow-300 text-neutral-950 hover:brightness-75 py-3 px-6 rounded-xl'>Purchase</button>
						</Form>
					</Formik>
				</div>
			</section>
		</main>
	);
};

export default Delivery;