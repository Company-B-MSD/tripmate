import React, { useEffect, useState } from 'react';
import { Building2, Mail, Phone, Globe, MapPin, Tag, Trash2, Plus } from 'lucide-react';
import { api } from '@/lib/api';

const BusinessPage = () => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    email: '',
    telephone: '',
    website: '',
    description: '',
    category: '',
  });

  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBusinesses = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAllBusinesses();
      const data = await res.json();
      if (Array.isArray(data)) {
        setBusinesses(data);
      } else {
        setBusinesses([]);
      }
    } catch (err) {
      console.error('Error fetching businesses', err);
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await api.registerBusiness(form);
      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Business registered!');
        setForm({
          name: '',
          address: '',
          email: '',
          telephone: '',
          website: '',
          description: '',
          category: '',
        });
        fetchBusinesses();
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      alert('Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this business?')) return;
    setIsLoading(true);
    try {
      await api.deleteBusiness(id);
      fetchBusinesses();
    } catch (err) {
      alert('Failed to delete');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'restaurant': return '🍽️';
      case 'hotel': return '🏨';
      case 'tour-guide': return '🗺️';
      case 'transportation': return '🚗';
      case 'attraction': return '🎢';
      case 'shop': return '🛍️';
      case 'entertainment': return '🎭';
      default: return '🏢';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full py-8 md:py-16 lg:py-20 bg-gradient-to-b from-background via-background/95 to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-3 mb-6">
              <Building2 className="w-12 h-12 text-primary" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Business Management
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with travelers by registering your business in our comprehensive directory
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Registration Form */}
          <div className="bg-card border border-border rounded-xl shadow-lg">
            <div className="bg-primary/5 px-6 py-4 border-b border-border rounded-t-xl">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Register New Business
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Business Name', name: 'name', icon: Building2, required: true },
                    { label: 'Address', name: 'address', icon: MapPin, required: true },
                    { label: 'Email', name: 'email', type: 'email', icon: Mail, required: true },
                    { label: 'Telephone', name: 'telephone', icon: Phone, required: true },
                    { label: 'Website (optional)', name: 'website', icon: Globe, required: false },
                  ].map(({ label, name, type = 'text', icon: Icon, required }) => (
                    <div key={name}>
                      <label className="text-sm font-medium flex items-center gap-2 mb-2 text-foreground">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={(form as any)[name]}
                        onChange={handleChange}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        required={required}
                        className="w-full bg-background text-foreground placeholder-muted-foreground border border-input rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-2 text-foreground">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      Category
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent [&>option]:bg-background [&>option]:text-foreground"
                      required
                    >
                      <option value="" className="text-muted-foreground">Select Category</option>
                      <option value="restaurant">🍽️ Restaurant</option>
                      <option value="hotel">🏨 Hotel</option>
                      <option value="tour-guide">🗺️ Tour Guide</option>
                      <option value="transportation">🚗 Transportation</option>
                      <option value="attraction">🎢 Attraction</option>
                      <option value="shop">🛍️ Shop</option>
                      <option value="entertainment">🎭 Entertainment</option>
                      <option value="other">🏢 Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2 text-foreground">
                    Description (optional)
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter business description"
                    className="w-full bg-background text-foreground placeholder-muted-foreground border border-input rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isLoading ? 'Registering...' : 'Register Business'}
                </button>
              </div>
            </div>
          </div>

          {/* Business Directory */}
          <div className="bg-card border border-border rounded-xl shadow-lg">
            <div className="bg-primary/5 px-6 py-4 border-b border-border rounded-t-xl">
              <h2 className="text-2xl font-bold text-primary text-center">
                Business Directory
              </h2>
              <p className="text-center text-muted-foreground mt-2">
                {businesses.length} registered businesses
              </p>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  Loading businesses...
                </div>
              ) : businesses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No businesses registered yet.</p>
                  <p className="text-sm">Be the first to register your business!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.map((business) => (
                    <div
                      key={business.id}
                      className="relative bg-card border border-border/50 rounded-lg hover:shadow-lg hover:border-primary/20 transition-all duration-200"
                    >
                      <div className="p-4 border-b border-border/50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                              {getCategoryIcon(business.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold leading-tight text-card-foreground truncate">
                                {business.name}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{business.address}</span>
                              </p>
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20 ml-2 flex-shrink-0">
                            {business.category.charAt(0).toUpperCase() + business.category.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4 text-primary/60 flex-shrink-0" />
                            <span className="truncate">{business.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 text-primary/60 flex-shrink-0" />
                            <span>{business.telephone}</span>
                          </div>
                        </div>

                        {business.description && (
                          <p className="text-sm text-foreground/80 mb-4 line-clamp-3">
                            {business.description}
                          </p>
                        )}

                        {business.website && (
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary border border-primary/20 hover:border-primary text-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1"
                          >
                            <Globe className="w-3 h-3" />
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;