import React from 'react';
import Select from 'react-select';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';

import logo from '../assets/logo.png';

const FormPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [city, setCity] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const navigate = useNavigate();

  const options = [
    { value: 'arad', label: 'Arad' },
    { value: 'bacau', label: 'Bacau' },
    { value: 'braila', label: 'Braila' },
    { value: 'brasov', label: 'Brasov' }, 
    { value: 'bucuresti', label: 'Bucuresti' },
    { value: 'cluj-napoca', label: 'Cluj' },
    { value: 'buzau', label: 'Buzau' },
    { value: 'constanta', label: 'Constanta' },
    { value: 'galati', label: 'Galati' },
    { value: 'iasi_39939', label: 'Iasi' },
    { value: 'sibiu', label: 'Sibiu' },
    { value: 'suceava', label: 'Suceava' },
    { value: 'timisoara', label: 'Timisoara'},
  ];

  const sendCityToBackend = async () => {
    if(!city) {
      console.log('City is not selected!');
      return;
    }

    setIsLoading(true);
    try{
      const response = await fetch('http://localhost:3000/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: city.value,
          minPrice: minPrice,
          maxPrice: maxPrice,
        })
      });
      if(!response.ok){
        throw new Error('Request failed!');
      }

      const data = await response.json();
      console.log(data);

      console.log("Navigating to '/rents' with city:", city);
      navigate('/rents', { state: {city: city.value }});

    } catch (error) {
        console.log('An Error occured' + error);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <img src={logo} alt="logo" id="logo" className="mx-auto mt-4 w-auto h-24" />
      {isLoading && (
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-10 mt-4">Getting best data for you...</h1>
          <SyncLoader color={'#36D7B7'} loading={isLoading} size={40} />
        </div>
      )}
      <div className={`flex flex-col items-center justify-center h-screen ${isLoading ? 'hidden' : ''}`}>
          <h1 className="text-4xl font-bold text-center mt-4 mb-4">Find the best rent in<br/> your <span id="uni">Uni Town!🏫</span></h1>

          <div className="flex items-center mt-4">
            <h1 className="text-2xl font-bold text-center mr-3">Choose your city:</h1>
            <Select options={options} 
                    className="w-64 text-l" 
                    menuPlacement='auto' 
                    maxMenuHeight={200}
                    value={city}
                    onChange={setCity} />
            
          </div>

          <div className="flex items-center mt-2">
            <h1 className="text-2xl font-bold text-center mr-3">Starting price</h1>
            <input type="number" 
                  className="text-xl pl-2 rounded" 
                  placeholder="Min €"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)} />
          </div>

          <div className="flex items-center mt-2">
            <h1 className="text-2xl font-bold text-center mr-3">Ending price</h1>
            <input type="number" 
                  className="text-xl pl-2 rounded" 
                  placeholder="Max €"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)} />
          </div>

          <button className="bg-green-500 hover:bg-green-600 text-white font-bold text-l py-2 px-4 rounded mt-4"
                  onClick={sendCityToBackend}>Search</button>
      </div>
    </div>
  );
}

export default FormPage;