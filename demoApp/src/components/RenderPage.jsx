import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

import noImage from '../assets/noImage.jpg';
import logo from '../assets/logo.png';

const RenderPage = () => {
    const location = useLocation();
    console.log('Location state:', location.state);
    const city = location.state && location.state.city;

    const [data, setData] = useState([]);

    useEffect(() => {
        if (!city) {
          console.error("City not provided");
          return;
        }
    
        import(`../../../puppeteer/data${city}.json`)
          .then((importedData) => {
            setData(importedData.default);
          })
          .catch((error) => {
            console.error(`Error loading data: ${error}`);
          });
      }, [city]);
    

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 9;

    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentItems = data.slice(firstIndex, lastIndex);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    return (
        <div className="flex flex-col justify-center items-center">
            <Link to="/">
                <img src={logo} alt="logo" id="logo" className="mx-auto mt-4 mb-4 w-auto h-24" />
            </Link>
            <div className="grid grid-cols-3 gap-4 mr-3 ml-3">
                {currentItems.map((item, index) => (
                    <div key={index} className="p-10 bg-white shadow-lg rounded-lg">
                        <h1 className="text-xl font-bold mb-2">{item.title}</h1>
                        <p className="text-lg mb-2">Price: {item.price}</p>
                        <p className="text-lg mb-2">Surface: {item.surface}</p>
                        <p className="text-lg mb-2">Location: {item.location}</p>
                        <img 
                            src={item.imagePath === "https://www.olx.ro/app/static/media/no_thumbnail.c222b0530.svg" ? noImage : item.imagePath} 
                            alt={item.title} 
                            className="w-64 h-64 object-cover object-center mb-4"
                        />
                        <a href={item.url} className="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-green-500 rounded shadow ripple hover:shadow-lg hover:bg-green-600 focus:outline-none">
                            View More
                        </a>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4">
                <button 
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)} 
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 disabled:opacity-50"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="text-lg">{currentPage} of {totalPages}</span>
                <button 
                    onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : currentPage)} 
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 disabled:opacity-50"
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default RenderPage;