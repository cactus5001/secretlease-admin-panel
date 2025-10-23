
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Lock, BedDouble, Bath, Maximize, SlidersHorizontal, Heart } from 'lucide-react';
import { type RentalListing, type UserAccount, type AdminConfig, type City, type ViewState } from '../types';
import PropertyModal from './PropertyModal';

interface ResultsViewProps {
    results: RentalListing[];
    currentUser: UserAccount | null;
    isBlurred: boolean;
    selectedCity: City;
    maxBudget: number;
    adminConfig: AdminConfig;
    setView: (view: ViewState) => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ results, currentUser, isBlurred, selectedCity, maxBudget, adminConfig, setView }) => {
    const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'newest'>('newest');
    const [selectedListing, setSelectedListing] = useState<RentalListing | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const sortedResults = [...results].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
    });

    const handleCardClick = (listing: RentalListing) => {
        setSelectedListing(listing);
        setIsModalOpen(true);
    };

    const toggleFavorite = (e: React.MouseEvent, listingId: string) => {
        e.stopPropagation();
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(listingId)) {
                newFavorites.delete(listingId);
            } else {
                newFavorites.add(listingId);
            }
            return newFavorites;
        });
    };

    return (
        <motion.div
            key="results"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl">
                <div>
                    <h2 className="text-3xl font-bold text-indigo-900">Found {results.length} Listings</h2>
                    <p className="text-indigo-700/70 text-sm">{selectedCity === 'NY' ? 'New York' : 'Los Angeles'} · Max ${maxBudget}</p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-stone-200">
                        <SlidersHorizontal className="w-4 h-4 text-stone-600" />
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-transparent text-sm font-medium focus:outline-none"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                    {isBlurred && (
                        <button 
                            onClick={() => !currentUser ? setView('auth') : setView('payment')} 
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold hover:shadow-xl transition-all hover-lift"
                        >
                            Unlock All (${adminConfig.priceUsd})
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedResults.map((listing, idx) => (
                    <motion.div 
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleCardClick(listing)}
                        className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all relative group cursor-pointer card-hover"
                    >
                        <div className="aspect-video bg-gradient-to-br from-indigo-400 to-purple-500 relative overflow-hidden">
                            {listing.imageUrl ? (
                                <img 
                                    src={listing.imageUrl} 
                                    alt={listing.title}
                                    className={`w-full h-full object-cover transition-transform group-hover:scale-110 duration-300 ${isBlurred ? 'blur-xl' : ''}`}
                                />
                            ) : (
                                <div className={`w-full h-full image-placeholder ${isBlurred ? 'blur-xl' : ''}`} />
                            )}
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold z-10">
                                {listing.type}
                            </div>
                            <button
                                onClick={(e) => toggleFavorite(e, listing.id)}
                                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full z-10 hover:bg-white transition-colors"
                            >
                                <Heart className={`w-4 h-4 ${favorites.has(listing.id) ? 'fill-red-500 text-red-500' : 'text-stone-600'}`} />
                            </button>
                            <div className="absolute bottom-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                {listing.postedAgo}
                            </div>
                        </div>

                        <div className={`p-4 ${isBlurred ? 'blur-[3px] select-none opacity-80' : ''}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold truncate flex-1">{listing.title}</h3>
                                <span className="font-black text-lg text-indigo-600">${listing.price}</span>
                            </div>
                            <p className="text-sm text-stone-500 flex items-center gap-1 mb-4">
                                <MapPin className="w-3 h-3" />
                                {isBlurred ? `${listing.area}, ${listing.city}` : `${listing.address}, ${listing.area}`}
                            </p>
                            <div className="flex gap-3 text-xs font-medium text-stone-600">
                                <span className="flex gap-1 items-center"><BedDouble className="w-3 h-3" /> {listing.beds > 0 ? `${listing.beds} Bed` : 'Studio'}</span>
                                <span className="flex gap-1 items-center"><Bath className="w-3 h-3" /> {listing.baths} Bath</span>
                                <span className="flex gap-1 items-center"><Maximize className="w-3 h-3" /> {listing.sqft} sqft</span>
                            </div>
                        </div>

                        {isBlurred && (
                            <div 
                                className="absolute inset-0 z-20 flex items-center justify-center bg-stone-900/10 group-hover:bg-stone-900/20 transition-colors"
                            >
                                <div className="bg-stone-900 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg transform group-hover:scale-110 transition-transform">
                                    <Lock className="w-4 h-4" /> Unlock Details
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <PropertyModal 
                listing={selectedListing}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isBlurred={isBlurred}
            />
        </motion.div>
    );
};

export default ResultsView;
