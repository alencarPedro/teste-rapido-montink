import { useEffect, useRef } from 'react';

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

interface CartModalProps {
	isOpen: boolean;
	onClose: () => void;
	cartItems: CartItem[];
	removeFromCart: (id: string) => void;
}

const CartModal = ({ isOpen, onClose, cartItems, removeFromCart }: CartModalProps) => {
	const modalRef = useRef<HTMLDivElement>(null);

	// Close modal when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, onClose]);

	// Calculate total price
	const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-30 backdrop-blur-sm">
			<div
				ref={modalRef}
				className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
				<div className="p-4 border-b border-gray-200 flex justify-between items-center">
					<h2 className="text-lg font-medium text-gray-900">Seu Carrinho</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-500">
						<span className="sr-only">Fechar</span>
						<svg
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-4">
					{cartItems.length === 0 ? (
						<div className="text-center py-8">
							<svg
								className="mx-auto h-12 w-12 text-gray-400"
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
							<p className="mt-2 text-sm text-gray-500">Seu carrinho está vazio</p>
						</div>
					) : (
						<ul className="divide-y divide-gray-200">
							{cartItems.map((item) => (
								<li
									key={item.id}
									className="py-4 flex">
									<div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
										<img
											src={item.image}
											alt={item.name}
											className="w-full h-full object-center object-cover"
										/>
									</div>
									<div className="ml-4 flex-1 flex flex-col">
										<div>
											<div className="flex justify-between text-base font-medium text-gray-900">
												<h3>{item.name}</h3>
												<p className="ml-4">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
											</div>
											<p className="mt-1 text-sm text-gray-500">
												{item.colorName} | {item.size} | Qtd: {item.quantity}
											</p>
										</div>
										<div className="flex-1 flex items-end justify-end text-sm">
											<button
												type="button"
												className="font-medium text-teal-600 hover:text-teal-500 cursor-pointer"
												onClick={() => removeFromCart(item.id)}>
												Remover
											</button>
										</div>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>

				<div className="border-t border-gray-200 p-4 space-y-4">
					<div className="flex justify-between text-base font-medium text-gray-900">
						<p>Subtotal</p>
						<p>R$ {totalPrice.toFixed(2).replace('.', ',')}</p>
					</div>
					<p className="text-sm text-gray-500">Frete e impostos calculados no checkout.</p>
					<div className="flex justify-center">
						<button
							type="button"
							className={`w-full py-3 px-8 flex items-center justify-center text-base font-medium rounded-md ${
								cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
							} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 cursor-pointer`}
							disabled={cartItems.length === 0}>
							Finalizar Compra
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartModal;
