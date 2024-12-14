import axios from 'axios';

const bc = axios.create({
	baseURL: process.env.BITCART_API_URL,
	headers: { Authorization: 'Bearer pRUD-2LMlUMcrUSzDMR789eM2YpRU-B8kaHQ2p2GXHs' }
});

export default bc;