import { FaShippingFast, FaHeart, FaCheckCircle } from 'react-icons/fa';

function AboutSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark mb-4">About Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Welcome to AnimeShop, your premier destination for authentic anime and manga merchandise. 
            We're passionate about bringing the best of Japanese pop culture to fans worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FaHeart className="text-primary text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">Passion for Anime</h3>
            <p className="text-gray-600">
              Founded by anime enthusiasts, we understand what fans want and deliver only the highest quality products.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FaCheckCircle className="text-primary text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">Authentic Products</h3>
            <p className="text-gray-600">
              We work directly with Japanese suppliers to ensure all our merchandise is 100% authentic.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FaShippingFast className="text-primary text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">Global Shipping</h3>
            <p className="text-gray-600">
              We ship worldwide, bringing your favorite anime merchandise right to your doorstep.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="bg-primary text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-opacity-90 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;