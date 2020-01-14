const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'teatr',
  password: 'admin',
  port: 5432,
})

var getPlaysFreeSitsQuery = `SELECT s.id, s.nazwa, COUNT(m.numer_miejsca) AS "wolnemiejsca" FROM sztuka s, miejsca m
WHERE s.id = m.id_sztuki AND m.wolne = true
GROUP BY s.nazwa, s.id;`

var getFreeSitsInPlay = `SELECT numer_miejsca FROM miejsca WHERE id_sztuki = $1 AND wolne = true;`

const getPlays = (request, response) => {
  pool
  	.query('SELECT * FROM sztuka ORDER BY id ASC')
  	.then(res => response.render('pages/admin', {
  		plays: res.rows
  	}))
  	.catch(err => console.error('Error executing query', err.stack))
}

const homePage = (request, response) => {
	pool
		.query(getPlaysFreeSitsQuery)
		.then(res => response.render('pages/home', {
			plays: res.rows
		}))
		.catch(err => console.error('Error executing query', err.stack))
}



const buyTicket = (request, response) => {
	var sztukaData = [];
	console.log(parseInt(request.body.id_sztuki, 10))
	
	pool.query('BEGIN;')
	pool
		.query('SELECT data_sztuki, nazwa, id FROM sztuka WHERE id = $1;', [parseInt(request.body.id_sztuki, 10)])
		.then(res => {
			pool
				.query(getFreeSitsInPlay, [parseInt(request.body.id_sztuki, 10)])
				.then(res1 => {
					response.render('pages/buyticket', {
	  					user: request.body,
	  					sztuka: res.rows[0],
	  					miejsca: res1.rows
					});
				})
				.catch(err => pool.query('ROLLBACK;'))
		}) 
		.catch(err => pool.query('ROLLBACK;'))

}

const ticketSuccess = (request, response) => {
	let imie = request.body.imie
	let nazwisko = request.body.nazwisko
	let id_sztuki = parseInt(request.body.id_sztuki, 10)
	let numer_miejsca = parseInt(request.body.numer_miejsca, 10)

	pool
		.query('INSERT INTO bilety(numer_miejsca, imie, nazwisko, id_sztuki) VALUES($1,$2,$3,$4);', [numer_miejsca, imie, nazwisko, id_sztuki])
		.then(res => response.render('pages/buysuccess'))
		.catch(err => {
			console.error('Error executing query', err.stack)
			pool.query('ROLLBACK;')
		})
	pool.query('COMMIT;')
}

module.exports = {
	getPlays,
	homePage,
	buyTicket,
	ticketSuccess
}




