const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const http = require('http');
const db = require('./models');
const { users } = require('./models');
const botRouter = require('./routes/bot');
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');
const preordersRouter = require('./routes/preorders');
const newsletterRouter = require('./routes/newsletter');
const applicationsRouter = require('./routes/applications');
const { api } = require('./helpers/api');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			upgradeInsecureRequests: []
		}
	}
}));
app.use(express.json());

app.use('/bot', botRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);
app.use('/preorders', preordersRouter);
app.use('/newsletter', newsletterRouter);
app.use('/applications', applicationsRouter);

dotenv.config();

const server = http.createServer(app);
const io = new require('socket.io')(server, {
	cors: {
		origins: [process.env.CLIENT_URL, process.env.SERVER_URL],
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true
	},
	debug: true
});

io.on('connection', (socket) => {
	console.log('Socket connected:', socket.id);  // Log socket connection

	socket.on('authorizeUser', (data) => {
		api.post('/users', data);
	});
	socket.on('verifyToken', (data) => {
		api.get(`/users?token=${data}`)
			.then(response => io.emit('verifyToken', response.data));
	});
	socket.on('verifyUser', (data) => {
		api.get('/users/auth', data)
			.then(response => io.emit('verifyUser', response.data));
	});
	socket.on('updateUser', (data) => {
		api.patch('/users', data);
	});
	socket.on('createApplication', (data) => {
		api.post('/applications', data);
	});
	socket.on('addSubscriber', (data) => {
		api.post('/newsletter', data);
	});
	socket.on('addPreorder', (data) => {
		api.post('/preorders', data);
	});
	socket.on('getOrders', (email) => {
		api.get(`/users/orders/${email}`)
			.then(response => io.emit('getOrders', response.data));
	});
	socket.on('getOrder', (order) => {
		api.get(`/orders/${order}`)
			.then(response => io.emit('getOrder', response.data));
	});
	socket.on('createOrder', (data) => {
		api.post('/orders', data)
			.then(response => {
				socket.emit('getOrderNumber', response.data);
			})
			.catch(err => {
				console.error('Error creating order:', err);
			});
	});
	  
	socket.on('updateOrder', (data) => {
		api.patch('/orders', data)
			.then(response => io.emit('updateOrder', response.data));
	});
	socket.on('deleteOrder', (order) => {
		api.delete('/orders', { data: order });
	});
	socket.on('sendTelegram', (message) => {
		const data = {
			chat_id: process.env.BOT_CHAT,
			text: `<b>Socket ID:</b> <code>${socket.id}</code>.\n<b>Name:</b> <code>${message.author.name}</code><b>.</b>\n<b>Email:</b> <code>${message.author.email}</code><b>.</b>\n<b>Message:</b>\n<blockquote>${message.text}</blockquote>`,
			parse_mode: 'HTML'
		};
		const token = process.env.BOT_TOKEN;
		axios.post(`https://api.telegram.org/bot${token}/sendMessage`, data);	
	});
});

app.post('/bot', (req, res) => {
	const data = req.body;

	const message = {
		author: {
			type: 'agent',
			name: data.name
		},
		text: data.message
	};

	io.to(data.socket).emit('receiveTelegram', message);
	res.status(200);
});

app.post('/ban', async (req, res) => {
	const { email } = req.body;

	const userDB = await users.findOne({ where: { email: email } });
	if (userDB) await userDB.update({ banned: 1 });
	else await users.create({ email: email, banned: 1 });

	io.emit('banUser', email);

	res.status(200);
});

app.post('/live', async (req, res) => {
	const { email } = req.body;

	const userDB = await users.findOne({ where: { email: email } });
	if (userDB) await userDB.update({ live: 1 });
	else await users.create({ email: email, live: 1 });
    
	io.emit('enableLive', email);

	res.status(200);
});

db.sequelize.sync().then(() => {
	const { SERVER_HOST, SERVER_PORT } = process.env;
	server.listen(SERVER_PORT, () => {
		console.log(`Server listened on ${SERVER_HOST}:${SERVER_PORT}.`);
	});
});

module.exports = app;