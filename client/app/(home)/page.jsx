'use client';

import Image from 'next/image';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../(helpers)/authContext';
import socket from '../(helpers)/socket';

const Home = () => {
	const { user, authState } = useContext(AuthContext);
	const [sent, setSent] = useState(false);

	const onSubmit = (data) => {
		if (authState) data.email = user.email;
		socket.emit('addSubscriber', data);

		setSent(true);
	};

	const validationSchema = Yup.object().shape({
		email: authState ? Yup.string() : Yup.string().email().required('This field is required')
	});

	return (
		<main className='lg:mx-24 mt-32 mb-40 text-center flex flex-col gap-40'>
			<section>
				<div className='text-left flex items-center justify-between gap-14 max-lg:flex-col max-lg:items-center max-lg:text-center'>
					<div className='flex flex-col gap-10'>
						<h1 className='font-bold text-6xl'>Aspire<span className='text-yellow-300'>X</span></h1>
						<p className='max-w-lg text-3xl'>Innovative VR platform using cutting-edge technology to create an unforgettable experience beyond reality.</p>
					</div>
					<div>
						<Image src='/model.png' alt='model' height={344} width={553} className='rounded-3xl' />
					</div>
				</div>				
			</section>
			<section>
				<p className='text-xl'>Welcome to our platform, offering immersive VR experiences for meaningful connections and exciting moments from the comfort of your home. Redefining virtual interactions, we provide a unique VR experience with enhanced privacy and security, using cryptocurrency. Explore diverse models and personalized content as we shape the future of virtual engagement.</p>
			</section>
			<section className='max-w-lg mx-auto'>
				<h2 className='font-bold text-5xl mb-20'>Our <span className='text-yellow-300'>Roadmap</span></h2>
				<ul className='text-xl list-none list-inside marker:font-bold'>
				<li>
						<b>VR Headset Development and Pre-orders</b><p>We are focused on developing the latest in VR headset technology. You can pre-order your headset with no upfront payment and secure your place in the future of immersive VR experiences.</p>
						<Image src='/arrow.png' alt='then' height='51' width='16' className='m-auto my-16' />
					</li>
					<li>
						<b>VR Headset Sale Launch</b><p>Get ready to dive into the world of immersive adult entertainment as we launch the sale of our cutting-edge VR headsets. Experience intimacy like never before with stunning clarity and realism.</p>
						<Image src='/arrow.png' alt='then' height='51' width='16' className='m-auto my-16' />
					</li>
					<li>
						<b>VR Headset Sale Launch</b><p>Get ready to experience the next level of virtual reality with the launch of our cutting-edge VR headsets. Enjoy stunning clarity and realism, taking your VR experience to new heights.</p>
						<Image src='/arrow.png' alt='then' height='51' width='16' className='m-auto my-16' />
					</li>
					<li>
						<b>App Launch</b><p>Our app will soon be live, offering an array of immersive VR experiences. Explore new possibilities and connect with the future of virtual reality through our intuitive platform.</p>
						<Image src='/arrow.png' alt='then' height='51' width='16' className='m-auto my-16' />
					</li>
					<li>
						<b>VR Head and Body Set 2.0 Development</b><p>We are always pushing the boundaries of innovation. We are working on the next generation of VR head and body sets, designed to provide even more immersive and realistic experiences.</p>
					</li>
				</ul>
				<div className='mt-20 text-neutral-300 max-w-80 mx-auto'>
					<b>To be continued...</b><p>Stay tuned for more exciting updates as we continue to evolve and enhance the world of virtual reality.<br />Our journey is just beginning!</p>
				</div>
			</section>
			<section>
				<h2 className='font-bold text-3xl'>Newsletter</h2>
				<Formik initialValues={{ email: '' }} onSubmit={onSubmit} validationSchema={validationSchema}>
					<Form className='text-xl my-5'>
						<ErrorMessage name='email' component='p' className='text-neutral-500' />
						<div className='flex gap-1 justify-center mt-3'>
							{!authState && <Field type='email' name='email' placeholder='Email' className='placeholder:text-neutral-950 text-neutral-950 py-3 px-6 rounded-xl focus:outline-none' />}
							<button type='submit' className='text-neutral-950 py-3 px-6 rounded-xl bg-yellow-300 hover:brightness-75'>Subscribe</button>
						</div>
					</Form>
				</Formik>
				{sent && <p className='text-xl text-yellow-300'>We will notify you about future news</p>}
			</section>
		</main>
	);
};

export default Home;