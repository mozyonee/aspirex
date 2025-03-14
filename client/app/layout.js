'use client';

import './globals.css';
import Header from './(components)/Header';
import Footer from './(components)/Footer';
import { AuthContext } from './(helpers)/authContext';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import socket from './(helpers)/socket';
import Restrict from './(components)/Popups/Restrict';

export default function RootLayout({ children }) {
	const [user, setUser] = useState([]);
	const [authState, setAuthState] = useState(false);
	const [visited, setVisited] = useState(false);
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		socket.on('enableLive', (liveEmail) => {
			if (liveEmail === user.email) setUser({ ...user, live: 1 });
		});
		socket.on('banUser', (banEmail) => {
			if (banEmail === user.email) {
				localStorage.removeItem('sID');
				setAuthState(false);
				setUser([]);
			} else console.log(banEmail, '!=', user);
		});
		socket.on('verifyToken', (data) => {
			localStorage.setItem('sID', data);
			setTimeout(() => GetAuthState(), 1000);
			setTimeout(() => {
				localStorage.removeItem('sID');
				setAuthState(false);
				setUser([]);
			}, 6 * 60 * 60 * 1000);
			router.push('/account');
		});
		socket.on('verifyUser', (data) => {
			setUser(data);
			setAuthState(true);
		});

		return () => {
			socket.off('enableLive');
			socket.off('banUser');
			socket.off('verifyToken');
			socket.off('verifyUser');
		};
	}, [user]);

	useEffect(() => {
		if (visited || localStorage.getItem('visited')) {
			localStorage.setItem('visited', true);
			setVisited(true);
		}
	}, [visited]);

	useEffect(() => {
		const token = searchParams.get('token');

		if (token && !authState) {
			socket.emit('verifyToken', token);
		} else GetAuthState();
	}, []);

	const GetAuthState = () => {
		socket.emit('verifyUser', { headers: { sID: localStorage.getItem('sID') } });
	};

	return (
		<html lang='en'>
			<body className='relative bg-neutral-950 font-sans'>
				<AuthContext.Provider value={{ user, setUser, authState, setAuthState }}>
					{visited ? (
						<>
							<Header />
							<div className='px-10 max-w-7xl mx-auto'>
								{/* Wrap children in Suspense */}
								<Suspense fallback={<div>Loading...</div>}>
									{children}
								</Suspense>
							</div>
							<Footer />
						</>
					) : (
						<Restrict setVisited={setVisited} />
					)}
				</AuthContext.Provider>
			</body>
		</html>
	);
}
