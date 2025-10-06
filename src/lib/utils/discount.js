/**
 * Utility functions for discount calculations
 */

/**
 * Calculate discount percentage between original price and current price
 * @param {number} originalPrice - The original/MRP price
 * @param {number} currentPrice - The current selling price
 * @returns {number|null} - Discount percentage rounded to nearest integer, or null if no discount
 */
export const calculateDiscountPercentage = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) {
    return null;
  }

  const discountPercentage = Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100
  );
  return discountPercentage > 0 ? discountPercentage : null;
};

/**
 * Get discount badge data for a product
 * @param {Object} product - Product object
 * @param {Array} attributes - Product attributes array
 * @param {boolean} useFirstAttributeOnly - If true, use only first attribute for calculation
 * @returns {Object|null} - Badge object with text and variant, or null if no discount
 */
export const getDiscountBadge = (
  product,
  attributes = [],
  useFirstAttributeOnly = false
) => {
  if (!product || !attributes || attributes.length === 0) return null;

  // Check if product is discounted or on promo
  if (!product.is_discounted && !product.is_promo) return null;

  let currentPrice, originalPrice;

  if (useFirstAttributeOnly) {
    // Use only first attribute
    const firstAttr = attributes[0];
    currentPrice = parseFloat(firstAttr.price) || 0;
    originalPrice = parseFloat(firstAttr.mrp) || null;
  } else {
    // Calculate from all attributes (original behavior)
    const prices = attributes
      .map((attr) => parseFloat(attr.price))
      .filter((price) => !isNaN(price) && price > 0);

    const mrpPrices = attributes
      .map((attr) => parseFloat(attr.mrp))
      .filter((price) => !isNaN(price) && price > 0);

    if (prices.length === 0 || mrpPrices.length === 0) return null;

    currentPrice = Math.min(...prices);
    originalPrice = Math.max(...mrpPrices);
  }

  const discountPercentage = calculateDiscountPercentage(
    originalPrice,
    currentPrice
  );

  if (discountPercentage) {
    return {
      text: `-${discountPercentage}%`,
      variant: "destructive",
    };
  }

  return null;
};
