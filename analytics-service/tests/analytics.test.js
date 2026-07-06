const { calculateStats } = require('../src/kafka/consumer');

describe('Analytics Service - Unit Tests', () => {
  
  // Test 1: Provera da li računa procente kako treba
  it('should correctly calculate percentage stats for trip items', () => {
    const mockItems = [
      { category: 'HOTEL' },
      { category: 'HOTEL' },
      { category: 'RESTAURANT' },
      { category: 'ATTRACTION' }
    ];

    const stats = calculateStats(mockItems);

    // 2 od 4 su HOTEL -> 50%
    expect(stats.hotel).toEqual('50.00');
    // 1 od 4 je RESTAURANT -> 25%
    expect(stats.restaurant).toEqual('25.00');
    // 1 od 4 je ATTRACTION -> 25%
    expect(stats.attraction).toEqual('25.00');
  });

  // Test 2: Granični slučaj kada nema stavki
  it('should return 0% for all categories if items array is empty', () => {
    const stats = calculateStats([]);
    expect(stats.hotel).toEqual('0.00');
    expect(stats.restaurant).toEqual('0.00');
    expect(stats.attraction).toEqual('0.00');
  });
});