const calculateStats = (items) => {
    const totalItems = items.length;
    
    let hotels = 0;
    let restaurants = 0;
    let attractions = 0;

    items.forEach(item => {
        if (item.category === 'HOTEL') hotels++;
        if (item.category === 'RESTAURANT') restaurants++;
        if (item.category === 'ATTRACTION') attractions++;
    });

    // Ako nema stavki, procenti su nula da ne delimo sa 0
    const getPercent = (count) => totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;

    return {
        totalItems,
        hotels,
        restaurants,
        attractions,
        percentages: {
            hotels: getPercent(hotels),
            restaurants: getPercent(restaurants),
            attractions: getPercent(attractions)
        }
    };
};

module.exports = { calculateStats };