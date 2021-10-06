import { useReducer } from 'react';
import CartContext from './cart-context';

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  /* ADD */
  if (action.type === 'ADD') {
    // update state in an inmutable way. concat gives a brand new array instead of editing old array in memory
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    // returns index of item if already exists
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    // will be null if item does not exist
    const existingCartItem = state.items[existingCartItemIndex];

    let updatedItems;

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem; // if item exists already
    } else {
      updatedItems = state.items.concat(action.item); // if it does not
    }

    // either way, we return the new state snapshot with the following updated items
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }

  /* REMOVE */
  if (action.type === 'REMOVE') {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;

    let updatedItems;
    if (existingItem.amount === 1) {
      // last item of that type. remove entire item from array
      updatedItems = state.items.filter((item) => item.id !== action.id); // gives new array without prev item
    } else {
      // keep item in array, but decrease amount
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: 'ADD', item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: 'REMOVE', id: id });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
