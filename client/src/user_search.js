import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const UserSearch = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const token = localStorage.getItem("access_token");
    const client_id = localStorage.getItem("client_id");

    const getUsers = async () => {
        const url = `https://api.betaseries.com/members/search?login=%25${search}%25&limit=100`;
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
                console.log(data);
                setUsers(data.users);
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

    const sendFriendRequest = async (e, id_user) => {
        e.preventDefault();
        console.log(id_user);
        const url = `https://api.betaseries.com/friends/friend?id=${id_user}`;
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
                console.log('Friend added');
                alert("Amis ajouté");
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

    const blockUser = async (e, id_user) => {
        e.preventDefault();
        const url = `https://api.betaseries.com/friends/block?id=${id_user}`;
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
                console.log('User has been blocked');
                alert("L'utilisateur à été bloqué");
            }
        }
        catch (e)
        {
            console.error(e);
        }
    }

    useEffect(() => {
        if (search.length >= 2)
        {
            getUsers();
        }
        else
        {
            console.log('Less than 2 char');
        }

    }, [search]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

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
                    <Link to='/member/search'>Rechercher un ami</Link>
                    <Link to='/member/blocked'>Utilisateur bloqué</Link>
                </div>
            </nav>
            <div className='white'>
                {search.length >= 2 ? (
                    <>
                        {users.map((user) => {
                            return <div key={user.id}>
                                <p>{user.login}</p>
                                <button onClick={(e) => sendFriendRequest(e, user.id)}>Demande d'amis</button>
                                <button onClick={(e) => blockUser(e, user.id)} className='remove_serie'>&#9940;</button>
                            </div>
                        })}
                    </>
                ) : (
                    <p>Vous avez besoin de 2 caractères au minimum pour afficher votre recherche</p>
                )}
            </div>
        </>
    );
};

export default UserSearch;
