import React, { createContext, useContext, useReducer, useEffect } from "react";

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

  // Load cart from localStorage on mount
  useEffect(() => {
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
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity },
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { id: productId },
    });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({
      type: CART_ACTIONS.CLEAR_CART,
    });
  };

  // Computed values
  const cartItemsCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = state.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const isInCart = (productId) => {
    return state.items.some((item) => item.id === productId);
  };

  const getCartItemQuantity = (productId) => {
    const item = state.items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Context value
  const contextValue = {
    // State
    cartItems: state.items,
    cartItemsCount,
    cartTotal,

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
