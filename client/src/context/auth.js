import React,{createContext, useReducer} from 'react';
import jwtDecode from 'jwt-decode';

const initialState={
    user:null,
    postsData:null,
}

if(localStorage.getItem('jwtToken')){
    const decodedToken=jwtDecode(localStorage.getItem('jwtToken'));

    if(decodedToken.exp*1000<Date.now()){
        localStorage.removeItem('jwtToken');
    }else{
        initialState.user=decodedToken;
    }
};

const AuthContext=createContext({
    user: null,
    postsData:null,
    login: (userData) => {},
    loaddata: (postsData) => {},
    logout: () => {}
});

function authReducer(state, action){
    switch(action.type){
        case 'LOGIN':
            return{
                ...state,
                user: action.payload
            }
        case 'LOADDATA':
            return{
                ...state,
                postsData: action.payload
            }
        case 'LOGOUT':
            return{
                ...state,
                user: null
            }
        default:
            return state;
    }
}

function AuthProvider(props){
    const [state, dispatch]=useReducer(authReducer, initialState);

    function login(userData){
        localStorage.setItem("jwtToken", userData.token);
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }

    function loaddata(postsData){
        dispatch({
            type: 'LOADDATA',
            payload: postsData
        })
    }

    function logout(){
        localStorage.removeItem('jwtToken');
        dispatch({
            type: 'LOGOUT'
        })
    }

    return(
        <AuthContext.Provider value={{user:state.user, postsData:state.postsData ,login, logout, loaddata}} {...props}/>
    )
}

export {AuthContext, AuthProvider}