const express = require('express')
require('dotenv').config()
const bodyparser = require('body-parser')
const path = require('path');
const app = express()

const stripe = require('stripe')(process.env.secretkey)

const port = 3030

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())

app.set('views', path.join(__dirname, 'public'))
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
	res.render('socket')
})

app.post('/payment', function (req, res) {
	stripe.customers.create({
			email: "demo@gmail.com",
			name: 'demo',
			address: {
				line1: 'paris',
				postal_code: '75000',
				city: 'mparos',
				state: 'paris',
				country: 'United States',
			},
			source: "tok_visa"
		})
		.then((customer) => {
			console.log(customer)

			return stripe.charges.create({
				amount: 2500, // Charing Rs 25 
				description: 'testing amount',
				currency: 'usd',
				customer: customer.id
			});
		})
		.then((charge) => {
			console.log(charge)

			res.sendFile(__dirname+'/public/completion.html') // If no error occurs 
		})
		.catch((err) => {
			res.send(err) // If some error occurs 
		});
})

app.listen(port, function (error) {
	if (error) throw error
	console.log("Server created Successfully")
})