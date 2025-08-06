'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Search, ArrowLeft, ExternalLink, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import { SearchResultItem } from '@/lib/types';
import { Geist } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
});

const platformColors: Record<string, string> = {
  'Amazon': 'bg-theme-primary',
  'Flipkart': 'bg-blue-600',
}

export default function SuperSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('products');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [notFound, setNotFound] = useState(false);

  const formatPrice = (priceStr: string): string => {
    if (!priceStr) return 'N/A';
    const cleanPrice = parseFloat(priceStr.replace(/[₹,]/g, ''));
    if (!isNaN(cleanPrice)) {
      return `₹${cleanPrice.toLocaleString('en-IN')}`;
    }
    return priceStr;
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setResults([]);
    setNotFound(false);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm, category: searchCategory }),
      });
      
      const data = await response.json();

      if (response.ok && Array.isArray(data) && data.length > 0) {
        setResults(data);
      } else {
        setNotFound(true);
      }

    } catch (error) {
      console.error('Search failed:', error);
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-background text-theme-text-primary">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-theme-text-secondary hover:text-theme-text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-5xl font-light text-theme-text-primary mb-4 flex items-center justify-center gap-3`}>
              <Sparkles className="w-10 h-10 text-theme-primary"/> Price Pal Search
            </h1>
            <p className={`text-lg text-theme-text-secondary max-w-2xl mx-auto`}>
              One search for everything. Find the best prices across all major platforms.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-theme-surface border border-theme-secondary/50 shadow-lg mb-8 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="What are you looking for?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 bg-theme-secondary/50 border-theme-secondary text-theme-text-primary placeholder:text-theme-text-secondary focus:bg-theme-secondary/80 focus:border-theme-primary rounded-full"
                />
                <div className="flex gap-4">
                    <Select value={searchCategory} onValueChange={setSearchCategory}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-theme-secondary/50 border-theme-secondary text-theme-text-primary rounded-full">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-theme-surface border-theme-secondary text-theme-text-primary">
                            <SelectItem value="grocery">Groceries</SelectItem>
                            <SelectItem value="products">Products</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleSearch} disabled={isSearching || !searchTerm.trim()} className="flex-1 bg-theme-primary hover:brightness-110 text-black px-8 rounded-full">
                      {isSearching ? <div className="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full" /> : <><Search className="w-4 h-4 mr-2" /> Search</>}
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {isSearching && (
            <div className="text-center p-12">
                <div className="animate-spin w-12 h-12 border-4 border-theme-primary/20 border-t-theme-primary rounded-full mx-auto"></div>
                <p className="mt-4 text-theme-text-secondary">Searching across platforms...</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((item, index) => (
                <Card key={index} className="bg-theme-surface border border-theme-secondary/50 shadow-lg rounded-2xl animate-fade-in overflow-hidden">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 items-center">
                      <div className="col-span-1 sm:col-span-1 bg-theme-secondary/30 p-2 rounded-lg flex items-center justify-center">
                        <img src={item.image} alt={item.title} className="w-full h-auto object-contain rounded-md max-h-32"/>
                      </div>
                      <div className="col-span-2 sm:col-span-3 space-y-2 text-theme-text-primary">
                        <div className="flex justify-between items-start">
                          <h2 className="font-semibold leading-tight flex-1 mr-2">{item.title}</h2>
                          <Badge className={`${platformColors[item.platform] || 'bg-gray-500'} text-black whitespace-nowrap`}>{item.platform}</Badge>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-xl font-bold text-white">{formatPrice(item.price)}</p>
                            {item.quantity && (
                                <p className="text-sm text-theme-text-secondary">{item.quantity}</p>
                            )}
                        </div>
                        {item.rating && (
                          <div className="flex items-center gap-2 text-sm text-theme-text-secondary">
                            <Star className="w-4 h-4 text-theme-primary fill-theme-primary" />
                            <span>{item.rating}</span>
                          </div>
                        )}
                        <Button asChild size="sm" className="bg-theme-primary hover:brightness-110 text-black rounded-full">
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Deal
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {notFound && (
            <Card className="bg-theme-surface border-theme-secondary/50 shadow-lg rounded-2xl p-12 text-center">
              <h3 className="text-xl font-semibold text-theme-text-primary">No Suitable Products Found</h3>
              <p className="text-theme-text-secondary mt-2">We couldn't find any products matching your search. Please try a different term or category.</p>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
} 