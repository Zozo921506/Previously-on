import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FriendList = () => {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("access_token");
    const client_id = localStorage.getItem("client_id");

    const getFriends = async () => {
        const url = `https://api.betaseries.com/friends/list?client_id=${client_id}`;
        try 
        {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
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

    const removeFriend = async (e, id_user) => {
        e.preventDefault();
        const url = `https://api.betaseries.com/friends/friend?id=${id_user}`;
        try
        {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'X-BetaSeries-Key': client_id,
                    'X-BetaSeries-Token': token
                }
            });

            if (response.ok)
            {
                console.log('Friend deleted');
                alert('Amis supprimé avec succès');
                getFriends();
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
                getFriends();
            }
        }
        catch (e)
        {
            console.error(e);
        }
    }

    useEffect(() => {
        getFriends();
    }, []);

    return (
        <>
            <nav className='navbar'>
                <h1 className='logo'>PreviouslyOn</h1>
                <input 
                    type='text'
                    className='search'
                    placeholder='Recherche'
                />
                <div className='user_infos'>
                    <Link to='/member/series'>Vos séries</Link>
                    <Link to='/member/friendlist'>Amis</Link>
                    <Link to='/member/search'>Rechercher un ami</Link>
                    <Link to='/member/blocked'>Utilisateur bloqué</Link>
                </div>
            </nav>
            <div className='white'>
                {users ? (
                    users.map((user) => {
                        return <div key={user.id}>
                            <p>{user.login}</p>
                            <button onClick={(e) => removeFriend(e, user.id)} className='remove_serie'>&#10060;</button>
                            <button onClick={(e) => blockUser(e, user.id)} className='remove_serie'>&#9940;</button>
                        </div>
                    })
                ) : (
                <p>Vous n'avez pas encore ajoutés des amis</p>
                )}
            </div>
        </>
    );
};

export default FriendList;