'use client';

import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/app/(helpers)/authContext';
import Image from 'next/image';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CountrySelect from '@/app/(components)/Inputs/CountrySelect';
import socket from '@/app/(helpers)/socket';

const Preorder = () => {
	const { user, setUser, authState } = useContext(AuthContext);
	const [sent, setSent] = useState(false);
	const countries = [
		"Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
		"Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
		"Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
		"Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
		"Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
		"Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
		"Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece",
		"Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
		"Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
		"Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
		"Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali",
		"Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
		"Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
		"Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
		"Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
		"Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
		"Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
		"South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
		"Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
		"Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
		"Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
	];
	
	const initialValuesPreorder = {
		name: user.name ? user.name : '',
		email: '',
		country: user.country ? user.country : ''
	};
	const validationSchemaPreorder = Yup.object().shape({
		name: Yup.string().required('This field is required'),
		email: authState ? Yup.string() : Yup.string().email().required('This field is required'),
		country: Yup.string().required('This field is required')
	});
	const onPreorder = (data) => {
		if (authState) {
			setUser({ ...user, name: data.name, country: data.country });
			data.email = user.email;
		}
		data.model = 'X-Vision Headset 2';
		socket.emit('addPreorder', data);
		setSent(true);
	};

	return (
		<main className='max-lg:text-center'>
		<section className='flex flex-col my-16 gap-16 max-lg:flex-col max-lg:items-center '>
			<div className='flex max-lg:flex-col justify-between gap-16'>
					<div className='flex flex-col gap-10 max-lg:items-center max-lg:text-center'>
						<h1 className='font-bold text-5xl'><span className='text-yellow-300'>ASPIREX</span> <span className='text-nowrap'>HEADSET V 2.0</span></h1>
						<p className='max-w-xs text-lg'>Embark on the next level of immersion with our VR Head and Body Set 2.0, specially engineered to enhance your intimate connections and sensory experiences. Building upon the success of our previous model, version 2.0 introduces groundbreaking advancements in technology and design, ensuring your virtual encounters are as lifelike and thrilling as possible.</p>
						<ul className='grid grid-flow-col gap-5 justify-stretch w-full text-center'>
							<li className='bg-neutral-900 text-yellow-300 rounded-full p-1 flex justify-center'>14 hours</li>
							<li className='bg-neutral-900 text-yellow-300 rounded-full p-1 flex justify-center'>Waterproof</li>
							<li className='bg-neutral-900 text-yellow-300 rounded-full p-1 flex justify-center'>Eco-friendly</li>
						</ul>
					</div>
					<div><Image src='/headset-2.png' alt='ASPIREX HEADSET 2' height={400} width={553} priority className='rounded-3xl' /></div>
				</div>
				<div className='flex justify-center'>
					<Formik initialValues={initialValuesPreorder} onSubmit={onPreorder} validationSchema={validationSchemaPreorder}>
						<Form className='flex flex-col gap-5 text-lg w-1/2 max-lg:w-full'>
							<div>
								<ErrorMessage name='name' component='p' className='text-neutral-500 mb-1' />
								<Field name='name' placeholder='Name' className='w-full placeholder:text-black text-black text-center py-3 px-6 rounded-xl focus:outline-none' />
							</div>
							{!authState && <div>
								<ErrorMessage name='email' component='p' className='text-neutral-500 mb-1' />
								<Field type='email' name='email' placeholder='Email' className='w-full placeholder:text-black text-black text-center py-3 px-6 rounded-xl focus:outline-none' />
							</div>}
							<div>
								<ErrorMessage name='country' component='p' className='text-neutral-500 mb-1' />
								<Field name="country" as={CountrySelect} options={countries} />
							</div>
							<button type='submit' className='bg-yellow-300 text-neutral-950 py-3 px-6 hover:brightness-75 rounded-xl'>Subscribe</button>
						</Form>
					</Formik>
				</div>

				{sent && <p className='text-lg text-yellow-300 mt-3'>We will notify you about the start of sales</p>}
			</section>
		</main>
	);
};

export default Preorder;