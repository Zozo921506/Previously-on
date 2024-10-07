import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './details_serie.css';

const WatchedSerie = () => {
    const [serie, setSerie] = useState([]);
    const { id } = useParams();
    const [image, setImage] = useState('');
    const [genres, setGenres] = useState([]);
    const [seasons, setSeasons] = useState({});
    const token = localStorage.getItem("access_token");
    const client_id = localStorage.getItem("client_id");

    const getDetail = async () => {
        const url = `https://api.betaseries.com/shows/display?id=${id}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-BetaSeries-Key': client_id
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSerie(data.show);
                setImage(data.show.images.show);
                setGenres(Object.values(data.show.genres));
            } else {
                console.log(response);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const getSeasons = async () => {
        const url = `https://api.betaseries.com/shows/episodes?id=${id}&client_id=${client_id}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const episodesBySeason = data.episodes.reduce((tab, episode) => {
                    console.log(data);
                    const seasonNumber = episode.season;
                    if (!tab[seasonNumber]) {
                        tab[seasonNumber] = [];
                    }
                    tab[seasonNumber].push(episode);
                    return tab;
                }, {});
                setSeasons(episodesBySeason);
                console.log(episodesBySeason);
            } else {
                console.log(response);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const removeWatchedEpisode = async (e, episode_id) => {
        e.preventDefault();
        const url = `https://api.betaseries.com/episodes/watched?id=${episode_id}`;
        try
        {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'X-BetaSeries-Key': client_id,
                    'X-BetaSeries-Token': token
                }
            })
    
            if (response.ok)
            {
                console.log("Successfully remove the episode to your watched list");
                alert("La suppression a bien été effectué");
                getSeasons();
            }
            else
            {
                console.log(response);
            }
        }
        catch (e)
        {
            console.error(e);
        }
    }

    useEffect(() => {
        getDetail();
        getSeasons();
    }, []);

    return (
        <div className="container">
            <h1 className="serie-title">{serie.title}</h1>

            <div className="serie-image">
                <img src={image} alt={serie.title} />
            </div>

            <div className="description">
                <h3>Description</h3>
                <p>{serie.description}</p>
            </div>

            <div className="serieinfo">
                <div className="serieinfoglob">
                    <h3>Nombre de saison</h3>
                    <p>{serie.seasons}</p>
                </div>
                <div className="serieinfoglob">
                    <h3>Nombre d'épisode</h3>
                    <p>{serie.episodes}</p>
                </div>
            </div>

            <div className="genres">
                <h3>Genres</h3>
                {genres.map((genre) => (
                    <p key={genre}>{genre}</p>
                ))}
            </div>

            <div className="seasons">
                <h3>Saisons</h3>
                {Object.keys(seasons).map((seasonNumber) => (
                    <div key={seasonNumber} className="season-block">
                        <h4 className="title">Season {seasonNumber}</h4>
                        <ul className="episodes">
                            {seasons[seasonNumber].map((episode) => (
                                episode.user.seen ? (
                                    <li key={episode.id}>
                                        <p><strong>Episode {episode.episode}: {episode.title}</strong></p>
                                        {episode.description ? (
                                            <p>Description: {episode.description}</p>
                                        ) : (<></>)}
                                        <p>Date {episode.date}</p>
                                        {episode.note.total > 0 ? (
                                            <p>Moyenne {(parseFloat(episode.note.moyenne)).toFixed(2)}</p>
                                        ) : (
                                            <p>Cette épisode n'a pas encore de note</p>
                                        )}
                                        <button className="episodevue" onClick={(e) => removeWatchedEpisode(e, episode.id)}>Episode non visionné</button>
                                    </li>
                                ) : (<div key={episode.id}></div>)
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WatchedSerie;