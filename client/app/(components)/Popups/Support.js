'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRef, useState, useEffect } from 'react';
import socket from '@/app/(helpers)/socket';
import Image from 'next/image';

const Support = ({ setSupportFormParent, user, setUser, authState }) => {
	const [supportForm, setSupportForm] = useState(true);
	const [supportChat, setSupportChat] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');

	const [messages, setMessages] = useState([]);
	const messagesEndRef = useRef(null);
	const popUp = useRef(null);

	const questions = ['Default question 1', 'Default question 2', 'Default question 3'];
	const answers = ['Default answer 1', 'Default answer 2', 'Default answer 3'];

	useEffect(() => {
		if (authState) {
			setName(user.name);
			setEmail(user.email);
		}
	}, [user]);

	useEffect(() => {
		socket.on('receiveTelegram', (message) => {
			setMessages((prevMessages) => [...prevMessages, message]);
		});

		return () => socket.off('receiveTelegram');
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
	}, [messages]);

	useEffect(() => {
		const handleOutSideClick = (event) => {
			if (!popUp.current?.contains(event.target)) {
				if (supportForm) cancelForm();
				else if (supportChat) cancelChat();
			}
		};
		window.addEventListener("mousedown", handleOutSideClick);

		return () => {
			window.removeEventListener("mousedown", handleOutSideClick);
		};
	}, [popUp]);

	const initialValuesSupportForm = {
		name: user.name ? user.name : '',
		email: user.email ? user.email : '',
	};
	const validationSchemaSupportForm = Yup.object().shape({
		name: Yup.string().required('This field is required'),
		email: authState ? Yup.string() : Yup.string().email().required('This field is required'),
	});
	const validationSchemaSupportChat = Yup.object().shape({
		message: Yup.string().required('This field is required'),
	});

	const onSupportForm = (data) => {
		if (authState) {
			data.email = email;
			setName(data.name);
			setUser({ ...user, name: data.name });
		} else {
			setName(data.name);
			setEmail(data.email);
		}
		socket.emit('updateUser', data);
		setSupportForm(false);
		setSupportChat(true);
	};
	const onSupportChat = (data) => {
		const message = {
			author: {
				name: name,
				email: email
			},
			type: 'user',
			text: data.message
		};

		setMessages((prevMessages) => [...prevMessages, message]);

		if(user.live) socket.emit('sendTelegram', message);
		else {
			const answer = questions.findIndex(question => message.text === question);
			if(answer === -1) setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: 'Did you mean on of the following?' }]);
			else setMessages((prevMessages) => [...prevMessages, { type: 'agent', text: answers[answer] }]);
		}
	};
	const cancelForm = () => {
		setSupportForm(true);
		setSupportFormParent(false);
	};
	const cancelChat = () => {
		setSupportChat(false);
		setSupportForm(true);
	};

	return (
		<main className='text-center m-32 gap-24 grid grid-cols-3' >
			<section className='w-full h-full fixed bg-neutral-950 bg-opacity-75 top-0 left-0 bottom-0 right-0 flex items-center justify-center backdrop-blur-md'>
				<div ref={popUp} className='bg-neutral-800 text-white flex flex-col items-center gap-10 text-lg p-14 rounded-2xl max-w-lg mx-4'>
					{supportForm && (<>
						<Image src='/logotype.png' alt='Web Threesome' width={100} height={91.38} />
						<h2 className='font-semibold text-3xl'>Do you need help?</h2>
						<Formik initialValues={initialValuesSupportForm} onSubmit={(e) => onSupportForm(e)} validationSchema={validationSchemaSupportForm}>
							<Form className='flex flex-col gap-3 mx-auto text-black'>
								<ErrorMessage name='name' component='p' className='text-neutral-500' />
								<Field placeholder='Name' name='name' className='p-3 rounded-xl text-center placeholder:text-black cursor-text focus:outline-none' />
								<ErrorMessage name='email' component='p' className='text-neutral-500' />
								<Field placeholder='Email' type={authState ? 'hidden' : 'email'} name='email' className='p-3 rounded-xl text-center placeholder:text-black cursor-text focus:outline-none' />
								<button className='bg-yellow-300 text-neutral-950 hover:brightness-75 p-3 rounded-xl w-full' type='submit'>Contact</button>
							</Form>
						</Formik>
					</>)}
					{supportChat && (
						<div>
							<h2 className='font-semibold text-3xl'>Support</h2>
							<ul className='h-88 bg-white rounded-xl my-5 p-5 overflow-y-auto max-h-96'>
								<span className='flex justify-center text-black gap-3'>
									<Image src='/robot.png' alt='' width={30} height={30} />
									AI agent
								</span>
								<li className='text-left mt-3'>
									<p className='bg-neutral-800 max-w-fit py-3 px-6 rounded-xl'>Welcome!<br />We are here to make sure your experience is top-notch.</p>
								</li>
								{messages.map((message, index) => (
									<li key={index} className={`${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col mt-3`}>
										<p className={`${message.type === 'user' ? 'bg-yellow-300 text-neutral-950' : 'bg-neutral-800'} max-w-fit py-3 px-6 rounded-xl`}>
											{message.text}
										</p>
										{message.type === 'bot' && index + 1 === messages.length && questions.map((text, idx) => (
											<button key={idx} className={`bg-neutral-400 max-w-fit py-3 px-6 rounded-xl mt-1`} onClick={() => {
												onSupportChat({ message: text });
											}}>
												{text}
											</button>
										))}
									</li>
								))}
								<div ref={messagesEndRef} />
							</ul>
							<Formik initialValues={{ message: '' }} onSubmit={(values, { resetForm }) => { onSupportChat(values); resetForm(); }} validationSchema={validationSchemaSupportChat} >
								<Form className='flex flex-col gap-5 w-full text-black'>
									<ErrorMessage name='message' component='p' className='text-neutral-500' />
									<div className='flex justify-between gap-3'>
										<Field placeholder='Message' name='message' className='px-6 placeholder:text-black bg-white p-3 w-full rounded-xl cursor-text focus:outline-none' />
										<button className='bg-yellow-300 text-neutral-950 hover:brightness-75 px-6 py-3 rounded-xl' type='submit'>Send</button>
									</div>
								</Form>
							</Formik>
						</div>
					)}
				</div>
			</section>
		</main>
	);
};

export default Support;