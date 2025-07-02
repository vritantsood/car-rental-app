import React, { useState, useEffect } from "react";
import assets, { menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
const Navbar = () => {
  const {setShowLogin,user,logout,isOwner,axios,setIsOwner}=
  useAppContext()
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const changeRole=async () => {
    try {
      const {data}=await axios.post("/api/owner/change-role")
      if(data.success){
        setIsOwner(true);
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-md"
          : location.pathname === "/"
          ? "bg-light"
          : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-borderColor">
        {/* Logo */}
        <Link to="/">
          <img src={assets.logo} alt="logo" className="h-8" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden sm:flex items-center gap-8">
          {menuLinks.map((link, index) => (
            <Link key={index} to={link.path} className="hover:font-medium hover:underline">
              {link.name}
            </Link>
          ))}

          {/* Search Bar */}
          <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
            <input onClick={()=>navigate("/cars")}
              type="text"
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              placeholder="Search Cars"
            />
            
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-6">
            <button onClick={() =>isOwner? navigate("/owner"):changeRole()} className="cursor-pointer hover:underline hover:font-medium ">
             {isOwner?" DashBoard":"List Cars"}
            </button>
            <button
              onClick={() => user?logout():setShowLogin(true)}
              className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
            >
             { user?"Logout":"Login"}
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="sm:hidden cursor-pointer"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden fixed top-16 right-0 w-full h-screen bg-white/80 backdrop-blur-md z-40 p-6 border-t border-borderColor transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-4">
          {menuLinks.map((link, index) => (
            <Link key={index} to={link.path} onClick={() => setOpen(false)}>
              {link.name}
            </Link>
          ))}

          {/* Mobile Buttons */}
          <div className="flex flex-col items-start gap-4 mt-4">
            <button onClick={() => isOwner ? navigate("/owner") : changeRole()} className="cursor-pointer">
              {isOwner ? "DashBoard" : "List Cars"}
            </button>
            <button
              onClick={() => user?logout():setShowLogin(true)}
              className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
            >
              { user?"Logout":"Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
