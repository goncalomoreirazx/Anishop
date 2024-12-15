function Hero() {
  return (
    <div className="relative bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-primary">AnimeShop</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Discover our collection of manga, anime merchandise, and more!
          </p>
          <button className="bg-primary text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-opacity-90 transition-colors">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;