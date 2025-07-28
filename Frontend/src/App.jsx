import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [clickTrigger, setClickTrigger] = useState(false);
  const [data, setData] = useState({});
  const [username, setUserName] = useState("");
  const handleClick = () => {
    setUserName(document.getElementById('input').value)
    document.getElementById('input').value = ""
    setClickTrigger(prev => !prev); // Toggles the state
  };
  
  

  useEffect(() => {
    fetch(`http://localhost:3000/api/leetcode?username=${username}`)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      setData(res.data.matchedUser)
    })
    .catch(console.error);

    
  }, [clickTrigger])
  
  const info = data;

    return (
      <>
        <div className=' flex flex-col items-center justify-center h-screen bg-blue-300'>
          <div className='flex flex-col bg-blue-500 px-40 py-20 '>
            <div className='flex'>
              <p>Enter your username:</p>
              <input id='input' className='bg-white rounded-md mx-3' type="text" />
            </div>
            <button className='text-white bg-gray-600 m-4 p-2 rounded-md border-1 border-white hover:bg-gray-500 active:bg-gray-300' onClick={handleClick}>Submit</button>
          </div>
          <div id='box' className='flex flex-col bg-blue-500 px-40 py-20 m-2'>
            <div className=''>
              <img className='h-20 w-20 object-cover rounded-full' src={info?.profile?.userAvatar} alt="" />
            </div>
            <div>Name: {info?.profile?.realName ?? 'N/A'}</div>
            <div>Country: {info?.profile?.countryName ?? 'N/A'}</div>
            <div>Ranking: Ranking: {info?.profile?.ranking.toLocaleString('en-US') ?? 'N/A'}</div>
            <div>School/College: {info?.profile?.school ?? 'N/A'}</div>
          </div>

        </div>
      </>
    )
  }

  export default App
