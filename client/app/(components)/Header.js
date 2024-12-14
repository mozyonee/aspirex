import Link from 'next/link';
import Image from 'next/image';
import { useState, useContext } from 'react';
import { AuthContext } from '../(helpers)/authContext';
import { IoIosClose, IoIosMenu } from "react-icons/io";

const Header = () => {
	const { user, setUser, authState, setAuthState } = useContext(AuthContext);
	const [logout, setLogout] = useState(false);
	const [mobile, setMobile] = useState(false);

	const logOut = () => {
		localStorage.removeItem('sID');
		setAuthState(false);
		setLogout(false);
		setUser([]);
	};

	let email = '';

	if (authState) {
		const [local, domain] = user.email.split('@');
		email = local.slice(0, 3) + '***@' + domain;
	} else email = 'Authorization';

	return (
		<header className='py-5 px-8 w-full m-auto top-0 sticky bg-neutral-950 drop-shadow-lg shadow-neutral-950'>
			<nav className='m-auto flex justify-between items-center text-lg max-w-7xl'>
				{mobile ? (
					<div className="sm:hidden absolute top-0 left-0 right-0 bg-neutral-950 z-10">
						<div className="flex flex-col text-center items-center justify-between h-screen py-20 gap-5">
							<div className='w-11/12'>
								<button className='w-full flex justify-end mb-3 hover:brightness-75' onClick={() => setMobile(!mobile)}><IoIosClose size={40} /></button>
								<div className='flex flex-col gap-3'>
									<Link href='/account' className='w-full bg-yellow-300 text-neutral-950 hover:brightness-75 py-2 rounded-xl' onClick={() => setMobile(!mobile)}>{email}</Link>
									{authState && <Link href='#' className='w-full right-0 bg-neutral-900 py-2 rounded-xl hover:bg-neutral-800' onClick={() => logOut()}>Log out</Link>}
								</div>
							</div>
							<div className='flex flex-col gap-10'>
								<Link href='/' className='hover:brightness-75' onClick={() => setMobile(!mobile)}>Main</Link>
								<Link href='/teaem' className='hover:brightness-75' onClick={() => setMobile(!mobile)}>Team</Link>
								{/* <Link href='/preorderv1' className='hover:brightness-75' onClick={() => setMobile(!mobile)}>Preorder V1</Link> */}
								<Link href='/getv1' className='hover:brightness-75' onClick={() => setMobile(!mobile)}>Get V1</Link>
								<Link href='/preorderv2' className='hover:brightness-75' onClick={() => setMobile(!mobile)}>Preorder V2</Link>
								{/* <Link href='/getv2' className='hover:brightness-75' onClick={() => setMobile(!mobile)}>Get V2</Link> */}
							</div>
							<Link href='/'><Image src='/logotype.png' alt='AspireX' className='hover:brightness-75' height={50} width={55} quality={100} /></Link>
						</div>
					</div>
				) : (<>
					<div className='flex items-center gap-6 max-sm:w-full max-sm:justify-between'>
						<Link href='/' className='hover:brightness-75'><Image src='/logotype.png' alt='AspireX' height={50} width={55} quality={100} /></Link>
						<div className="flex max-sm:hidden items-center gap-6">
							<Link href='/' className='hover:brightness-75'>Main</Link>
							<Link href='/team' className='hover:brightness-75'>Team</Link>
							{/* <Link href='/preorderv1' className='hover:brightness-75'>Preorder V1</Link> */}
							<Link href='/getv1' className='hover:brightness-75'>Get V1</Link>
							<Link href='/preorderv2' className='hover:brightness-75'>Preorder V2</Link>
							{/* <Link href='/getv2' className='hover:brightness-75'>Get V2</Link> */}
						</div>
						<button className="sm:hidden text-neutral-100" onClick={() => setMobile(!mobile)}>
							<IoIosMenu size={40} />
						</button>
					</div>
					<div className='text-right max-sm:hidden' onMouseEnter={() => authState && setLogout(true)} onMouseLeave={() => setLogout(false)}>
						{logout && <Link href='#' className='mr-2 right-0 bg-neutral-900 py-3 px-6 rounded-xl hover:bg-neutral-800' onClick={() => logOut()}>Log out</Link>}
						<Link href='/account' className='text-neutral-950 bg-yellow-300 hover:brightness-75 py-3 px-6 rounded-xl'>{email}</Link>
					</div>
				</>)}
			</nav>
		</header>
	);
};

export default Header;
