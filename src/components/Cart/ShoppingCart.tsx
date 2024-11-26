import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../common/Button';
import { 
  addItem, 
  removeItem, 
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCartItemCount
} from '../../store/cartSlice';
import { CartItem } from '../../types';

const ShoppingCart: React.FC = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);

  const handleAddItem = useCallback((item: CartItem) => {
    dispatch(addItem(item));
  }, [dispatch]);

  const handleRemoveItem = useCallback((itemId: string) => {
    dispatch(removeItem(itemId));
  }, [dispatch]);

  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Shopping Cart</h2>
        </div>
        <p className="text-center text-gray-500 italic">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Shopping Cart ({itemCount} items)
        </h2>
        <Button 
          variant="secondary" 
          onClick={handleClearCart}
          aria-label="Clear cart"
          className="text-sm"
        >
          Clear Cart
        </Button>
      </div>

      {items.map((item) => (
        <div 
          key={item.id} 
          className="flex justify-between items-center py-4 border-b last:border-b-0"
        >
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
            <p className="text-gray-600">${item.price.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => handleRemoveItem(item.id)}
              aria-label={`Remove one ${item.name}`}
              className="px-3 py-1"
            >
              -
            </Button>
            <span className="min-w-[20px] text-center">{item.quantity}</span>
            <Button
              variant="outline"
              onClick={() => handleAddItem(item)}
              aria-label={`Add one ${item.name}`}
              className="px-3 py-1"
            >
              +
            </Button>
          </div>
        </div>
      ))}

      <div className="mt-6 text-right text-xl font-bold text-gray-800">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
};

export default React.memo(ShoppingCart);
