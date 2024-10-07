import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './user_watched.css';

const WatchedList = () => {
    const token = localStorage.getItem("access_token");
    const [series, setSeries] = useState([]);
    const client_id = localStorage.getItem("client_id");

    const getWatchedSeries = async () => {
        const url = `https://api.betaseries.com/shows/member?client_id=${client_id}`;
        try
        {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })

            if (response.ok)
            {
                const data = await response.json();
                console.log(data);
                setSeries(data.shows);
            }
            else
            {
                console.log(response)
            }
        }
        catch (e)
        {
            console.error(e);
        }
    }

    const removeSerie = async (e, id_serie) => {
        e.preventDefault();
        const url = `https://api.betaseries.com/shows/show?id=${id_serie}`;
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
                console.log('Serie successfully deleted');
                alert('Série supprimée de vos séries');
                getWatchedSeries();
            }
        }
        catch (e)
        {
            console.error(e);
        }
    }

    useEffect(() => {
        getWatchedSeries();
    }, [])

    return (
        <div>
            <h1 className='serievue'>Séries visionnées</h1>
            <div className='white'>
                {series.map((serie) => {
                    return <div key={serie.id}>
                        <h3>{serie.title}</h3>
                        <img src={serie.images.poster} alt={serie.title} />
                        <div className='serie_link'>
                            <Link to={`/member/watched_serie/${serie.id}`}>Episode visionnés</Link>
                            <Link to={`/member/unwatched_serie/${serie.id}`}>Episode non visionnés</Link>
                            <button onClick={(e) => removeSerie(e, serie.id)} className='remove_serie'>&#10060;</button>
                        </div>
                    </div>
                })}
            </div>
        </div>
    );
};

export default WatchedList;