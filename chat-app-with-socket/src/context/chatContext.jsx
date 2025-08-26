import { createContext, useEffect, useState } from "react";

export const Chatcontext = createContext();

const Chatprovider = ({ children }) => {
  const [user, setuser] = useState(null);
    const [loading, setLoading] = useState(true); // ⬅ حالة تحميل

  const [selectchat, setselectchat] = useState();
  const [chats, setchats] = useState();

  useEffect(() => {
    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
     if (userinfo) {
      setuser(userinfo);
    }
    setLoading(false);
  }, []);

  return (
    <Chatcontext.Provider value={{ chats, setchats,user, setuser,loading ,selectchat, setselectchat}}>
      {children}
    </Chatcontext.Provider>
  );
};

export default Chatprovider;
