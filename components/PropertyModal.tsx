import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, BedDouble, Bath, Maximize, Heart, Share2, Mail, Phone } from 'lucide-react';
import { type RentalListing } from '../types';

interface PropertyModalProps {
  listing: RentalListing | null;
  isOpen: boolean;
  onClose: () => void;
  isBlurred: boolean;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ listing, isOpen, onClose, isBlurred }) => {
  if (!listing) return null;

  const defaultAmenities = ['WiFi', 'Heating', 'Kitchen', 'Laundry', 'Parking', 'Pet Friendly'];
  const amenities = listing.amenities || defaultAmenities;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Gallery */}
            <div className="relative h-80 bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden">
              {listing.imageUrl ? (
                <img 
                  src={listing.imageUrl} 
                  alt={listing.title}
                  className={`w-full h-full object-cover ${isBlurred ? 'blur-xl' : ''}`}
                />
              ) : (
                <div className={`w-full h-full image-placeholder ${isBlurred ? 'blur-xl' : ''}`} />
              )}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-stone-700" />
                </button>
                <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors">
                  <Share2 className="w-5 h-5 text-stone-700" />
                </button>
              </div>
            </div>

            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className={`text-3xl font-bold mb-2 ${isBlurred ? 'blur-sm' : ''}`}>
                    {listing.title}
                  </h2>
                  <p className={`text-stone-600 flex items-center gap-2 ${isBlurred ? 'blur-sm' : ''}`}>
                    <MapPin className="w-4 h-4" />
                    {isBlurred ? `${listing.area}, ${listing.city}` : `${listing.address}, ${listing.area}, ${listing.city}`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-indigo-600">${listing.price}</div>
                  <div className="text-sm text-stone-500">per month</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-stone-50 rounded-2xl">
                <div className="text-center">
                  <BedDouble className="w-6 h-6 mx-auto mb-2 text-stone-600" />
                  <div className="font-bold">{listing.beds > 0 ? listing.beds : 'Studio'}</div>
                  <div className="text-xs text-stone-500">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="w-6 h-6 mx-auto mb-2 text-stone-600" />
                  <div className="font-bold">{listing.baths}</div>
                  <div className="text-xs text-stone-500">Bathrooms</div>
                </div>
                <div className="text-center">
                  <Maximize className="w-6 h-6 mx-auto mb-2 text-stone-600" />
                  <div className="font-bold">{listing.sqft}</div>
                  <div className="text-xs text-stone-500">Square Feet</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3">Description</h3>
                <p className={`text-stone-600 leading-relaxed ${isBlurred ? 'blur-sm' : ''}`}>
                  {listing.description || `Beautiful ${listing.type.toLowerCase()} located in the heart of ${listing.area}. This property offers modern amenities and convenient access to local transportation, shopping, and dining. Perfect for professionals or students looking for quality living space in a vibrant neighborhood.`}
                </p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Amenities</h3>
                <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${isBlurred ? 'blur-sm' : ''}`}>
                  {amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                      <span className="text-sm font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              {!isBlurred && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5" />
                      <div>
                        <div className="text-xs opacity-80">Email</div>
                        <div className="font-medium">{listing.contact || 'contact@secretlease.com'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5" />
                      <div>
                        <div className="text-xs opacity-80">Phone</div>
                        <div className="font-medium">+1 (555) 123-4567</div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                    Schedule Viewing
                  </button>
                </div>
              )}

              {isBlurred && (
                <div className="bg-stone-900 text-white p-6 rounded-2xl text-center">
                  <h3 className="text-xl font-bold mb-2">Unlock Full Details</h3>
                  <p className="text-stone-300 mb-4">Get access to contact information, full property details, and more</p>
                  <button className="bg-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                    Unlock Now
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PropertyModal;
