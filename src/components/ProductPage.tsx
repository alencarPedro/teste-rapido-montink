import { useState, useEffect } from 'react';
import ProductImages from './ProductImages';
import DeliveryCheck from './DeliveryCheck';
import CartModal from './CartModal';

interface CartItem {
	id: string;
	name: string;
	price: number;
	color: string;
	colorName: string;
	size: string;
	quantity: number;
	image: string;
}

const ProductPage = () => {
	// Cart state and modal state
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [cartItemCount, setCartItemCount] = useState(0);
	// Sample product data with dynamic variants
	const product = {
		name: 'Camiseta Básica de Algodão',
		price: 89.9,
		colors: ['preto', 'branco', 'azul', 'cinza', 'vermelho'],
		sizes: ['P', 'M', 'G', 'GG', 'XG'],
		description: 'Uma camiseta básica de algodão que nunca sai de moda. Perfeita para o uso diário.',
	};

	// Sample images for different colors - using Unsplash free images
	const productImages: Record<string, string[]> = {
		preto: [
			'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
		],
		branco: [
			'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1651761179569-4ba2aa054997?q=80&w=1000&auto=format&fit=crop',
		],
		azul: [
			'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1000&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1000&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=1000&auto=format&fit=crop',
		],
		cinza: [
			'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1000&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1624124959947-5fa0f8886507?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGdyYXklMjB0c2hpcnQlMjBmcmVlfGVufDB8fDB8fHww',
			'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
		],
		vermelho: [
			'https://images.unsplash.com/photo-1622383129027-0f7f544b8abe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJlZCUyMHRzaGlydCUyMGZyZWV8ZW58MHx8MHx8fDA%3D',
			'https://images.unsplash.com/photo-1521498542256-5aeb47ba2b36?q=80&w=1000&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop',
		],
	};

	// Storage key constants
	const STORAGE_KEY_COLOR = 'selectedColor';
	const STORAGE_KEY_SIZE = 'selectedSize';
	const STORAGE_KEY_TIMESTAMP = 'selectionTimestamp';
	const STORAGE_KEY_CART = 'cartItems';
	const STORAGE_KEY_CART_TIMESTAMP = 'cartTimestamp';

	// 15 minutes in milliseconds for selections, 30 minutes for cart
	const EXPIRATION_TIME = 15 * 60 * 1000;
	const CART_EXPIRATION_TIME = 30 * 60 * 1000;

	// Initialize state from localStorage if available and not expired
	const getInitialSelection = (key: string, defaultValue: string) => {
		try {
			const timestamp = localStorage.getItem(STORAGE_KEY_TIMESTAMP);
			if (!timestamp) return defaultValue;

			const savedTime = parseInt(timestamp, 10);
			const currentTime = new Date().getTime();

			// Check if the saved selection is still valid (less than 15 minutes old)
			if (currentTime - savedTime < EXPIRATION_TIME) {
				const savedValue = localStorage.getItem(key);
				// Only use the saved value if it's in the available options
				if (
					savedValue &&
					((key === STORAGE_KEY_COLOR && product.colors.includes(savedValue)) ||
						(key === STORAGE_KEY_SIZE && product.sizes.includes(savedValue)))
				) {
					return savedValue;
				}
			} else {
				// Clear expired selections
				localStorage.removeItem(STORAGE_KEY_COLOR);
				localStorage.removeItem(STORAGE_KEY_SIZE);
				localStorage.removeItem(STORAGE_KEY_TIMESTAMP);
			}
		} catch (error) {
			console.error('Error accessing localStorage:', error);
		}
		return defaultValue;
	};

	const [selectedColor, setSelectedColor] = useState(() => getInitialSelection(STORAGE_KEY_COLOR, product.colors[0]));
	const [selectedSize, setSelectedSize] = useState(() => getInitialSelection(STORAGE_KEY_SIZE, product.sizes[0]));

	// Save selections to localStorage whenever they change
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY_COLOR, selectedColor);
			localStorage.setItem(STORAGE_KEY_SIZE, selectedSize);
			localStorage.setItem(STORAGE_KEY_TIMESTAMP, new Date().getTime().toString());
		} catch (error) {
			console.error('Error saving to localStorage:', error);
		}
	}, [selectedColor, selectedSize]);

	// Load cart from localStorage on component mount
	useEffect(() => {
		try {
			const timestamp = localStorage.getItem(STORAGE_KEY_CART_TIMESTAMP);
			if (!timestamp) return;

			const savedTime = parseInt(timestamp, 10);
			const currentTime = new Date().getTime();

			// Check if the saved cart is still valid (less than 30 minutes old)
			if (currentTime - savedTime < CART_EXPIRATION_TIME) {
				const savedCart = localStorage.getItem(STORAGE_KEY_CART);
				if (savedCart) {
					const parsedCart = JSON.parse(savedCart) as CartItem[];
					setCartItems(parsedCart);
					setCartItemCount(parsedCart.reduce((total, item) => total + item.quantity, 0));
				}
			} else {
				// Clear expired cart
				localStorage.removeItem(STORAGE_KEY_CART);
				localStorage.removeItem(STORAGE_KEY_CART_TIMESTAMP);
			}
		} catch (error) {
			console.error('Error loading cart from localStorage:', error);
		}
	}, [CART_EXPIRATION_TIME]);

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cartItems));
			localStorage.setItem(STORAGE_KEY_CART_TIMESTAMP, new Date().getTime().toString());
		} catch (error) {
			console.error('Error saving cart to localStorage:', error);
		}
	}, [cartItems]);

	// Color display names for better UI
	const colorNames: { [key: string]: string } = {
		preto: 'Preto',
		branco: 'Branco',
		azul: 'Azul',
		cinza: 'Cinza',
		vermelho: 'Vermelho',
	};

	// Color background classes for the color selector
	const colorClasses: { [key: string]: string } = {
		preto: 'bg-gray-900',
		branco: 'bg-white border border-gray-300',
		azul: 'bg-blue-600',
		cinza: 'bg-gray-500',
		vermelho: 'bg-red-600',
	};

	// Add to cart function
	const addToCart = () => {
		// Create a unique product identifier without the timestamp
		const productIdentifier = `${product.name}-${selectedColor}-${selectedSize}`;

		// Check if this product variant is already in the cart
		const existingItemIndex = cartItems.findIndex(
			(item) => `${item.name}-${item.color}-${item.size}` === productIdentifier
		);

		if (existingItemIndex !== -1) {
			// Item already exists, update its quantity
			setCartItems((prevItems) => {
				const updatedItems = [...prevItems];
				updatedItems[existingItemIndex] = {
					...updatedItems[existingItemIndex],
					quantity: updatedItems[existingItemIndex].quantity + 1,
				};
				return updatedItems;
			});
			setCartItemCount((prevCount) => prevCount + 1);
		} else {
			// Item doesn't exist, add new item
			const newItem: CartItem = {
				id: `${productIdentifier}-${Date.now()}`,
				name: product.name,
				price: product.price,
				color: selectedColor,
				colorName: colorNames[selectedColor] || selectedColor,
				size: selectedSize,
				quantity: 1,
				image: productImages[selectedColor][0],
			};

			setCartItems((prevItems) => [...prevItems, newItem]);
			setCartItemCount((prevCount) => prevCount + 1);
		}

		setIsCartOpen(true); // Open cart modal when adding item
	};

	// Remove from cart function
	const removeFromCart = (id: string) => {
		const itemToRemove = cartItems.find((item) => item.id === id);
		if (!itemToRemove) return;

		setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
		setCartItemCount((prevCount) => prevCount - itemToRemove.quantity);
	};

	return (
		<div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
			<div className="p-6 mb-8 bg-white rounded-lg shadow-md">
				{/* Cart Icon */}
				<div className="absolute top-4 right-4 sm:top-0 sm:right-8 p-[8px]">
					<button
						onClick={() => setIsCartOpen(true)}
						className="relative p-2 text-teal-600 cursor-pointer hover:text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
						<span className="sr-only">Abrir carrinho</span>
						<svg
							className="w-6 h-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
							/>
						</svg>
						{cartItemCount > 0 && (
							<span className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 text-xs font-medium text-white bg-teal-600 rounded-full">
								{cartItemCount}
							</span>
						)}
					</button>
				</div>

				{/* Cart Modal */}
				<CartModal
					isOpen={isCartOpen}
					onClose={() => setIsCartOpen(false)}
					cartItems={cartItems}
					removeFromCart={removeFromCart}
				/>

				<div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
					{/* Product Images */}
					<div className="lg:col-span-1">
						<ProductImages
							images={productImages[selectedColor]}
							productName={product.name}
							selectedColor={colorNames[selectedColor]}
						/>
					</div>

					{/* Product Info with dynamic variants */}
					<div className="lg:col-span-1">
						<div className="product-info">
							{/* Product Name */}
							<h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>

							{/* Price */}
							<div className="flex items-center mb-6">
								<p className="text-3xl font-bold text-gray-900">R$ {product.price.toFixed(2).replace('.', ',')}</p>
								<p className="ml-3 text-sm text-gray-500">Em até 12x sem juros</p>
							</div>

							{/* Color Selection - Dynamic from product.colors array */}
							<div className="mb-6">
								<h2 className="mb-2 text-sm font-medium text-gray-900">Cor</h2>
								<div className="flex flex-wrap gap-2">
									{product.colors.map((color) => (
										<button
											key={color}
											type="button"
											className={`relative flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ${
												selectedColor === color ? 'ring-2 ring-teal-500' : ''
											}`}
											onClick={() => setSelectedColor(color)}>
											<span className="sr-only">{colorNames[color] || color}</span>
											<span
												className={`h-8 w-8 rounded-full ${colorClasses[color] || 'bg-gray-300'}`}
												aria-hidden="true"
											/>
										</button>
									))}
								</div>
								<p className="mt-2 text-sm text-gray-500">Selecionado: {colorNames[selectedColor] || selectedColor}</p>
							</div>

							{/* Size Selection - Dynamic from product.sizes array */}
							<div className="mb-6">
								<div className="flex justify-between items-center">
									<h2 className="mb-2 text-sm font-medium text-gray-900">Tamanho</h2>
								</div>
								<div className="flex flex-wrap gap-2">
									{product.sizes.map((size) => (
										<button
											key={size}
											type="button"
											className={`flex items-center justify-center rounded-md border py-2 px-4 text-sm font-medium uppercase focus:outline-none cursor-pointer ${
												selectedSize === size
													? 'border-teal-500 bg-teal-50 text-teal-700'
													: 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
											}`}
											onClick={() => setSelectedSize(size)}>
											{size}
										</button>
									))}
								</div>
							</div>

							{/* Add to Cart Button */}
							<div className="mt-8">
								<button
									type="button"
									onClick={addToCart}
									className="flex justify-center items-center px-8 py-3 w-full text-base font-medium text-white bg-teal-600 rounded-md cursor-pointer hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="mr-2 w-5 h-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
										/>
									</svg>
									Adicionar ao Carrinho
								</button>
							</div>

							{/* Delivery Check Component */}
							<DeliveryCheck />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductPage;
