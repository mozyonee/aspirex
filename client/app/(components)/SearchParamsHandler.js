import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import socket from './../(helpers)/socket';

export default function SearchParamsHandler() {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	useEffect(() => {
		if (token) {
			socket.emit('verifyToken', token);
		}
	}, [token]);

	return null; // This component doesn't need to render anything.
}
