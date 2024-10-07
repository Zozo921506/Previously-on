import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BlockedUser = () => {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("access_token");
    const client_id = localStorage.getItem("client_id");

    const getBlockedUser = async () => {
        const url = `https://api.betaseries.com/friends/list?client_id=${client_id}&blocked=true`;
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

    const unblockUser = async (e, id_user) => {
        e.preventDefault();
        const url = `https://api.betaseries.com/friends/block?id=${id_user}`;
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
                console.log('User has been unblocked');
                alert("Lutilisateur à été débloqué");
                getBlockedUser();
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
        getBlockedUser();
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
                {users.total > 0 ? (
                    users.map((user) => {
                        return <div key={user.id}>
                            <p>{user.login}</p>
                            <button onClick={(e) => unblockUser(e, user.id)} className='remove_serie'>&#9989;</button>
                        </div>
                    })
                ) : (
                <p>Vous n'avez pas encore d'utilisateurs bloqué</p>
                )}
            </div>
        </>
    );
};

export default BlockedUser;