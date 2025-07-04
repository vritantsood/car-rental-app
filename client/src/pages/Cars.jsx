import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import assets, { dummyCarData } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
const Cars = () => {

  //getting search params from url
  const [searchParams]=useSearchParams()
  const pickupLocation=searchParams.get("pickupLocation")
  const pickupDate=searchParams.get("pickupDate")
  const returnDate=searchParams.get("returnDate")
  const {cars,axios}=useAppContext()

  const isSearchData=pickupLocation && pickupDate && returnDate
  const [filteredCars,setFilteredCars]=useState([])

  const applyFilter=async()=>{
    if(input === ""){
      setFilteredCars(cars);
      return null;
    }
  }


  const searchCarAvailability=async()=>{
    const{data}=await axios.post("/api/bookings/check-availability",{location :pickupLocation,pickupDate,returnDate})
    if(data.success){
      setFilteredCars(data.availableCars)
      if(data.availableCars.length===0){
        toast("No cars available")
      }
      return null
    }
  }
  useEffect(()=>{
    isSearchData && searchCarAvailability()
  },[])

  


  const [input, setInput] = useState("");

  useEffect(()=>{
    cars.length>0 && !isSearchData && applyFilter()
  },[input,cars])

  
  const [showSidebar, setShowSidebar] = useState(false);
  const [filters, setFilters] = useState({
    seating_capacity: [],
    fuel_type: [],
    transmission: [],
    category: [],
    location: [],
  });
  const [sortOption, setSortOption] = useState("");
  const handleCheckboxChange = (category, value) => {
    setFilters((prev) => {
      const current = prev[category];
      const isChecked = current.includes(value);

      return {
        ...prev,
        [category]: isChecked
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const handleReset = () => {
    setInput("");
    setFilters({
      seating_capacity: [],
      fuel_type: [],
      transmission: [],
      category: [],
      location: [],
    });
    setSortOption("");
  };

  // Filter logic
  const filteringCars = filteredCars.filter((car) => {
    const searchStr =
      `${car.brand} ${car.model} ${car.description}`.toLowerCase();
    const matchesSearch = searchStr.includes(input.toLowerCase());

    const matchesSeats =
      filters.seating_capacity.length === 0 ||
      filters.seating_capacity.includes(car.seating_capacity.toString());

    const matchesFuel =
      filters.fuel_type.length === 0 ||
      filters.fuel_type.includes(car.fuel_type);

    const matchesTransmission =
      filters.transmission.length === 0 ||
      filters.transmission.includes(car.transmission);

    const matchesCategory =
      filters.category.length === 0 || filters.category.includes(car.category);

    const matchesLocation =
      filters.location.length === 0 || filters.location.includes(car.location);

    return (
      matchesSearch &&
      matchesSeats &&
      matchesFuel &&
      matchesTransmission &&
      matchesCategory &&
      matchesLocation
    );
  });

  // Sort logic
  const sortedCars = [...filteringCars].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.pricePerDay - b.pricePerDay;
      case "price-desc":
        return b.pricePerDay - a.pricePerDay;
      case "year-desc":
        return b.year - a.year;
      case "year-asc":
        return a.year - b.year;
      default:
        return 0;
    }
  });

  // Extract unique locations and categories dynamically
  const uniqueLocations = [...new Set(filteredCars.map((car) => car.location))];
  const uniqueCategories = [
    ...new Set(filteredCars.map((car) => car.category)),
  ];

  return (
    <div className="min-h-screen bg-light flex">
      {/* Sidebar */}
      <aside className="hidden md:block sticky top-18 self-start w-64 bg-white shadow-lg p-6 max-h-screen overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>

        {/* Seats */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">
            Seating Capacity
          </label>
          {["2", "4", "5", "7"].map((seat) => (
            <div key={seat} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`seat-${seat}`}
                checked={filters.seating_capacity.includes(seat)}
                onChange={() => handleCheckboxChange("seating_capacity", seat)}
                className="mr-2"
              />
              <label htmlFor={`seat-${seat}`} className="text-sm text-gray-600">
                {seat} seats
              </label>
            </div>
          ))}
        </div>

        {/* Fuel Type */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Fuel Type</label>
          {["Petrol", "Diesel", "Hybrid"].map((type) => (
            <div key={type} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`fuel-${type}`}
                checked={filters.fuel_type.includes(type)}
                onChange={() => handleCheckboxChange("fuel_type", type)}
                className="mr-2"
              />
              <label htmlFor={`fuel-${type}`} className="text-sm text-gray-600">
                {type}
              </label>
            </div>
          ))}
        </div>

        {/* Transmission */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Transmission</label>
          {["Automatic", "Manual", "Semi-Automatic"].map((trans) => (
            <div key={trans} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`trans-${trans}`}
                checked={filters.transmission.includes(trans)}
                onChange={() => handleCheckboxChange("transmission", trans)}
                className="mr-2"
              />
              <label
                htmlFor={`trans-${trans}`}
                className="text-sm text-gray-600"
              >
                {trans}
              </label>
            </div>
          ))}
        </div>

        {/* Car Category */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Category</label>
          {uniqueCategories.map((category) => (
            <div key={category} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`category-${category}`}
                checked={filters.category.includes(category)}
                onChange={() => handleCheckboxChange("category", category)}
                className="mr-2"
              />
              <label
                htmlFor={`category-${category}`}
                className="text-sm text-gray-600"
              >
                {category}
              </label>
            </div>
          ))}
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Location</label>
          {uniqueLocations.map((location) => (
            <div key={location} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`location-${location}`}
                checked={filters.location.includes(location)}
                onChange={() => handleCheckboxChange("location", location)}
                className="mr-2"
              />
              <label
                htmlFor={`location-${location}`}
                className="text-sm text-gray-600"
              >
                {location}
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="mt-2 w-full py-2 px-4 text-sm bg-light text-primary rounded hover:bg-primary-dull hover:text-white transition shadow"
        >
          Reset Filters
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-10 lg:px-16 xl:px-24 py-12">
        {/* Title and Search */}
        <div className="flex flex-col items-center max-md:px-4 mb-10">
          <Title
            title="Available Cars"
            subTitle="Browse our selection of premium vehicles available for your next adventure"
          />
          <div className="flex items-center bg-white px-4 mt-6 max-w-2xl w-full h-12 rounded-full shadow">
            <img
              src={assets.search_icon}
              alt="Search"
              className="w-4.5 h-4.5 mr-2"
            />
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Search by make or model name"
              className="w-full h-full outline-none text-gray-500"
            />
            <img
              src={assets.filter_icon}
              alt="Toggle Filters"
              className="w-4.5 h-4.5 ml-2 cursor-pointer md:hidden"
              onClick={() => setShowSidebar(!showSidebar)}
            />
          </div>
        </div>

        {/* Sort and Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">
            Showing {sortedCars.length}{" "}
            {sortedCars.length === 1 ? "car" : "cars"}
          </p>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="rounded-full px-3 py-2 text-gray-600 bg-white shadow border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
          >
            <option value="">Sort by</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="year-desc">Year (Newest)</option>
            <option value="year-asc">Year (Oldest)</option>
          </select>
        </div>


        {/* Handle no results */}
        {sortedCars.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg font-medium">No cars found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedCars.map((car, index) => (
              <CarCard key={index} car={car} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Cars;
