const router = require('express').Router();
const path = require('path');
const MongoDB = require("../modules/moviesDB");
const db = new MongoDB()
db.initialize(process.env.MONGODB_CONN_STRING).then((data) => {
    router.get('/', (req, res) => {
        res.redirect('/AllMovies?page=1&perPage=10&title=')
    });
    router.get('/AllMovies', (req, res) => {
        db.getAllMovies(req.query?.page || 1, req.query?.perPage || 10, req.query?.title || "").then((movies) => {
            res.render(path.join(__dirname, '../views/'), {
                movies: movies,
                page: req.query?.page || 1,
                perPage: req.query?.perPage,
                title: req.query?.title || ""
            });
        }).catch((e) => {
            console.log("error----------", e);
        })
    });
    router.post('/AllMovies', async (req, res) => {
        res.redirect('/AllMovies?page=' + req.body.page + "&perPage=" + req.body.perPage + "&title=" + req.body.title)
    })
    router.get('/Movie', (req, res) => {
        if (req.query?.id) {
            db.getMovieById(req.query?.id).then((movie) => {
                if (movie)
                    res.render(path.join(__dirname, '../views/Movie'), {
                        movie: movie,
                    });
                else {
                    res.render(path.join(__dirname, '../views/error'), {
                        errorCode: 204,
                        error: "No Movie Found"
                    });
                }
            }).catch((e) => {
                console.log("error----------", e);
            })
        } else {
            res.redirect('/')
        }

    });
    router.get('/Movie/add', (req, res) => {
        res.render(path.join(__dirname, '../views/AddMovie'));
    });
    router.post('/Movie/add', async (req, res) => {
        console.log("req.body", req.body);
        db.addNewMovie({
            plot: req.body.plot,
            genres: req.body.genres.split(","),
            runtime: Math.random(),
            cast: req.body.cast.split(","),
            num_mflix_comments: Math.random(),
            poster: req.body.poster,
            title: req.body.title,
            fullplot: req.body.fullplot,
            languages: req.body.languages.split(","),
            released: new Date(),
            directors: req.body.directors.split(","),
            rated: "PASSED",
            awards: {
                wins: Math.random(),
                nominations: Math.random(),
                text: "win"
            },
            lastupdated: new Date(),
            year: req.body.year,
            imdb: {
                rating: req.body.rating,
                votes: Math.random(),
                id: Math.random()
            },
            countries: req.body.countries.split(","),
            type: req.body.type,
            tomatoes: {
                viewer: {
                    rating: Math.random(),
                    numReviews: Math.random(),
                    meter: Math.random()
                },
                dvd: new Date(),
                lastUpdated: new Date()
            }
        }).then((movie) => {
            res.redirect('/Movie?id=' + movie.id);
        }).catch((error) => {
            console.log("addNewMovie error", error);
            res.render(path.join(__dirname, '../views/error'), {
                errorCode: 500,
                error: "Movie not Added"
            });
        })
    })
    router.get('/Movie/delete/:id', (req, res) => {
        if (req.params.id)
            db.deleteMovieById(req.params.id).then(() => {
                res.redirect('/')
            }).catch((error) => {
                res.render(path.join(__dirname, '../views/error'), {
                    errorCode: 500,
                    error: error
                });
                console.log('Some Error Occurred', error);
            })
        else {
            res.redirect('/')
        }
    });
    router.get('/Movie/Edit/:id', (req, res) => {
        db.getMovieById(req.params?.id).then((movie) => {
            if (movie)
                res.render(path.join(__dirname, '../views/EditMovie'), {
                    movie: movie,
                });
            else {
                res.render(path.join(__dirname, '../views/error'), {
                    errorCode: 204,
                    error: "No Movie Found"
                });
            }
        }).catch((e) => {
            console.log("error----------", e);
        })

    });
    router.post("/Movie/Edit/:id", async (req, res) => {
        db.updateMovieById(req.body, req.params.id).then(() => {
            res.redirect('/Movie?id=' + req.params.id)
        }).catch((error) => {
            res.render(path.join(__dirname, '../views/error'), {
                errorCode: 404,
                error: error
            });
            console.log('Some Error Occurred', error);
        })
    })

}).catch((err) => {
    console.log("catch", err);
});

module.exports = router;