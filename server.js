/*************************** 
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.   
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including web sites) or distributed to other students. 
*  
*  Name: Sunny Student ID: 128365210 Date: 20-01-2023
*  Cyclic Link:
****************************/
require('dotenv').config()
const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const MongoDB = require("./modules/moviesDB");
const db = new MongoDB()
const router = require('express').Router();
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(port, () => {
        console.log(`server listening on: ${port}`);
    });
    app.get("/", (req, res) => {
        res.send("Sunny ");
    });
    app.get('/api/movies', (req, res) => {
        if (req.query?.page && req.query?.perPage)
            db.getAllMovies(req.query?.page, req.query?.perPage, req.query?.title || "").then((movies) => {
                res.send({
                    status: 200,
                    movies: movies
                });
            }).catch((e) => {
                console.log("error----------", e);
            })
        else {
            res.send({
                status: 400,
                error: "page & perPage required"
            });

        }
    });
    app.post('/api/movies', async (req, res) => {
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
            res.send({
                status: 201,
                movie: movie
            });
        }).catch((error) => {
            res.send({
                status: 400,
                error: error
            });
        })
    })
    app.get('/api/movies/:id', (req, res) => {
        console.log("req.params.id", req.params.id);
        if (req.params.id) {
            db.getMovieById(req.params?.id).then((movie) => {
                if (movie)
                    res.send({
                        status: 200,
                        movie: movie
                    });
                else {
                    res.send({
                        status: 204,
                        error: "No Movie Found"
                    });
                }
            }).catch((e) => {
                console.log("error----------", e.message);
                res.send({
                    status: 400,
                    error: "Movie details not found"
                });
            })
        } else {
            res.send({
                status: 400,
                error: "id not found"
            });
        }
    });
    app.put("/api/movies/:id", async (req, res) => {
        db.updateMovieById(req.body, req.params.id).then((movie) => {
            res.send({
                status: 200,
                movie: movie,
                message: "Movie updated successfully"
            });
        }).catch((error) => {
            res.send({
                status: 400,
                error: error
            });
        })
    })
    app.delete("/api/movies/:id", async (req, res) => {
        db.deleteMovieById(req.params.id).then(() => {
            res.send({
                status: 200,
                message: "Movie deleted successfully"
            });
        }).catch((error) => {
            res.send({
                status: 500,
                error: error
            });
        })
    })
}).catch((err) => {
    console.log("db.initialize error ", err);
});