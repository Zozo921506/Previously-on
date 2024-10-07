import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './login';
import Home from './home';
import DetailSerie from './details_serie';
import WatchedList from './user_watched_list';
import WatchedSerie from './user_watched_serie';
import UnWatchedSerie from './user_unwatched_serie';
import UserSearch from './user_search';
import FriendList from './friendlist';
import BlockedUser from './blocked_user';

const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Login />}></Route>
            <Route path='/home' element={<Home />}></Route>
            <Route path='/serie/:id' element={<DetailSerie />}></Route>
            <Route path='/member/series' element={<WatchedList />}></Route>
            <Route path='/member/watched_serie/:id' element={<WatchedSerie />}></Route>
            <Route path='/member/unwatched_serie/:id' element={<UnWatchedSerie />}></Route>
            <Route path='/member/search' element={<UserSearch />}></Route>
            <Route path='/member/friendlist' element={<FriendList />}></Route>
            <Route path='/member/blocked' element={<BlockedUser />}></Route> 
        </Routes>
    );
};

export default AppRouter;
