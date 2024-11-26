import React, { Suspense, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Button from './components/common/Button';
import { FormValues } from './types';
import { useDispatch } from 'react-redux';
import { addItem } from './store/cartSlice';

// Lazy loaded components
const DynamicForm = React.lazy(() => import('./components/Form/DynamicForm'));
const ShoppingCart = React.lazy(() => import('./components/Cart/ShoppingCart'));
const Modal = React.lazy(() => import('./components/common/Modal'));

const AppContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<'form' | 'cart'>('form');
  const dispatch = useDispatch();

  const handleFormSubmit = async (values: FormValues): Promise<void> => {
    console.log('Form submitted:', values);
    setIsModalOpen(true);
  };

  const handleAddTestItem = () => {
    dispatch(addItem({
      id: Math.random().toString(36).substr(2, 9),
      name: 'Test Item',
      price: 9.99,
      quantity: 1
    }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">React Knowledge Demo</h1>
        <div className="mt-4">
          <Button 
            variant={activeComponent === 'form' ? 'primary' : 'outline'}
            onClick={() => setActiveComponent('form')}
            className="mr-3 bg-primary text-white hover:bg-primary-hover"
          >
            Show Form
          </Button>
          <Button 
            variant={activeComponent === 'cart' ? 'primary' : 'outline'}
            onClick={() => setActiveComponent('cart')}
            className=" bg-secondary text-white hover:bg-secondary-hover"
          >
            Show Cart
          </Button>
        </div>
        {activeComponent === 'cart' && (
          <Button
            variant="primary"
            onClick={handleAddTestItem}
            className="mt-4  bg-primary text-white hover:bg-primary-hover"
          >
            Add Test Item to Cart
          </Button>
        )}
      </header>

      <main>
        <Suspense fallback={
          <div className="flex justify-center items-center h-[200px] bg-gray-50 rounded-lg">
            Loading...
          </div>
        }>
          <section className="mb-8">
            {activeComponent === 'form' ? (
              <DynamicForm onSubmit={handleFormSubmit} />
            ) : (
              <ShoppingCart />
            )}
          </section>
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Success!"
          ariaLabel="Success notification"
        >
          <p className="mb-4">Form submitted successfully!</p>
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </Modal>
      </Suspense>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
