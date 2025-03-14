'use client';

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/app/(helpers)/authContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Image from 'next/image';
import bc from '@/app/(helpers)/bc';
import api from '@/app/(helpers)/api';
import { useRouter } from 'next/navigation';
import { useQRCode } from 'next-qrcode';
import * as Yup from 'yup';
import axios from 'axios';
import CoinSelect from '@/app/(components)/Inputs/CoinSelect';
import socket from '@/app/(helpers)/socket';
import Wallet from '@/app/(components)/Popups/Wallet';

const Order = ({ params }) => {
	const [payment, setPayment] = useState(null);
	const [order, setOrder] = useState(null);
	const [timeLeft, setTimeLeft] = useState(null);
	const [updated, setUpdated] = useState(false);
	const [wallet, setWallet] = useState(null);
	const [block, setBlock] = useState(false);
	const { user, authState } = useContext(AuthContext);
	const { Canvas } = useQRCode();
	const { id } = params;
	const router = useRouter();
	const coins = [['btc', 'Bitcoin (Default)'], ['lbtc', 'Bitcoin (Lightning)'], ['eth', 'Ethereum (ERC20)'], ['bnb', 'Binance (BEP20)']];

	useEffect(() => {
		socket.on('updateOrder', (data) => {
			setUpdated(upd => !upd);
		});
		socket.on('getOrder', (data) => {
			if (data.status === 'pending' || data.status === 'complete') {
				bc.get(`/invoices/${data.invoice}`)
					.then((response) => {
						if (response.data.status === 'complete' && data.status !== 'complete') {
							socket.emit('updateOrder', { id: id, status: 'complete' });
						}
						setPayment(response.data);
						setWallet({ bnb: 0, eth: 1, btc: 2, lbtc: 3 }[response.data.currency]);
					}).catch((error) => { });
			}
			setOrder(data);
		});

		return () => {
			socket.off('updateOrder');
			socket.off('getOrder');
		};
	}, [id]);

	useEffect(() => {
		socket.emit('getOrder', id);
	}, [id, updated]);

	useEffect(() => {
		let intervalId;
		if (payment && payment.status === 'pending' && payment.time_left > 0) {
			intervalId = setInterval(() => {
				setTimeLeft(prevTimeLeft => {
					if (prevTimeLeft === 1) {
						clearInterval(intervalId);
						bc.patch(`/invoices/${payment.id}`, { status: 'expired' }).catch((error) => { });
						socket.emit('updateOrder', { id: id, status: 'expired' });
						setPayment([]);
						setOrder([]);
						router.push('/');
					}
					if (prevTimeLeft % 30 === 0) setUpdated(upd => !upd);

					return prevTimeLeft - 1;
				});
			}, 1000);
		}
		return () => {
			clearInterval(intervalId);
		};
	}, [payment, id, router]);

	const validationSchemaSetting = Yup.object().shape({
		coin: Yup.string().required('This field is required')
	});
	const onSetting = (data) => {

		setBlock(true);

		let currencyID = {
			bnb: 'bnb-binance-coin',
			eth: 'eth-ethereum',
			btc: 'btc-bitcoin',
			lbtc: 'lbtc-lightning-bitcoin'
		};
		axios.get(`https://api.coinpaprika.com/v1/tickers/${currencyID[data.coin]}`)
			.then((response) => {
				bc.post('/invoices', {
					price: order.price / response.data.quotes.USD.price,
					currency: data.coin,
					expiration: 60,
					store_id: 'nEVtfXTyPxRpVpidUwypdYufLYSEfzPF',
					buyer_email: data.email,
					shipping_address: data.address,
					order_id: order.id,
					products: [`${order.headset === 1 ? 'lFdrwtUveOujbYHVLFKfIp' : order.headset === 2 && 'iWzcShLojyqwzwfuamJvjG'}`]
				})
					.then((res) => {
						socket.emit('updateOrder', { id: id, status: 'pending', invoice: res.data.id });
					}).catch((error) => { });
			}).catch((error) => { });
	};
	const deleteInvoice = () => {
		socket.emit('deleteOrder', order);
		if (order.status === 'pending') bc.delete(`/invoices/${payment.id}`).catch((error) => { });
		setOrder([]);
		setPayment([]);
		router.push('/account');
	};

	function transformTimestamp(timestamp) {
		const date = new Date(timestamp);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');

		return `${day}.${month} at ${hours}:${minutes}`;
	}
	return (
		<main className='lg:mx-24 my-24 gap-24 text-center' >
			<section className=''>
				{order ? (<>
					{!authState || user.email === order.email ? (
						<div className='flex justify-between gap-10 max-md:flex-col max-md:items-center'>
							<div className='bg-neutral-800 px-14 py-14 text-xl rounded-2xl flex flex-col gap-10 items-center max-w-sm'>
								{(() => {
									switch (order.status) {
										case 'setting': return (<div className='flex flex-col justify-between items-center gap-5'>
											<h2 className='font-bold text-3xl mb-10'>Select payment option</h2>
											<Image src='/logotype.png' alt='AspireX' height={127.93} width={140} />
											<Formik initialValues={{ coin: '' }} onSubmit={onSetting} validationSchema={validationSchemaSetting}>
												{({ values }) => (
													<Form className='w-full text-center flex flex-col gap-5 mt-10 text-lg'>
														<div>
															<ErrorMessage name='coin' component='p' className='text-neutral-500 mb-1' />
															<Field name="coin" as={CoinSelect} options={coins} />
														</div>
														<button type='submit' className='bg-yellow-300 text-neutral-950 py-3 px-6 rounded-xl hover:brightness-75'>Continue</button>
														<button className='w-full rounded-xl py-3 px-6 bg-neutral-700 hover:brightness-75' onClick={() => { deleteInvoice(); }}>Cancel</button>
													</Form>
												)}
											</Formik>
										</div>);
										case 'pending': if (payment && payment.status === 'pending') return (<>
											<div className='flex flex-col gap-3 w-full font-bold text-2xl'>
												<p>{new Date(timeLeft * 1000).toISOString().slice(14, 19)} left</p>
												<p>{payment.price} {payment.currency.toUpperCase()} ({order.price.toString().replace(/(?:\.0+|(\.\d+?)0+)$/, '$1')}$)</p>
											</div>
											<div className='rounded-xl overflow-hidden'>
												<Canvas text={payment.payments[wallet].payment_url}
													options={{
														margin: 2,
														width: 200,
														color: { dark: '#000000', light: '#FFFFFF', },
													}} />
											</div>

											<div className='flex flex-col gap-3 w-full'>
												<button className='w-full rounded-xl py-3 px-6 bg-white text-black flex justify-between relative' onClick={() => { navigator.clipboard.writeText(payment.payments[wallet].payment_address); }}>
													<span className='w-11/12 whitespace-nowrap overflow-hidden text-ellipsis'>{payment.payments[wallet].payment_address}</span>
													<Image src='/copy.png' alt='Copy' width={31} height={31} className='absolute right-3' />
												</button>
												<button className='w-full rounded-xl py-3 px-6 bg-yellow-300' onClick={() => { setUpdated(!updated); }}>Refresh</button>
												<button className='w-full rounded-xl py-3 px-6 bg-neutral-700' onClick={() => { deleteInvoice(); }}>Cancel</button>
											</div>
										</>);
										case 'complete': if (payment && payment.status === 'complete') return (<div className='h-full font-bold flex flex-col justify-between'>
											<div className='flex flex-col gap-3 w-full text-xl'>
												<p>Paid {transformTimestamp(payment.paid_date)}</p>
												<p>{payment.price} {payment.currency} ({order.price}$)</p>
											</div>
											<h2 className='text-4xl'>Thank you for the order!</h2>
											<p className=''>Your headset will be shipped shortly</p>
										</div>);
										default: return (<p>Order is invalid.</p>);
									}
								})()}
							</div>
							<div className='flex flex-col justify-evenly max-md:items-center'>
								<div className='text-center font-bold max-md:text-center'>
									<h1 className='text-5xl'><span className='text-yellow-300'>AspireX</span> HEADSET V {order.headset}.0</h1>
									<p className='text-4xl'>{order.amount} piece{order.amount !== 1 && 's'}</p>
								</div>
								<div className='w-full'>
									<Image src={`/headset-${order.headset}.png`} alt={`AspireX HEADSET ${order.headset}`} height={400} width={553} priority className='rounded-3xl w-full h-11/12 text-right' />
								</div>
							</div>
						</div>
					) : (
						<p>You are not authorized.</p>
					)}
				</>) : (
					<p>The order was not found.</p>
				)}
			</section>
			{block && <Wallet setWalletParent={setBlock} />}
		</main>
	);
};

export default Order;