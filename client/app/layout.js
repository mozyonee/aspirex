'use client';

import './globals.css';
import Header from './(components)/Header';
import Footer from './(components)/Footer';
import { AuthContext } from './(helpers)/authContext';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import socket from './(helpers)/socket';
import Restrict from './(components)/Popups/Restrict';
import SearchParamsHandler from './(components)/SearchParamsHandler'; // Importing a child component

export default function RootLayout({ children }) {
	const [user, setUser] = useState([]);
	const [authState, setAuthState] = useState(false);
	const [visited, setVisited] = useState(false);
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
	}, []);

	useEffect(() => {
		if (!localStorage.getItem('visited')) {
			localStorage.setItem('visited', true);
		}
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
								{/* Wrap the entire layout with Suspense */}
								<Suspense fallback={<div>Loading...</div>}>
									{/* Moved the searchParams logic into a child component */}
									<SearchParamsHandler />
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
