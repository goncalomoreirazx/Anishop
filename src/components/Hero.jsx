function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-dark to-purple-900 text-white overflow-hidden">
      {/* Decorative anime-style overlay patterns */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute left-0 w-full h-full">
          {/* Simple anime-style decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-secondary"></div>
          <div className="absolute top-40 right-1/4 w-16 h-16 rounded-full bg-blue-400"></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">AnimeShop</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-2xl mx-auto">
            Discover our collection of manga, anime merchandise, and more!
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white text-lg font-semibold rounded-md hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;