import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  ShoppingBag, Layers, Eye, TrendingUp, DollarSign, ArrowRight, Loader2
} from 'lucide-react';
import api from '../utils/api';
import './Overview.css';

const StatCard = ({ title, value, percentage, icon, trendUp }) => (
  <div className="stat-card-new">
    <div className="stat-card-left">
      <span className="stat-card-title">{title}</span>
      <h2 className="stat-card-value">{value}</h2>
      <span className="stat-card-trend-container">
        <span className={`stat-card-trend-text ${trendUp ? 'up' : 'down'}`}>
          <TrendingUp size={14} className="trend-arrow" style={{ transform: trendUp ? 'none' : 'rotate(180deg)' }} />
          {percentage}
        </span>
        <span className="stat-card-trend-label">vs last week</span>
      </span>
    </div>
    <div className="stat-card-right">
      <div className="stat-card-icon-badge">
        {icon}
      </div>
    </div>
  </div>
);

const Overview = () => {
  // Safe extraction of products and categories from state
  const { items: products } = useSelector((state) => state.products || { items: [] });
  const { items: categories } = useSelector((state) => state.categories || { items: [] });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardOrders = async () => {
      try {
        const data = await api('/orders/get');
        setOrders(data);
      } catch (err) {
        console.error('Error fetching dashboard orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardOrders();
  }, []);

  // Dynamic calculations for original metrics
  const totalProducts = products.length;
  const activeCategories = categories.length;
  const featuredItems = products.filter(p => p.is_featured).length;
  const totalStock = products.reduce((acc, p) => acc + (p.stock_quantity || 0), 0);

  // Dynamic calculations for Order Statuses
  const totalOrders = orders.length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const outCount = orders.filter(o => o.status === 'Out for Delivery').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  const deliveredPercent = totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0;
  const pendingPercent = totalOrders > 0 ? Math.round((pendingCount / totalOrders) * 100) : 0;
  const outPercent = totalOrders > 0 ? Math.round((outCount / totalOrders) * 100) : 0;
  const cancelledPercent = totalOrders > 0 ? Math.round((cancelledCount / totalOrders) * 100) : 0;

  // Pie chart data for Order Status
  const orderStatusData = [
    { name: 'Delivered', value: deliveredCount || (totalOrders === 0 ? 1 : 0), color: '#10b981' },
    { name: 'Pending', value: pendingCount || (totalOrders === 0 ? 1 : 0), color: '#3b82f6' },
    { name: 'Out for Delivery', value: outCount || (totalOrders === 0 ? 1 : 0), color: '#f59e0b' },
    { name: 'Cancelled', value: cancelledCount || (totalOrders === 0 ? 1 : 0), color: '#ef4444' },
  ];

  // Dynamic calculations for last 7 days revenue trend
  const getWeeklyRevenueTrend = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const trend = [];
    
    // Create placeholders for last 7 days ending today
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trend.push({
        name: daysOfWeek[date.getDay()],
        dateStr: date.toDateString(),
        revenue: 0
      });
    }

    // Populate revenue from actual orders
    orders.forEach(order => {
      if (order.status !== 'Cancelled') {
        const orderDateStr = new Date(order.createdAt).toDateString();
        const match = trend.find(t => t.dateStr === orderDateStr);
        if (match) {
          match.revenue += order.total;
        }
      }
    });

    return trend.map(({ name, revenue }) => ({ name, revenue }));
  };

  const weeklyRevenueData = getWeeklyRevenueTrend();

  // Top performing / selling items (using real database products if available, fallback to mock)
  const topPerformers = products.slice(0, 3).map((p, i) => ({
    name: p.name,
    category: `SKU: ${p.sku || 'N/A'}`,
    price: `Qty: ${p.stock_quantity || 0}`,
    image: p.main_image || p.image_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&auto=format&fit=crop&q=60'
  }));

  const fallbackPerformers = [
    { name: 'Glow Vit-C Serum', category: 'SKINCARE', price: 'Rs. 1,200', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&auto=format&fit=crop&q=60' },
    { name: 'Hydrating Face Cream', category: 'MOISTURIZERS', price: 'Rs. 850', image: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=150&auto=format&fit=crop&q=60' },
  ];

  const performersList = topPerformers.length > 0 ? topPerformers : fallbackPerformers;

  // View only the latest 5 orders for the Overview dashboard
  const recentOrders = orders.slice(0, 5).map(order => ({
    id: order.orderId,
    customer: order.customer?.name || 'Guest User',
    total: `Rs. ${order.total.toLocaleString()}`,
    status: order.status
  }));

  return (
    <div className="overview-page-new animate-fade-in">
      
      {/* 4 Stats Cards Grid */}
      <div className="stats-grid-new">
        <StatCard 
          title="TOTAL PRODUCTS" 
          value={totalProducts} 
          percentage="100%" 
          icon={<ShoppingBag size={20} />} 
          trendUp={true}
        />
        <StatCard 
          title="ACTIVE CATEGORIES" 
          value={activeCategories} 
          percentage="100%" 
          icon={<Layers size={20} />} 
          trendUp={true}
        />
        <StatCard 
          title="FEATURED ITEMS" 
          value={featuredItems} 
          percentage="15%" 
          icon={<Eye size={20} />} 
          trendUp={true}
        />
        <StatCard 
          title="TOTAL STOCK" 
          value={totalStock} 
          percentage="4.2%" 
          icon={<TrendingUp size={20} />} 
          trendUp={true}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="analytics-grid-new">
        
        {/* Left Column: Revenue Analytics */}
        <div className="analytics-card-new chart-section-new">
          <div className="card-header-new">
            <div className="header-titles">
              <h2 className="card-title-new">Revenue Analytics</h2>
              <span className="card-subtitle-new">WEEKLY TREND ANALYSIS</span>
            </div>
            <div className="live-data-badge">
              <span className="badge-dot"></span>
              <span className="badge-text">LIVE DATA</span>
            </div>
          </div>
          <div className="chart-container-new">
            {loading ? (
              <div style={{ display: 'flex', height: '300px', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-pink)' }} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenuePink" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-pink)" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="var(--accent-pink)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(val) => val === 0 ? '0' : `Rs. ${val.toLocaleString()}`}
                    tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card-bg, #ffffff)', 
                      border: '1px solid rgba(0,0,0,0.08)', 
                      borderRadius: '12px',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
                    }}
                    itemStyle={{ color: 'var(--text-main, #0f172a)', fontWeight: 600 }}
                    labelStyle={{ color: 'var(--text-muted, #64748b)', fontWeight: 500 }}
                    formatter={(value) => [`Rs. ${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="var(--accent-pink)" 
                    strokeWidth={3}
                    activeDot={{ r: 6, stroke: 'var(--accent-pink)', strokeWidth: 2, fill: '#ffffff' }}
                    dot={{ r: 4, stroke: 'var(--accent-pink)', strokeWidth: 2, fill: '#ffffff' }}
                    fillOpacity={1} 
                    fill="url(#colorRevenuePink)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Column: Order Status */}
        <div className="analytics-card-new pie-section-new">
          <div className="card-header-new">
            <div className="header-titles">
              <h2 className="card-title-new">Order Status</h2>
              <span className="card-subtitle-new">TODAY'S STATISTICS BREAKDOWN</span>
            </div>
          </div>
          <div className="pie-container-relative">
            {loading ? (
              <div style={{ display: 'flex', height: '200px', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-pink)' }} />
              </div>
            ) : (
              <div className="chart-container-new">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="pie-center-content">
                  <span className="pie-center-value">{totalOrders}</span>
                  <span className="pie-center-label">ORDERS</span>
                </div>
              </div>
            )}
          </div>

          {/* Color coded status legend */}
          <div className="pie-legend-grid">
            <div className="legend-column">
              <div className="legend-item">
                <div className="legend-label-left">
                  <span className="legend-dot" style={{ backgroundColor: '#10b981' }}></span>
                  <span className="legend-name">Delivered</span>
                </div>
                <span className="legend-percentage">{deliveredPercent}%</span>
              </div>
              <div className="legend-item">
                <div className="legend-label-left">
                  <span className="legend-dot" style={{ backgroundColor: '#f59e0b' }}></span>
                  <span className="legend-name">Out for Delivery</span>
                </div>
                <span className="legend-percentage">{outPercent}%</span>
              </div>
            </div>
            <div className="legend-column">
              <div className="legend-item">
                <div className="legend-label-left">
                  <span className="legend-dot" style={{ backgroundColor: '#3b82f6' }}></span>
                  <span className="legend-name">Pending</span>
                </div>
                <span className="legend-percentage">{pendingPercent}%</span>
              </div>
              <div className="legend-item">
                <div className="legend-label-left">
                  <span className="legend-dot" style={{ backgroundColor: '#ef4444' }}></span>
                  <span className="legend-name">Cancelled</span>
                </div>
                <span className="legend-percentage">{cancelledPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Orders & Top Performers */}
      <div className="bottom-grid-new">
        
        {/* Left Column Table: Recent Orders */}
        <div className="bottom-card-new table-section-new">
          <div className="card-header-new">
            <div className="header-titles">
              <h2 className="card-title-new">Recent Orders</h2>
              <span className="card-subtitle-new">LIVE DATABASE UPDATES</span>
            </div>
            <a href="/admin/orders" className="view-all-link">
              View All Orders <ArrowRight size={14} className="link-arrow" />
            </a>
          </div>
          <div className="table-responsive-new">
            {loading ? (
              <div style={{ display: 'flex', padding: '3rem', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-pink)' }} />
              </div>
            ) : recentOrders.length === 0 ? (
              <div style={{ textalign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No orders placed yet.
              </div>
            ) : (
              <table className="recent-orders-table-new">
                <thead>
                  <tr>
                    <th>ORDER</th>
                    <th>CUSTOMER</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    let statusClass = 'status-pending';
                    if (order.status === 'Delivered') statusClass = 'status-delivered';
                    if (order.status === 'Out for Delivery') statusClass = 'status-out';
                    if (order.status === 'Cancelled') statusClass = 'status-cancelled';
                    
                    return (
                      <tr key={order.id}>
                        <td className="order-id-cell">{order.id}</td>
                        <td className="customer-cell">{order.customer}</td>
                        <td className="total-cell">{order.total}</td>
                        <td>
                          <span className={`status-badge-new ${statusClass}`}>
                            <span className="status-badge-dot"></span>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <a href="/admin/orders" className="action-eye-btn" title="View details" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Eye size={16} />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column List: Top Performers */}
        <div className="bottom-card-new top-items-section-new">
          <div className="card-header-new">
            <div className="header-titles">
              <h2 className="card-title-new">Top Performers</h2>
              <span className="card-subtitle-new">LAST 7 DAYS PERFORMANCE</span>
            </div>
          </div>
          <div className="top-items-list-new">
            {performersList.map((item, idx) => (
              <div key={idx} className="top-item-row-new">
                <div className="top-item-left">
                  <div className="top-item-image-wrapper">
                    <img src={item.image} alt={item.name} className="top-item-img" />
                  </div>
                  <div className="top-item-details">
                    <span className="top-item-name">{item.name}</span>
                    <span className="top-item-tag">{item.category}</span>
                  </div>
                </div>
                <div className="top-item-right">
                  <span className="top-item-price">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Overview;
