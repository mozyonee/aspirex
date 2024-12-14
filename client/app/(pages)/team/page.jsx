'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/app/(helpers)/authContext';
import socket from '@/app/(helpers)/socket';

const Stars = () => {
	const { user, setUser, authState } = useContext(AuthContext);
	const [sent, setSent] = useState(false);
	const [sex, setSex] = useState(0);
	const names = [
		['Beatrice', 'Lee', 'Roberta', 'Mary', 'Luke', 'Helga'],
		['Douglas', 'Anna', 'Jeffree', 'Jessica', 'Stuart', 'Leona']
	];

	const initialValues = {
		name: user.name ? user.name : '',
		email: '',
		sex: user.sex ? user.sex : ''
	};
	const validationSchema = Yup.object().shape({
		name: Yup.string().required('This field is required'),
		email: authState ? Yup.string() : Yup.string().email().required('This field is required'),
		sex: Yup.string().required('This field is required')
	});

	const onSubmit = (data) => {
		if (authState) {
			data.email = user.email;
			setUser({ ...user, name: data.name, sex: data.sex });
		}
		socket.emit('createApplication', data);
		setSent(true);
	};

	return (
		<main className='lg:mx-24 my-24 text-center'>
			<section className='flex justify-between gap-20 max-md:flex-col max-md:items-center'>
				<div className='w-1/2 px-14 flex flex-col w-full'>
					<h2 className='font-bold text-2xl'>Our team</h2>
					<div className='text-3xl font-black flex gap-20 justify-center my-10'>
						<button className={sex ? 'text-white hover:brightness-75' : 'text-yellow-300'} onClick={() => setSex(0)}>✉︎</button>
						<button className={sex ? 'text-yellow-300' : 'text-white hover:brightness-75'} onClick={() => setSex(1)}>⛯</button>
					</div>
					<ul className='grid grid-cols-3 gap-10'>
						{
							names[sex].map((name, index) => {
								return (<li key={index} className='flex flex-col items-center'>
									<Image src={`/member.png`} alt={name} height={80} width={80} className={`rounded-full bg-black ${index % 2 ? '' : 'invert'} p-3`} />
									<p className='my-2 text-xl text-yellow-300'>{name}</p>
									<span className='flex items-center justify-center gap-2'>
										<Link href='#' className='hover:brightness-75'><Image src='/instagram.png' alt='instagram' height='21' width='20' /></Link>
										<Link href='#' className='hover:brightness-75'><Image src='/facebook.png' alt='facebook' height='22' width='23' /></Link>
										<Link href='#' className='hover:brightness-75'><Image src='/twitter.png' alt='twitter' height='19' width='23' /></Link>
									</span>
								</li>);
							})
						}
					</ul>
				</div>
				<div className='w-1/2 px-14 flex flex-col justify-evenly gap-5 w-full'>
					<h2 className='font-bold text-3xl'>Ready to dive into VR?</h2>
					<p className='text-sm'>For individuals 18+, we provide the resources, support, and community to help you connect with global audiences. Apply now to start your VR journey!</p>
					<div>
						<Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
							{({ values }) => (
								<Form className='flex flex-col gap-5 max-w-lg mx-auto text-xl'>
									<div>
										<ErrorMessage name='name' component='p' className='text-neutral-400 mb-2' />
										<Field name='name' placeholder='Name' className='w-full placeholder:text-neutral-950 text-neutral-950 text-center py-3 px-6 rounded-xl focus:outline-none' />
									</div>
									{!authState && <div>
										<ErrorMessage name='email' component='p' className='text-neutral-400 mb-2' />
										<Field type='email' name='email' placeholder='Email' className='w-full placeholder:text-neutral-950 text-neutral-950 text-center py-3 px-6 rounded-xl focus:outline-none' />
									</div>}
									<div>
										<ErrorMessage name='sex' component='p' className='text-neutral-400 mb-2' />
										<div className='flex gap-5'>
											<label className={`w-1/2 py-3 px-6 text-neutral-950 rounded-xl cursor-pointer ${values.sex === 'Male' ? 'bg-yellow-300 ' : 'bg-white hover:brightness-75'}`}>
												<Field type="radio" name="sex" value="Male" className='hidden' />
												Male
											</label>
											<label className={`w-1/2 py-3 px-6 text-neutral-950 rounded-xl cursor-pointer ${values.sex === 'Female' ? 'bg-yellow-300' : 'bg-white hover:brightness-75'}`}>
												<Field type="radio" name="sex" value="Female" className='hidden' />
												Female
											</label>
										</div>
									</div>
									<button type='submit' className='bg-yellow-300 text-neutral-950 py-3 px-6 rounded-xl hover:brightness-75'>Apply</button>
								</Form>
							)}
						</Formik>
						{sent && <p className='text-xl mt-5 text-yellow-300'>We have received your application</p>}
					</div>
				</div>
			</section>
		</main>
	);
};

export default Stars;