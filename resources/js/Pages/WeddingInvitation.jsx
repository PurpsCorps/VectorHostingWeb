import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Heart, Gift, Music, Users, MessageCircle, Camera, Flower, Star } from 'lucide-react';

const WeddingInvitation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [wishes, setWishes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Wedding details
  const weddingDate = new Date('2025-08-15T15:00:00');
  const coupleNames = {
    bride: 'Sarah',
    groom: 'David',
  };

  const images = [
    '/api/placeholder/800/500',
    '/api/placeholder/800/500',
    '/api/placeholder/800/500',
  ];

  // Calculate countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = weddingDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Image slideshow
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to a server
    setSubmitted(true);
  };

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying);
    // In a real app, you would control audio playback here
  };

  // Floral decoration component
  const FloralCorner = ({ position }) => {
    const positionClasses = {
      'top-left': 'top-0 left-0 rotate-0',
      'top-right': 'top-0 right-0 rotate-90',
      'bottom-left': 'bottom-0 left-0 -rotate-90',
      'bottom-right': 'bottom-0 right-0 rotate-180',
    };

    return (
      <div className={`absolute ${positionClasses[position]} pointer-events-none opacity-70`}>
        <div className="relative w-32 h-32">
          <div className="absolute text-pink-300 top-4 left-4">
            <Heart className="w-6 h-6" />
          </div>
          <div className="absolute text-pink-200 top-2 left-12">
            <Star className="w-4 h-4" />
          </div>
          <div className="absolute text-pink-400 top-12 left-8">
            <Heart className="w-8 h-8" />
          </div>
          <div className="absolute text-pink-100 top-14 left-16">
            <Star className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-pink-50 to-pink-100 text-center overflow-hidden">
        <div className="relative max-w-md w-full p-8 bg-white rounded-xl shadow-lg border border-pink-200">
          <FloralCorner position="top-left" />
          <FloralCorner position="top-right" />
          <FloralCorner position="bottom-left" />
          <FloralCorner position="bottom-right" />

          <div className="mb-6 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-2 bg-pink-200 rounded-full"></div>
            <Heart className="w-12 h-12 mx-auto text-pink-500" />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-2 bg-pink-200 rounded-full"></div>
          </div>

          <h1 className="text-3xl font-serif mb-2 text-gray-800 italic">
            {coupleNames.bride} <span className="text-pink-500">&</span> {coupleNames.groom}
          </h1>

          <p className="mb-6 text-gray-600 font-light">are joyfully tying the knot!</p>

          <div className="mb-8 px-4 py-3 bg-pink-50 rounded-lg italic text-gray-600 border-l-4 border-pink-300">
            "Two hearts, one love, one beautiful journey"
          </div>

          <p className="mb-8 text-gray-600">
            We warmly invite you to celebrate our wedding on{" "}
            <span className="font-medium text-pink-600">
              {weddingDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
          </p>

          <button
            onClick={() => setIsOpen(true)}
            className="px-8 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition duration-300 shadow-md flex items-center justify-center mx-auto"
          >
            <span>Open Invitation</span>
            <Heart className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-pink-50 to-pink-100 min-h-screen relative overflow-hidden">
      {/* Animated flowers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-200 opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
            }}
          >
            <Heart className={`w-${Math.floor(4 + Math.random() * 8)} h-${Math.floor(4 + Math.random() * 8)}`} />
          </div>
        ))}
      </div>

      {/* Music Control */}
      <button
        onClick={toggleAudio}
        className="fixed top-4 right-4 z-50 bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 border border-pink-200"
      >
        <Music className={`w-6 h-6 ${audioPlaying ? 'text-pink-500' : 'text-gray-400'}`} />
      </button>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={images[currentImage]}
            alt="Couple"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-pink-900/30"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/30 to-transparent"></div>

        <div className="relative z-10 p-6 max-w-2xl">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-1 bg-pink-300 rounded-full mr-3"></div>
            <div className="w-32 h-1 bg-white rounded-full"></div>
            <div className="w-16 h-1 bg-pink-300 rounded-full ml-3"></div>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif mb-4 drop-shadow-md">
            {coupleNames.bride} <span className="text-pink-300">&</span> {coupleNames.groom}
          </h1>

          <p className="text-lg md:text-xl mb-8 italic font-light">
            We're embarking on a beautiful journey together
          </p>

          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-8">
            <div className="bg-white/25 backdrop-blur-sm p-2 rounded-lg border border-white/50 transform hover:scale-105 transition duration-300">
              <div className="text-3xl font-bold">{countdown.days}</div>
              <div className="text-sm">Days</div>
            </div>
            <div className="bg-white/25 backdrop-blur-sm p-2 rounded-lg border border-white/50 transform hover:scale-105 transition duration-300">
              <div className="text-3xl font-bold">{countdown.hours}</div>
              <div className="text-sm">Hours</div>
            </div>
            <div className="bg-white/25 backdrop-blur-sm p-2 rounded-lg border border-white/50 transform hover:scale-105 transition duration-300">
              <div className="text-3xl font-bold">{countdown.minutes}</div>
              <div className="text-sm">Minutes</div>
            </div>
            <div className="bg-white/25 backdrop-blur-sm p-2 rounded-lg border border-white/50 transform hover:scale-105 transition duration-300">
              <div className="text-3xl font-bold">{countdown.seconds}</div>
              <div className="text-sm">Seconds</div>
            </div>
          </div>

          <p className="text-lg font-light">
            <Calendar className="inline-block w-5 h-5 mr-2 mb-1" />
            {weddingDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>
      </header>

      {/* Couple Section */}
      <section className="py-16 px-4 relative">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-pink-100/80 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative mb-12">
            <h2 className="text-3xl font-serif text-gray-800 italic">Our Love Story</h2>
            <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 flex space-x-1">
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
              <div className="w-12 h-2 bg-pink-400 rounded-full"></div>
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-pink-100 transform hover:translate-y-[-5px] transition duration-300">
              <div className="mb-4 mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-pink-100 shadow-md">
                <img src="/api/placeholder/150/150" alt={coupleNames.bride} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-serif mb-2 text-gray-800">{coupleNames.bride}</h3>
              <p className="text-pink-500 mb-4 italic">Daughter of Mr. & Mrs. Johnson</p>
              <p className="text-gray-600">
                With a heart full of dreams and eyes that sparkle with joy, Sarah brings warmth and compassion to every moment. Her laughter fills the room, and her love knows no bounds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-pink-100 transform hover:translate-y-[-5px] transition duration-300">
              <div className="mb-4 mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-pink-100 shadow-md">
                <img src="/api/placeholder/150/150" alt={coupleNames.groom} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-serif mb-2 text-gray-800">{coupleNames.groom}</h3>
              <p className="text-pink-500 mb-4 italic">Son of Mr. & Mrs. Smith</p>
              <p className="text-gray-600">
                With a gentle soul and unwavering devotion, David cherishes every moment spent with Sarah. His kindness knows no limits, and his love grows stronger with each passing day.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-pink-50 rounded-lg border border-pink-200 shadow-inner">
            <p className="text-gray-700 italic">
              "Two souls with but a single thought, two hearts that beat as one."
            </p>
            <p className="text-sm text-gray-500 mt-2">- Friedrich Halm</p>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16 px-4 bg-white relative">
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <div className="w-full h-6 bg-pink-100"></div>
          <div className="w-full h-12 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 0)' }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="relative mb-12">
            <h2 className="text-3xl font-serif text-gray-800 italic">Join Our Celebration</h2>
            <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 flex space-x-1">
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
              <div className="w-12 h-2 bg-pink-400 rounded-full"></div>
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-pink-200 rounded-lg bg-gradient-to-br from-white to-pink-50 shadow-md">
              <div className="flex justify-center mb-4 p-3 bg-pink-50 rounded-full w-16 h-16 mx-auto border border-pink-200">
                <Calendar className="w-10 h-10 text-pink-500" />
              </div>
              <h3 className="text-xl font-serif mb-2 text-gray-800">Wedding Ceremony</h3>
              <p className="text-pink-600 mb-2 font-medium">August 15, 2025 • 3:00 PM</p>
              <p className="text-gray-600 mb-4 italic">St. Mary's Cathedral</p>
              <p className="text-gray-600">123 Wedding Lane, City, Country</p>
              <div className="mt-4 flex justify-center">
                <div className="w-16 h-1 bg-pink-200"></div>
              </div>
            </div>

            <div className="p-6 border border-pink-200 rounded-lg bg-gradient-to-br from-white to-pink-50 shadow-md">
              <div className="flex justify-center mb-4 p-3 bg-pink-50 rounded-full w-16 h-16 mx-auto border border-pink-200">
                <Clock className="w-10 h-10 text-pink-500" />
              </div>
              <h3 className="text-xl font-serif mb-2 text-gray-800">Wedding Reception</h3>
              <p className="text-pink-600 mb-2 font-medium">August 15, 2025 • 5:30 PM</p>
              <p className="text-gray-600 mb-4 italic">Grand Ballroom, Luxury Hotel</p>
              <p className="text-gray-600">456 Reception Road, City, Country</p>
              <div className="mt-4 flex justify-center">
                <div className="w-16 h-1 bg-pink-200"></div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-12 p-6 bg-gradient-to-br from-pink-50 to-white rounded-lg shadow-md border border-pink-100">
            <div className="flex justify-center mb-4 p-3 bg-pink-50 rounded-full w-16 h-16 mx-auto border border-pink-200">
              <MapPin className="w-10 h-10 text-pink-500" />
            </div>
            <h3 className="text-xl font-serif mb-4 text-gray-800">Find Your Way to Our Special Day</h3>
            <div className="bg-gray-300 h-64 rounded-lg overflow-hidden shadow-inner">
              <img src="/api/placeholder/800/400" alt="Map" className="w-full h-full object-cover" />
            </div>
            <div className="mt-6">
              <button className="px-8 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition duration-300 shadow-md">
                <MapPin className="inline-block w-4 h-4 mr-2" />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-4 relative">
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <div className="w-full h-6 bg-pink-100"></div>
          <div className="w-full h-12 bg-pink-50" style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="relative mb-12">
            <h2 className="text-3xl font-serif text-gray-800 italic">Our Journey in Pictures</h2>
            <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 flex space-x-1">
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
              <div className="w-12 h-2 bg-pink-400 rounded-full"></div>
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-center items-center mb-6">
            <Camera className="w-6 h-6 text-pink-500 mr-2" />
            <h3 className="text-xl text-gray-700 italic">Moments We Cherish</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="aspect-square bg-white p-2 rounded-lg shadow-md overflow-hidden transform rotate-0 hover:rotate-2 transition duration-300">
                <img
                  src={`/api/placeholder/300/300?text=Photo ${index}`}
                  alt={`Photo ${index}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Form */}
      <section className="py-16 px-4 bg-white relative">
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <div className="w-full h-6 bg-pink-100"></div>
          <div className="w-full h-12 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 0)' }}></div>
        </div>

        <FloralCorner position="top-right" />
        <FloralCorner position="bottom-left" />

        <div className="relative max-w-md mx-auto text-center">
          <div className="relative mb-12">
            <h2 className="text-3xl font-serif text-gray-800 italic">RSVP with Love</h2>
            <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 flex space-x-1">
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
              <div className="w-12 h-2 bg-pink-400 rounded-full"></div>
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <Users className="w-8 h-8 text-pink-500" />
          </div>

          {submitted ? (
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg shadow-md">
              <Heart className="w-10 h-10 mx-auto text-pink-500 mb-4" />
              <h3 className="text-xl font-serif mb-2 text-gray-800">Thank You for Your Response!</h3>
              <p className="text-gray-600 italic">
                We're excited to celebrate our special day with you. Your presence will make our wedding truly memorable.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-lg shadow-md border border-pink-100">
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                  required
                  placeholder="Share your name with us"
                />
              </div>

              <div className="mb-6">
                <p className="block text-gray-700 mb-3 font-medium">Will you join our celebration?</p>
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`px-4 py-2 rounded-lg transition duration-300 ${
                      attending === true
                        ? "bg-pink-500 text-white shadow-md"
                        : "bg-white text-gray-700 border border-pink-300 hover:bg-pink-50"
                    }`}
                  >
                    <Heart className="inline-block w-4 h-4 mr-2" />
                    Joyfully Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`px-4 py-2 rounded-lg transition duration-300 ${
                      attending === false
                        ? "bg-gray-500 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Regretfully Decline
                  </button>
                </div>
              </div>

              {attending && (
                <div className="mb-6">
                  <label htmlFor="guests" className="block text-gray-700 mb-2 font-medium">Number of Guests</label>
                  <select
                    id="guests"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-8">
                <label htmlFor="message" className="block text-gray-700 mb-2 font-medium">Your Message</label>
                <textarea
                  id="message"
                  value={wishes}
                  onChange={(e) => setWishes(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                  placeholder="Share your wishes and thoughts for our special day..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition duration-300 shadow-md flex items-center justify-center"
              >
                <Heart className="mr-2 w-5 h-5" />
                <span>Send With Love</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Gift Registry */}
      <section className="py-16 px-4 relative">
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <div className="w-full h-6 bg-pink-100"></div>
          <div className="w-full h-12 bg-pink-50" style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}></div>
        </div>

        <div className="relative max-w-md mx-auto text-center">
          <div className="relative mb-12">
            <h2 className="text-3xl font-serif text-gray-800 italic">Gift Registry</h2>
            <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 flex space-x-1">
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
              <div className="w-12 h-2 bg-pink-400 rounded-full"></div>
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <Gift className="w-8 h-8 text-pink-500" />
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md border border-pink-100 mb-8">
            <p className="text-gray-600 italic">
              "Your presence at our wedding is the greatest gift of all. Your love and support mean the world to us as we begin this beautiful journey together."
            </p>
          </div>

          <p className="text-gray-600 mb-8">
            However, if you wish to honor us with a gift, we've registered at the following stores:
          </p>

          <div className="grid gap-4">
            <a href="#" className="block p-4 bg-gradient-to-r from-white to-pink-50 rounded-lg shadow-md hover:shadow-lg transition border border-pink-100 transform hover:-translate-y-1">
              <h3 className="text-lg font-serif text-gray-800">Amazon Registry</h3>
            </a>
            <a href="#" className="block p-4 bg-gradient-to-r from-white to-pink-50 rounded-lg shadow-md hover:shadow-lg transition border border-pink-100 transform hover:-translate-y-1">
              <h3 className="text-lg font-serif text-gray-800">Target Registry</h3>
            </a>
            <a href="#" className="block p-4 bg-gradient-to-r from-white to-pink-50 rounded-lg shadow-md hover:shadow-lg transition border border-pink-100 transform hover:-translate-y-1">
              <h3 className="text-lg font-serif text-gray-800">Honeymoon Fund</h3>
              <p className="text-sm text-gray-600 mt-1">Help us create unforgettable memories</p>
            </a>
          </div>
        </div>
      </section>

      {/* Wishes */}
      <section className="py-16 px-4 bg-white relative">
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <div className="w-full h-6 bg-pink-100"></div>
          <div className="w-full h-12 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 0)' }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="relative mb-12">
            <h2 className="text-3xl font-serif text-gray-800 italic">Wishes & Blessings</h2>
            <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 flex space-x-1">
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
              <div className="w-12 h-2 bg-pink-400 rounded-full"></div>
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <MessageCircle className="w-8 h-8 text-pink-500" />
          </div>

          <div className="grid gap-6">
            {[
              { name: "John & Mary", message: "Congratulations on your special day! May your life together be filled with endless love, laughter, and beautiful memories.", flower: true },
              { name: "Robert", message: "So happy for you both! Wishing you a lifetime of joy and adventure together. Can't wait to celebrate with you!", flower: false },
              { name: "Lisa & Family", message: "May your love continue to blossom and grow with each passing day. Sending our heartfelt wishes to the beautiful couple!", flower: true }
            ].map((wish, index) => (
              <div key={index} className="p-5 bg-gradient-to-br from-pink-50 to-white rounded-lg shadow-md border border-pink-100 relative">
                {wish.flower && (
                  <div className="absolute -top-3 -right-3">
                    <Heart className="w-6 h-6 text-pink-300" />
                  </div>
                )}
                <p className="text-gray-600 italic mb-3">"{wish.message}"</p>
                <div className="flex items-center justify-center">
                  <div className="w-8 h-1 bg-pink-200 rounded-full mr-2"></div>
                  <p className="text-gray-700 font-medium">- {wish.name}</p>
                  <div className="w-8 h-1 bg-pink-200 rounded-full ml-2"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-pink-50 rounded-lg border border-pink-100 shadow-inner">
            <p className="text-gray-700">
              We look forward to reading your beautiful wishes and messages on our special day!
            </p>
          </div>
        </div>
      </section>

      {/* Dress Code */}
      <section className="py-16 px-4 relative">
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <div className="w-full h-6 bg-pink-100"></div>
          <div className="w-full h-12 bg-pink-50" style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}></div>
        </div>

        <div className="relative max-w-md mx-auto text-center">
          <div className="relative mb-12">
            <h2 className="text-3xl font-serif text-gray-800 italic">Dress Code</h2>
            <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 flex space-x-1">
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
              <div className="w-12 h-2 bg-pink-400 rounded-full"></div>
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md border border-pink-100">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-pink-50 flex items-center justify-center border border-pink-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-serif mb-4 text-gray-800">Semi-Formal Attire</h3>
            <p className="text-gray-600 mb-4">
              We invite you to dress in elegant semi-formal attire for our celebration.
              Soft pastel colors are encouraged to complement our theme.
            </p>
            <div className="flex justify-center space-x-4 mb-2">
              <div className="w-8 h-8 rounded-full bg-pink-200"></div>
              <div className="w-8 h-8 rounded-full bg-blue-200"></div>
              <div className="w-8 h-8 rounded-full bg-green-200"></div>
              <div className="w-8 h-8 rounded-full bg-purple-200"></div>
            </div>
            <p className="text-sm text-gray-500 italic">
              Suggested color palette
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 text-center bg-gradient-to-b from-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-4 bg-pink-200"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-pink-300"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random() * 0.5})`,
              }}
            >
              <Heart className="w-4 h-4" />
            </div>
          ))}
        </div>

        <div className="max-w-md mx-auto relative">
          <div className="mb-6 flex justify-center">
            <div className="w-12 h-1 bg-pink-300 rounded-full mr-2"></div>
            <Heart className="w-8 h-8 text-pink-500" />
            <div className="w-12 h-1 bg-pink-300 rounded-full ml-2"></div>
          </div>

          <h2 className="text-2xl font-serif mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-pink-400">
            {coupleNames.bride} & {coupleNames.groom}
          </h2>

          <p className="mb-6 text-pink-200">
            {weddingDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>

          <div className="mb-8 flex justify-center space-x-6">
            <a href="#" className="text-pink-300 hover:text-pink-200 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="text-pink-300 hover:text-pink-200 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>

          <p className="text-gray-400 text-sm mb-4">
            We can't wait to celebrate with you!
          </p>

          <p className="text-gray-500 text-xs">
            Made with <Heart className="inline-block w-3 h-3 text-pink-500 mx-1" /> • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default WeddingInvitation;