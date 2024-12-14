import Link from 'next/link';
import { useState, useContext } from 'react';
import Support from './Popups/Support';
import { AuthContext } from '../(helpers)/authContext';
import { useRouter } from 'next/navigation';

const Footer = () => {
	const { user, setUser, authState } = useContext(AuthContext);
	const [supportForm, setSupportForm] = useState(false);
	const router = useRouter();

	const callSupport = () => {
		if(authState) setSupportForm(true)
		else router.push('/account');
	}

	return (
		<footer>
			<hr className='border-neutral-800' />
			<nav className='text-lg text-center py-5 px-20 w-fit mx-auto max-sm:flex-col'>
				<div className='flex justify-between gap-4 items-center'>
					<span className='cursor-pointer hover:brightness-75' onClick={callSupport}>Support</span>
					<Link href='/legal' className='hover:brightness-75'>Legal</Link>
				</div>
				<span>AspireX<sup>©</sup> 2023-2024</span>
			</nav>
			{supportForm && <Support setSupportFormParent={setSupportForm} user={user} setUser={setUser} authState={authState} />}
		</footer>
	);
};

export default Footer;