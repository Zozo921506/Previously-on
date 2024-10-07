import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
    const [series, setSeries] = useState([]);
    const [search, setSearch] = useState('');
    const token = localStorage.getItem("access_token");
    const client_id = localStorage.getItem("client_id");

    const getSeries = async () => {
        const url = 'https://api.betaseries.com/shows/list';
        try
        {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-BetaSeries-Key': client_id,
                }
            });

            if (response.ok)
            {
                const data = await response.json();
                setSeries(data.shows);
                console.log(data);
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
    };

    const getEpisodes = async (e, id_serie) => {
        e.preventDefault();
        const url = `https://api.betaseries.com/shows/episodes?id=${id_serie}&client_id=${client_id}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            
            if (response.ok)
            {
                const data = await response.json();
                const episodeIds = data.episodes.map((episode) => episode.id);
                const max = Math.max(...episodeIds);
                watchedSerie(max);
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

    const watchedSerie = async (id_episode) => {
        const url = `https://api.betaseries.com/episodes/watched?id=${id_episode}&bulk=true`;
        try
        {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'X-BetaSeries-Key': client_id,
                    'X-BetaSeries-Token': token
                }
            });

            if (response.ok)
            {
                console.log('Serie successfully added to your watched list');
                alert('Série ajouter avec succès à vos séries');
            }
        }
        catch (e)
        {
            console.error(e);
        }
    }

    useEffect(() => {
        getSeries();
    }, []);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredSeries = series.filter(serie =>
        serie.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <nav className='navbar'>
                <h1 className='logo'>PreviouslyOn</h1>
                <input 
                    type='text'
                    className='search'
                    placeholder='Recherche'
                    value={search}
                    onChange={handleSearchChange}
                />
                <div className='user_infos'>
                    <Link to='/member/series'>Vos séries</Link>
                    <Link to='/member/friendlist'>Amis</Link>
                </div>
            </nav>
            
            <div className='white'>
                {filteredSeries.map((serie) => (
                    <div key={serie.id}>
                        <Link to={`/serie/${serie.id}`}>
                            <h3>{serie.title}</h3>
                            <img src={serie.images.poster} alt={serie.title} />
                        </Link>
                        <button className='serievisonner' onClick={(e) => getEpisodes(e, serie.id)}>Série visionné</button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Home;
