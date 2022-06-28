import { useState, useCallback, useEffect } from 'react';

let logoutTimer;
export const useAuth = () =>{
    const [token, setToken] = useState(false);
    const [userId, setUserId] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const login = useCallback((userId, token, expirationDate) => {
      setUserId(userId);
      setToken(token);
      const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem( 
        "userData",
        JSON.stringify({
          userId: userId,
          token: token,
          expirationDate: tokenExpirationDate.toISOString(),
        })
      );
    }, []);
  
    const logout = useCallback(() => {
      setToken(null);
      setTokenExpirationDate(null)
      setUserId(null);
      localStorage.removeItem("userData");
    }, []);
  
    useEffect(()=>{
      if(token && tokenExpirationDate){
        console.log(tokenExpirationDate)
        const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
        logoutTimer = setTimeout(logout, remainingTime)
      } else { 
        clearTimeout(logoutTimer);
      }
    },[token, logout, tokenExpirationDate])
  
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      if (storedData?.token && new Date(storedData.expirationDate) > new Date() ) {
        login(storedData.userId, storedData.token, new Date(storedData.expirationDate));
      }
    }, [login]);

    return {token, login, logout, userId};
};