import 'jquery/dist/jquery.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './NavBar.css'

import { React, useState, useContext, useRef } from 'react'
import { SearchBox } from '../form/input_fields/SearchBox';
import { Link } from 'react-router-dom';
import { getName } from '../../util/local_storage/local_storage'
import profile from '../../assets/icons/profile.png'
import { capitalizeName } from '../../util/capitalize_name'
import { ContextMenuContext } from '../../context/ContextMenuContext';
import { NavBarContext } from '../../context/NavBarContext';
import { searchSetOrRoom } from '../../api/api';
import { SearchList } from '../list/SearchList';
import {  useNavigate } from 'react-router';


export const HOME = 'home'
export const ACTIVITY = 'activity'


export const NavBar = (props) => {
    const { setMenuVisible } = useContext(ContextMenuContext)
    const navigate = useNavigate()
    const [searchRes, setSearchRes] = useState([]);
    const searchRef=useRef()

    const getLink = () => {
        if (window.location.pathname.includes(ACTIVITY)) { return ACTIVITY }
        if (window.location.pathname.includes(HOME)) { return HOME }
        return HOME
    }
    
    const [activePage, setActivePage] = useState(getLink())
    const [loadingNav, setLoadingNav] = useState(false)

    const linkClicked = (page) => {
        setMenuVisible(false)
        setActivePage(page)
    }

    function callBackOnSearchClick(search){
        searchRef.current.value=null
        setSearchRes([])
        
        if(search.type==='room'){
            navigate('/room/'+search._id, { replace: true })
        }
        if(search.type==='sets'){
            navigate('/folder/'+search._id, { replace: true })
        }
    }

    function addSearchResults(searchRes) {
        const searchlist=[]
        for(var i=0;i<searchRes.length;i++){
            searchlist.push(<SearchList key={searchRes[i]._id} value={searchRes[i]} callback={callBackOnSearchClick}/>)
        }
        return searchlist
    }
    function displaySearchResults(searchRes) {
        if (!searchRes) {
            return <></>
        }
        if (searchRes.length !== 0) {
            return <div className='search-results'>
                {addSearchResults(searchRes)}
            </div>
        } else {
            return <></>
        }
    }
    async function searchCallBack(id) {
        const response = await searchSetOrRoom(id)
        if (response.success === true) {
            setSearchRes(response.data.search)
        }
    }

    return (
        <NavBarContext.Provider value={{ loadingNav, setLoadingNav }}>
            <div >

                <nav className="navbar navbar-dark bg-dark sticky-top">
                    <Link className="navbar-brand" to="/" onClick={e => linkClicked(HOME)}>COSMOS</Link>
                    <div className='nav-menu'>
                        <Link className={`nav-item ${activePage === HOME ? 'active' : ''}`} to="/" onClick={e => linkClicked(HOME)}>Home <span className="sr-only"></span></Link>
                        <Link className={`nav-item ${activePage === ACTIVITY ? '' : ''}`} to="" onClick={e => linkClicked(HOME)}>Activity <span className="sr-only"></span></Link>
                        {/* <Link className={`nav-item ${activePage === ACTIVITY ? 'active' : ''}`} to="/activity" onClick={e => linkClicked(ACTIVITY)}>Activity <span className="sr-only"></span></Link> */}

                    </div>

                    <div className='search-bar'>
                        <SearchBox name="search" reference={searchRef} placeholder={'Search Sets or rooms..'} x={'5'} callback={searchCallBack} clear={()=>{setSearchRes([])}}/>
                        {displaySearchResults(searchRes)}
                    </div>
                    <Link className="username" to="/" >{capitalizeName(getName())}<img className='profile' src={profile} /></Link>

                </nav>

                {loadingNav ? <div className="loadingLine" /> : null}

                {props.children}

            </div>
        </NavBarContext.Provider >
    )
}
