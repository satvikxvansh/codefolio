import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [clickTrigger, setClickTrigger] = useState(false);
  const [data, setData] = useState({});
  const [username, setUserName] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  }; //for dropdown menu

  const handleClick = () => {
    setUserName(document.getElementById('input-username').value)
    document.getElementById('input-username').value = ""
    setClickTrigger(prev => !prev); // Toggles the state
  };

  if (selectedValue == 'codeforces') {

  } else {
    useEffect(() => {
      fetch(`http://localhost:3000/api/leetcode?username=${username}`)
        .then(res => res.json())
        .then(res => {
          console.log(res);
          setData(res.data.matchedUser)
        })
        .catch(console.error);
    }, [clickTrigger])
  }
  const info = data;

  return (
    <>
      <div className=' flex flex-col items-center justify-center bg-[#DFECF1]'>
        <div className='rounded-4xl flex flex-col bg-[#d0e1e9] px-20 py-10 '>
          <div className='flex flex-row'>
            <label htmlFor="dropdown" className="block mb-2 text-lg font-medium p-4">
              Select Platform:
            </label>
            <select
              id="dropdown"
              value={selectedValue}
              onChange={handleChange}
              className="m-2 h-10 border rounded-lg"
            >
              <option value="">Select</option>
              <option value="leetcode">Leetcode</option>
              <option value="codeforces">Codeforces</option>
              {/* <option value="angular">Angular</option> */}
            </select>
          </div>
          <div className='flex'>
            <p>Enter your username:</p>
            <input id='input-username' className='bg-white rounded-md mx-3' type="text" />
          </div>
          <button className='text-white bg-gray-600 m-4 p-2 rounded-md border-1 border-white hover:bg-gray-500 active:bg-gray-300' onClick={handleClick}>Submit</button>
        </div>

        <div className='rounded-4xl flex flex-row bg-[#d0e1e9] px-40 py-20 m-2'>
          <div id='leetcode' className='rounded-4xl flex flex-col bg-[#000000] px-40 py-20 m-2'>
            <div className='text-white font-semibold text-4xl'>Leetcode Stats</div>
            <div className=''>
              <img className='h-20 w-20 object-cover rounded-full' src={info?.profile?.userAvatar} alt="" />
            </div>
            <div className='text-[#A9A9A9]'>
              <div>Name: {info?.profile?.realName ?? 'N/A'}</div>
              <div>Country: {info?.profile?.countryName ?? 'N/A'}</div>
              <div>Ranking: Ranking: {info?.profile?.ranking.toLocaleString('en-US') ?? 'N/A'}</div>
              <div>School/College: {info?.profile?.school ?? 'N/A'}</div>
            </div>
          </div>

          <div id='codeforces' className='rounded-4xl flex flex-col bg-[#000000] px-40 py-20 m-2'>
            <div className='text-white font-semibold text-4xl'>Codeforces Stats</div>
            <div className=''>
              <img className='h-20 w-20 object-cover rounded-full' src={info?.profile?.userAvatar} alt="" />
            </div>
            <div className='text-[#A9A9A9]'>
              <div>Name: {info?.profile?.realName ?? 'N/A'}</div>
              <div>Country: {info?.profile?.countryName ?? 'N/A'}</div>
              <div>Ranking: Ranking: {info?.profile?.ranking.toLocaleString('en-US') ?? 'N/A'}</div>
              <div>School/College: {info?.profile?.school ?? 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Contest Info */}
        <div>
        </div>
      </div>
    </>
  )
}

export default App
