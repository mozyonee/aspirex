'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/app/(helpers)/authContext';
import Support from '@/app/(components)/Popups/Support';
import Wallet from '@/app/(components)/Popups/Wallet';
import api from '@/app/(helpers)/api';
import { useRouter } from 'next/navigation';
import Checkbox from '@mui/material/Checkbox';
import { grey } from '@mui/material/colors';
import { connectButton } from '@/app/(helpers)/connectButton';
import { aspirexVideostream } from '@/app/(helpers)/aspirexMedia';
import socket from '@/app/(helpers)/socket';

export const setWallet = (value) => {
    setWalletState(value);
};

let setWalletState;

const Account = () => {
	const [supportForm, setSupportForm] = useState(false);
	const [starHover, setStarHover] = useState(false);
	const [userHover, setUserHover] = useState(false);
	const [useType, setUseType] = useState('');
	const { user, setUser, authState } = useContext(AuthContext);
	const [sent, setSent] = useState(false);
	const [received, setReceived] = useState(false);
	const [wallet, setWallet] = useState(false);
	const [orders, setOrders] = useState([]);
	const [userType, setUserType] = useState('');
	const router = useRouter();
	
	setWalletState = setWallet;
	
	useEffect(() => {
		socket.on('getOrders', (data) => {
			setOrders(data);
		});

		return () => socket.off('getOrders');
	}, []);

	useEffect(()=>{
		console.log(useType);
	},[useType])

	useEffect(() => {
		if (authState) socket.emit('getOrders', user.email);
		setUserType(user.userType);
	}, [user]);

	const validationSchemaThree = Yup.object().shape({
		userType: Yup.string().required('This field is required'),
		useType: Yup.number().required('This field is required'),
		useCase1: useType === 'entertainment' || useType === 'professional' ? Yup.string().required('This field is required') : Yup.string(),
		useMode1: useType === 'entertainment' || useType === 'professional' ? Yup.string().required('This field is required') : Yup.string(),
		useCase2: useType === 'professional' ? Yup.string().required('This field is required') : Yup.string(),
		useMode2: useType === 'professional' ? Yup.string().required('This field is required') : Yup.string()
	});
	const onSurvey = (data) => {
		if (useType !== 'professional') {
			data.useCase2 = '';
			data.useMode2 = '';
		}

		data.email = user.email;
		socket.emit('updateUser', data);
		setUser(user);
		setReceived(true);
	};

	const validationSchemaAuth = Yup.object().shape({
		email: Yup.string().email().required('This field is required')
	});
	const onAuthorize = (data) => {
		socket.emit('authorizeUser', data);
		setSent(true);
	};

	const toggleInvites = () => {
		const invites = user.invites === 'Enabled' ? 'Disabled' : 'Enabled';
		socket.emit('updateUser', {
			email: user.email,
			invites: invites
		});
		setUser({ ...user, invites: invites });
		
	};

	const transformTimestamp = (timestamp) => {
		const date = new Date(timestamp);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');

		return `${day}.${month} at ${hours}:${minutes}`;
	};

	const startWallet = () => {
		connectButton();
		setTimeout(() => {
            aspirexVideostream();
        }, 2500);
	}

	return (<>
		{authState ?
			<main className='text-center lg:mx-24 my-24 gap-24 grid grid-cols-3 max-md:flex max-md:flex-col' >
				<section className='col-span-2 h-50'>
					<div className='bg-neutral-900 py-3 w-full h-96 rounded-xl flex items-center justify-center'>
						<button className='py-3 px-14 mx-4 bg-white rounded-xl text-black text-2xl font-bold' onClick={startWallet}>Connect wallet</button>
					</div>
					<Formik initialValues={{ userType: userType, useType: '', useCase1: '', gamingMode: '', useCase2: '', useMode2: '' }} onSubmit={onSurvey} validationSchema={validationSchemaThree}>
						{({ values }) => (
							<Form className='flex flex-col gap-5 my-10 text-xl'>
								<legend>What type of user are you?</legend>
								<div className='flex flex-col gap-2'>
									<ErrorMessage name='userType' component='span' className='text-neutral-400 mb-1' />
									<div className='flex gap-5'>
										<label className={`w-1/2 py-3 px-6 rounded-xl cursor-pointer text-neutral-950 ${values.userType === 'individual' ? 'bg-yellow-300' : 'bg-white hover:brightness-75'}`}>
											<Field type="radio" name="userType" value="individual" className='hidden' />
											Individual
										</label>
										<label className={`w-1/2 py-3 px-6 rounded-xl cursor-pointer text-neutral-950 ${values.userType === 'business' ? 'bg-yellow-300' : 'bg-white hover:brightness-75'}`}>
											<Field type="radio" name="userType" value="business" className='hidden' />
											Business
										</label>
									</div>
								</div>
								<legend>What is your primary interest in VR?</legend>
								<div className='flex flex-col gap-2'>
									<ErrorMessage name='useType' component='span' className='text-neutral-400 mb-1' />
									<div className='flex gap-5'>
										<label className={`w-full py-3 px-6 rounded-xl cursor-pointer text-neutral-950 ${values.useType === 'entertainment' ? 'bg-yellow-300' : 'bg-white hover:brightness-75'}`}>
											<Field type="radio" name="useType" value="entertainment" className='hidden' onClick={(e) => setUseType(e.target.value)} />
											Entertainment
										</label>
										<label className={`w-full py-3 px-6 rounded-xl cursor-pointer text-neutral-950 ${values.useType == 'professional' ? 'bg-yellow-300' : 'bg-white hover:brightness-75'}`}>
											<Field type="radio" name="useType" value="professional" className='hidden' onClick={(e) => setUseType(e.target.value)} />
											Professional
										</label>
									</div>
								</div>

								{(values.useType === 'entertainment' || values.useType === 'professional') && (<>
									<legend>What will you use the headset for?</legend>
									<div className='flex flex-col gap-2'>
										<ErrorMessage name='useCase1' component='span' className='text-neutral-400' />
										<div className='flex gap-5'>
											<label className={`w-1/2 py-3 px-6 rounded-xl cursor-pointer text-neutral-950 ${values.useCase1 === 'gaming' ? 'bg-yellow-300' : 'bg-white hover:brightness-75'}`}>
												<Field type="radio" name="useCase1" value="gaming" className='hidden' />
												Gaming
											</label>
											<label className={`w-1/2 py-3 px-6 rounded-xl cursor-pointer text-neutral-950 ${values.useCase1 === 'media' ? 'bg-yellow-300' : 'bg-white hover:brightness-75'}`}>
												<Field type="radio" name="useCase1" value="media" className='hidden' />
												Media
											</label>
										</div>
									</div>
									<div className='flex flex-col gap-2'>
										<ErrorMessage name='useMode1' component='span' className='text-neutral-400' />
										<div className='flex gap-5'>
											<label className={`w-1/2 py-3 px-6 rounded-xl cursor-pointer text-neutral-950 ${values.useMode1 === 'solo' ? 'bg-yellow-300' : 'bg-white hover:brightness-75'}`}>
												<Field type="radio" name="useMode1" value="solo" className='hidden' />
												Solo
											</label>
											<label className={`w-1/2 py-3 px-6 rounded-xl cursor-pointer text-neutral-950 ${values.useMode1 === 'social' ? 'bg-yellow-300' : 'bg-white hover:brightness-75'}`}>
												<Field type="radio" name="useMode1" value="social" className='hidden' />
												Social
											</label>
										</div>
									</div>
								</>)}

								{values.useType === 'professional' && (<>
									<legend>What is your professional use case?</legend>
									<div className='flex flex-col gap-2'>
										<ErrorMessage name='useCase2' component='span' className='text-neutral-400' />
										<div className='flex gap-5'>
											<label className={`w-1/2 py-3 px-6 rounded-xl cursor-pointer text-neutral-950 ${values.useCase2 === 'creative' ? 'bg-yellow-300' : 'bg-white hover:brightness-75'}`}>
												<Field type="radio" name="useCase2" value="creative" className='hidden' />
												Creative
											</label>
											<label className={`w-1/2 py-3 px-6 rounded-xl cursor-pointer text-neutral-950 ${values.useCase2 === 'commercial' ? 'bg-yellow-300' : 'bg-white hover:brightness-75'}`}>
												<Field type="radio" name="useCase2" value="commercial" className='hidden' />
												Commercial
											</label>
										</div>
									</div>
									<div className='flex flex-col gap-2'>
										<ErrorMessage name='useMode2' component='span' className='text-neutral-400' />
										<div className='flex gap-5'>
											<label className={`w-1/2 py-3 px-6 rounded-xl cursor-pointer text-neutral-950 ${values.useMode2 === 'solo' ? 'bg-yellow-300' : 'bg-white hover:brightness-75'}`}>
												<Field type="radio" name="useMode2" value="solo" className='hidden' />
												Solo
											</label>
											<label className={`w-1/2 py-3 px-6 rounded-xl cursor-pointer text-neutral-950 ${values.useMode2 === 'team' ? 'bg-yellow-300' : 'bg-white hover:brightness-75'}`}>
												<Field type="radio" name="useMode2" value="team" className='hidden' />
												Team
											</label>
										</div>
									</div>
								</>)}
								<button type='submit' className='bg-yellow-300 text-neutral-950 hover:brightness-75 py-3 rounded-xl'>Submit</button>
							</Form>
						)}
					</Formik>
					{received && <p className='text-xl text-yellow-500'>We have received your request</p>}
				</section>
				<section className='flex flex-col gap-10'>
					<label htmlFor="three" className="flex items-center text-sm max-md:justify-center cursor-pointer hover:brightness-75">
						<Checkbox id="three" onChange={toggleInvites} defaultChecked={user.invites === 'Enabled' ? true : false}
							disableRipple={true} sx={{ color: grey[400], '&.Mui-checked': { color: grey[400] } }} className='-z-10' />
						<span className='text-left cursor-pointer text-yellow-300'>Allow user invites for a threesome</span>
					</label>
					<div className='bg-yellow-950 p-5 rounded-xl' style={{ background: `center / cover no-repeat url('/stars.png')` }}>
						<h2 className='font-semibold text-2xl mb-5'>Experiences</h2>
						<div className='bg-white rounded-xl p-5'>
							<p className='text-black mb-5'>Experiences are available only if you connect your wallet</p>
							<span className='bg-black rounded-full px-3 py-1 cursor-pointer' onClick={() => setSupportForm(true)} onMouseEnter={() => setStarHover(true)} onMouseLeave={() => setStarHover(false)}>
								{starHover ? 'Need help?' : '?'}
							</span>
						</div>
					</div>
					<div className='bg-yellow-950 p-5 rounded-xl' style={{ background: `center / cover no-repeat url('/users.png')` }}>
						<h2 className='font-semibold text-2xl mb-5'>Previews</h2>
						<div className='bg-white rounded-xl p-5'>
							<p className='text-black mb-5'>Previews are available only if you connect your wallet</p>
							<span className='bg-black rounded-full px-3 py-1 cursor-pointer' onClick={() => setSupportForm(true)} onMouseEnter={() => setUserHover(true)} onMouseLeave={() => setUserHover(false)}>
								{userHover ? 'Need help?' : '?'}
							</span>
						</div>
					</div>
					{orders.length > 0 && (<div>
						<h2 className='font-semibold text-2xl mb-5'>My orders</h2>
						<ul className='flex flex-col gap-3'>
							{orders.slice().reverse().map(el => (el.status === 'setting' || el.status === 'pending' || el.status === 'complete') && (
								<li key={el.id} className='bg-neutral-900 py-3 px-6 rounded-xl cursor-pointer' onClick={() => { router.push(`/order/${el.id}`); }}>
									{transformTimestamp(el.createdAt)}
								</li>
							))}
						</ul>
					</div>)}
				</section>
				{wallet && <Wallet setWalletParent={setWallet} />}
				{supportForm && <Support setSupportFormParent={setSupportForm} user={user} setUser={setUser} authState={authState} />}
			</main>
			:
			<main className='text-center lg:mx-24 my-24 gap-24 flex flex-col'>
				<section>
					<h2 className='font-bold text-3xl'>Authorization</h2>
					<Formik initialValues={{ email: '' }} onSubmit={onAuthorize} validationSchema={validationSchemaAuth}>
						<Form className='flex flex-col gap-5 max-w-lg my-10 mx-auto text-xl'>
							<ErrorMessage name='email' component='p' className='text-neutral-500' />
							<Field type='email' name='email' placeholder='Email' className='text-center placeholder:text-neutral-950 text-neutral-950 py-3 px-6 rounded-xl focus:outline-none' />
							<button type='submit' className='bg-yellow-300 text-neutral-950 py-3 px-6 rounded-xl hover:brightness-75'>Submit</button>
						</Form>
					</Formik>
					{sent && <p className='text-xl text-yellow-300'>We have sent a login link to your email</p>}
				</section>
			</main>
		}
	</>);
};

export default Account;