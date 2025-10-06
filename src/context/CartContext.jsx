import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  useCartItems,
  useAddToCart,
  useUpdateCartItem,
  useDeleteCartItem,
  useClearCart,
} from "@/lib/query/hooks/useCart";
import { useAuthUser } from "react-auth-kit";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

// Cart action types
const CART_ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  LOAD_CART: "LOAD_CART",
};

// Cart reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        // If item exists, update quantity
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      } else {
        // If item doesn't exist, add new item
        return {
          ...state,
          items: [...state.items, { ...product, quantity }],
        };
      }
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: [],
      };
    }

    case CART_ACTIONS.LOAD_CART: {
      return {
        ...state,
        items: action.payload.items || [],
      };
    }

    default:
      return state;
  }
};

// Initial cart state
const initialState = {
  items: [],
};

// Create Cart Context
const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const user = useCurrentUser();

  // API hooks - only use when user is logged in
  const userId = user?.id;
  const {
    data: apiCartData,
    isLoading: cartLoading,
    error: cartError,
  } = useCartItems(userId);

  console.log("🛒 CartContext - API cart data:", apiCartData);
  console.log("🛒 CartContext - Cart loading:", cartLoading);
  console.log("🛒 CartContext - Cart error:", cartError);
  const addToCartMutation = useAddToCart();
  const updateCartItemMutation = useUpdateCartItem();
  const deleteCartItemMutation = useDeleteCartItem();
  const clearCartMutation = useClearCart();

  // Load cart from API when user is logged in, otherwise from localStorage
  useEffect(() => {
    console.log(
      "🛒 CartContext useEffect - User:",
      user,
      "API Data:",
      apiCartData
    );
    if (user && apiCartData !== undefined) {
      // Transform API cart data to match local cart structure
      const transformedItems = Array.isArray(apiCartData)
        ? apiCartData.map((item) => ({
            id: item.id,
            product_id: item.product,
            product_attr_id: item.product_attr,
            name: item.product_name || "Product",
            price: item.price || 0,
            image: item.product_image || "/placeholder-product.jpg",
            quantity: item.qty || 1,
            user_id: item.user_id,
            user_type: item.user_type,
          }))
        : [];

      console.log("🛒 Transformed cart items:", transformedItems);
      dispatch({
        type: CART_ACTIONS.LOAD_CART,
        payload: { items: transformedItems },
      });
    } else if (!user) {
      // Load from localStorage when not logged in
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          dispatch({
            type: CART_ACTIONS.LOAD_CART,
            payload: { items: cartData.items || [] },
          });
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
        }
      }
    }
  }, [user?.id, apiCartData]);

  // Save cart to localStorage when not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(state));
    }
  }, [state, user]);

  // Cart actions
  const addToCart = async (product, quantity = 1, selectedAttribute = null) => {
    if (user) {
      // Use API when user is logged in
      try {
        const cartData = {
          user_id: user.id,
          user_type: "Reg", // Regular user type
          qty: quantity,
          product: product.id,
          product_attr:
            selectedAttribute?.id || product.attributes?.[0]?.id || null,
        };

        await addToCartMutation.mutateAsync(cartData);
      } catch (error) {
        console.error("Failed to add item to cart via API:", error);
        throw error;
      }
    } else {
      // Use local state when not logged in
      dispatch({
        type: CART_ACTIONS.ADD_ITEM,
        payload: { product, quantity },
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      // Use API when user is logged in
      try {
        const cartItem = state.items.find(
          (item) => item.product_id === productId
        );
        if (cartItem) {
          await deleteCartItemMutation.mutateAsync(cartItem.id);
        }
      } catch (error) {
        console.error("Failed to remove item from cart via API:", error);
        throw error;
      }
    } else {
      // Use local state when not logged in
      dispatch({
        type: CART_ACTIONS.REMOVE_ITEM,
        payload: { id: productId },
      });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (user) {
      // Use API when user is logged in
      try {
        const cartItem = state.items.find(
          (item) => item.product_attr_id.id === productId
        );
        if (cartItem) {
          const cartData = {
            user_id: user.id,
            user_type: "Reg",
            qty: quantity,
            product: cartItem.product_id,
            product_attr: cartItem?.product_attr_id?.id,
          };

          await updateCartItemMutation.mutateAsync({
            cartItemId: cartItem.id,
            cartData,
          });
        }
      } catch (error) {
        console.error("Failed to update cart item via API:", error);
        throw error;
      }
    } else {
      // Use local state when not logged in
      dispatch({
        type: CART_ACTIONS.UPDATE_QUANTITY,
        payload: { id: productId, quantity },
      });
    }
  };

  const clearCart = async () => {
    if (user) {
      // Use API when user is logged in
      try {
        await clearCartMutation.mutateAsync();
      } catch (error) {
        console.error("Failed to clear cart via API:", error);
        throw error;
      }
    } else {
      // Use local state when not logged in
      dispatch({
        type: CART_ACTIONS.CLEAR_CART,
      });
    }
  };

  // Computed values
  const cartItemsCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = state.items.reduce((total, item) => {
    return total + item?.product_attr_id?.price * item.quantity;
  }, 0);

  const mrpTotal = state.items.reduce((total, item) => {
    return total + item?.product_attr_id?.mrp * item.quantity;
  }, 0);
  const discount = state.items.reduce((total, item) => {
    const price = item?.product_attr_id?.price;
    const mrp = item?.product_attr_id?.mrp;
    const unitDiscount = mrp - price;
    const itemTotalDiscount = unitDiscount * item.quantity;
    return total + itemTotalDiscount;
  }, 0);

  const isInCart = (productId) => {
    const result = state.items.some((item) => {
      if (user) {
        // For logged-in users, check product_id from API data
        return item.product_id === productId;
      } else {
        // For guests, check the item id from local storage
        return item.id === productId;
      }
    });

    console.log("🛒 isInCart check:", {
      productId,
      items: state.items,
      user: !!user,
      result,
    });

    return result;
  };

  const getCartItemQuantity = (productId) => {
    const item = state.items.find((item) =>
      user ? item.product_id === productId : item.id === productId
    );
    return item ? item.quantity : 0;
  };

  // Check if user needs to login for cart actions
  const requiresLogin = !user;

  // Context value
  const contextValue = {
    // State
    cartItems: state.items,
    cartItemsCount,
    cartTotal,
    cartLoading,
    cartError,
    requiresLogin,
    mrpTotal,
    discount,
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Utilities
    isInCart,
    getCartItemQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};

export default CartContext;
