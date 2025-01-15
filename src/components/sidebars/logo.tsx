const Logo = ({ className = "", size = "h-16 w-auto" }) => {
    return (
      <img
        src="/Logo_Optimized.png"
        alt="Logo"
        className={`mx-auto ${size} filter transition-all dark:filter-none invert ${className}`}
      />
    );
  };
  
  export default Logo;