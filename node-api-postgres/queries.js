const Pool = require("pg").Pool;
const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "teatr",
  password: "admin",
  port: 5432
});

var getPlaysFreeSitsQuery = `SELECT s.id, s.nazwa, COUNT(m.numer_miejsca) AS "wolnemiejsca" FROM sztuka s, miejsca m
WHERE s.id = m.id_sztuki AND m.wolne = true
GROUP BY s.nazwa, s.id;`;

var getFreeSitsInPlay = `SELECT numer_miejsca FROM miejsca WHERE id_sztuki = $1 AND wolne = true;`;

const getPlays = (request, response) => {
  pool
    .query("SELECT * FROM sztuka ORDER BY id ASC")
    .then(res =>
      response.render("pages/admin", {
        plays: res.rows
      })
    )
    .catch(err => console.error("Error executing query", err.stack));
};

const homePage = (request, response) => {
  pool
    .query(getPlaysFreeSitsQuery)
    .then(res =>
      response.render("pages/home", {
        plays: res.rows
      })
    )
    .catch(err => console.error("Error executing query", err.stack));
};

const getAdmin = (request, response) => {
  pool
    .query("SELECT * from sztuka ORDER BY id ASC")
    .then(res =>
      response.render("pages/admin", {
        plays: res.rows
      })
    )
    .catch(err => console.error("Error executing query", err.stack));
};

const buyTicket = (request, response) => {
  console.log(parseInt(request.body.id_sztuki, 10));

  pool.query("BEGIN;");
  pool
    .query("SELECT data_sztuki, nazwa, id FROM sztuka WHERE id = $1;", [
      parseInt(request.body.id_sztuki, 10)
    ])
    .then(res => {
      pool
        .query(getFreeSitsInPlay, [parseInt(request.body.id_sztuki, 10)])
        .then(res1 => {
          response.render("pages/buyticket", {
            user: request.body,
            sztuka: res.rows[0],
            miejsca: res1.rows
          });
        })
        .catch(err => pool.query("ROLLBACK;"));
    })
    .catch(err => pool.query("ROLLBACK;"));
};

const ticketSuccess = (request, response) => {
  let imie = request.body.imie;
  let nazwisko = request.body.nazwisko;
  let id_sztuki = parseInt(request.body.id_sztuki, 10);
  let numer_miejsca = parseInt(request.body.numer_miejsca, 10);

  pool
    .query(
      "INSERT INTO bilety(numer_miejsca, imie, nazwisko, id_sztuki) VALUES($1,$2,$3,$4);",
      [numer_miejsca, imie, nazwisko, id_sztuki]
    )
    .then(res => response.render("pages/buysuccess"))
    .catch(err => {
      console.error("Error executing query", err.stack);
      pool.query("ROLLBACK;");
    });
  pool.query("COMMIT;");
};

const addPlay = (request, response) => {
  let nazwa = request.body.nazwa;
  let data = request.body.data;
  let godzina = request.body.godzina;
  let miejsca = request.body.miejsca;

  pool
    .query(
      "INSERT INTO sztuka(id, nazwa, data_sztuki, ilosc_miejsc) VALUES(nextval('prim'),$1, $2, $3);",
      [nazwa, data + " " + godzina, parseInt(miejsca, 10)]
    )
    .then(res => {
      pool
        .query("SELECT * from sztuka ORDER BY id ASC;")
        .then(plays => {
            response.render("pages/admin", {
            plays: plays.rows
          })
        })
        .catch(err => {
          console.error("Error executing query", err.stack);
        });

    })
    .catch(err => {
      console.error("Error executing query", err.stack);
    });
};

const updatePlay = (request, response) => {
  let nazwa = request.body.nazwa;
  let data = request.body.data;
  let godzina = request.body.godzina;
  let miejsca = request.body.miejsca;
  let id_sztuki = request.body.id_sztuki;

  console.log(request.body);

  pool
    .query("SELECT * from sztuka ORDER BY id ASC;")
    .then(res => {
      pool
        .query(
          "UPDATE sztuka set nazwa=$1, data_sztuki=$2, ilosc_miejsc=$3 where id=$4;",
          [nazwa, data + " " + godzina, parseInt(miejsca, 10), id_sztuki]
        )
        .then(res1 => {
          response.render("pages/admin", {
            plays: res.rows
          });
        })
        .catch(err => {
          console.error("Error executing query", err.stack);
        });
    })
    .catch(err => {
      console.error("Error executing query", err.stack);
    });
};

const deletePlay = (request, response) => {
  console.log(request.body);

  pool
    .query("DELETE from sztuka where id=$1;", [12])
    .then(res =>
      response.render("pages/admin", {
        plays: res.rows
      })
    )
    .catch(err => {
      console.error("Error executing query", err.stack);
    });
};

module.exports = {
  getPlays,
  homePage,
  buyTicket,
  ticketSuccess,
  getAdmin,
  addPlay,
  updatePlay,
  deletePlay
};
