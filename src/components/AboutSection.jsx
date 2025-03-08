import { FaShippingFast, FaHeart, FaCheckCircle } from 'react-icons/fa';

function AboutSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">About Us</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Welcome to AnimeShop, your premier destination for authentic anime and manga merchandise. 
            We're passionate about bringing the best of Japanese pop culture to fans worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-xl shadow-card text-center transform transition-transform hover:-translate-y-2 duration-300">
            <div className="bg-primary bg-opacity-10 p-5 rounded-full inline-block mb-5">
              <FaHeart className="text-primary text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-dark mb-3">Passion for Anime</h3>
            <p className="text-gray-600">
              Founded by anime enthusiasts, we understand what fans want and deliver only the highest quality products.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-card text-center transform transition-transform hover:-translate-y-2 duration-300">
            <div className="bg-primary bg-opacity-10 p-5 rounded-full inline-block mb-5">
              <FaCheckCircle className="text-primary text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-dark mb-3">Authentic Products</h3>
            <p className="text-gray-600">
              We work directly with Japanese suppliers to ensure all our merchandise is 100% authentic.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-card text-center transform transition-transform hover:-translate-y-2 duration-300">
            <div className="bg-primary bg-opacity-10 p-5 rounded-full inline-block mb-5">
              <FaShippingFast className="text-primary text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-dark mb-3">Global Shipping</h3>
            <p className="text-gray-600">
              We ship worldwide, bringing your favorite anime merchandise right to your doorstep.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white text-lg font-semibold rounded-md hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-xl">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;