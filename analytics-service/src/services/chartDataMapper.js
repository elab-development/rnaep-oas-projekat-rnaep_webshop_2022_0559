const mapToChartData = (percentages) => {
    return {
        labels: ["Hoteli", "Restorani", "Atrakcije"],
        values: [percentages.hotels, percentages.restaurants, percentages.attractions]
    };
};

module.exports = { mapToChartData };