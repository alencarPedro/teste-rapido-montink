import { useState, useEffect } from 'react';
import ProductImages from './ProductImages';
import DeliveryCheck from './DeliveryCheck';

interface ProductVariant {
	id: number;
	product_id: number;
	price: string;
	values: string[];
	image_id: number;
	inventory_quantity: number;
	image_url: string;
}

interface ProductImage {
	id: number;
	product_id: number;
	src: string;
}

interface Product {
	id: number;
	title: string;
	options: string[];
	values: string[][];
	variants: ProductVariant[];
	image_url: string;
	images: ProductImage[];
}

interface CheckoutItem {
	values: string[];
	quantity: number;
	product_id: number;
	variant_id: number;
}

const ProductPage = () => {
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
	const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
	const [stockAlert, setStockAlert] = useState<string | null>(null);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true);
				const response = await fetch('https://empreender.nyc3.cdn.digitaloceanspaces.com/static/teste-prod-1.json');

				if (!response.ok) {
					throw new Error('Failed to fetch product data');
				}

				const data = await response.json();
				setProduct(data);

				if (data.options && data.values) {
					const initialOptions: Record<string, string> = {};
					data.options.forEach((option: string | number, index: string | number) => {
						if (data.values[index] && data.values[index].length > 0) {
							initialOptions[option] = data.values[index][0];
						}
					});
					setSelectedOptions(initialOptions);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, []);

	useEffect(() => {
		if (!product) return;

		const matchingVariant = product.variants.find((variant) => {
			if (variant.values.length !== Object.keys(selectedOptions).length) return false;

			return Object.entries(selectedOptions).every(([option, value]) => {
				const optionIndex = product.options.findIndex((o) => o === option);
				if (optionIndex === -1) return false;

				return variant.values[optionIndex] === value;
			});
		});

		setSelectedVariant(matchingVariant || null);

		if (matchingVariant) {
			if (matchingVariant.inventory_quantity <= 0) {
				setStockAlert('Produto esgotado!');
			} else if (matchingVariant.inventory_quantity < 5) {
				setStockAlert(`Apenas ${matchingVariant.inventory_quantity} unidades em estoque!`);
			} else {
				setStockAlert(null);
			}
		} else {
			setStockAlert('Combinação de variantes não disponível');
		}
	}, [selectedOptions, product]);

	const handleOptionChange = (option: string, value: string) => {
		setSelectedOptions((prev) => ({
			...prev,
			[option]: value,
		}));
	};

	const handleCheckout = async () => {
		if (!product || !selectedVariant) return;

		if (selectedVariant.inventory_quantity <= 0) {
			alert('Este produto está fora de estoque!');
			return;
		}

		try {
			console.log('Variant data:', selectedVariant);
			const checkoutItem: CheckoutItem = {
				values: selectedVariant.values,
				quantity: 1,
				product_id: product.id,
				variant_id: selectedVariant.id,
			};

			console.log('Sending checkout item:', [checkoutItem]);

			const response = await fetch(
				'https://app.landingpage.com.br/api/checkoutloja/LPL2gc/5d87eb644e5631bc6a03f1e43a804e1c',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify([checkoutItem]),
					mode: 'cors',
				}
			);

			console.log('Response status:', response.status);

			if (!response.ok) {
				throw new Error('Falha ao processar o checkout');
			}

			alert('Checkout realizado com sucesso!');
		} catch (err) {
			alert('Erro ao processar o checkout: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-teal-500 animate-spin"></div>
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className="p-6 mx-auto max-w-7xl">
				<div className="p-6 mb-8 bg-white rounded-lg shadow-md">
					<h1 className="text-xl font-bold text-red-600">Erro ao carregar o produto</h1>
					<p className="mt-2 text-gray-700">{error || 'Produto não encontrado'}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
			<div className="p-6 mb-8 bg-white rounded-lg shadow-md">
				<div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
					{/* Product Images */}
					<div className="lg:col-span-1">
						<ProductImages
							images={[product.image_url, ...product.images.map((img) => img.src)]}
							productName={product.title}
							selectedColor={selectedOptions['Cor']}
						/>
					</div>

					{/* Product Info with dynamic variants */}
					<div className="lg:col-span-1">
						<div className="product-info">
							{/* Product Name */}
							<h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">{product.title}</h1>

							{/* Price */}
							<div className="flex items-center mb-6">
								<p className="text-3xl font-bold text-gray-900">
									R$ {selectedVariant ? parseFloat(selectedVariant.price).toFixed(2).replace('.', ',') : '0,00'}
								</p>
								<p className="ml-3 text-sm text-gray-500">Em até 12x sem juros</p>
							</div>

							{/* Stock Alert */}
							{stockAlert && (
								<div
									className={`p-3 mb-6 rounded-md ${
										stockAlert.includes('esgotado') ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
									}`}>
									{stockAlert}
								</div>
							)}

							{/* Dynamic Options (Color, Size, etc.) */}
							{product.options.map((option, optionIndex) => (
								<div
									key={option}
									className="mb-6">
									<h2 className="mb-2 text-sm font-medium text-gray-900">{option}</h2>
									<div className="flex flex-wrap gap-2">
										{product.values[optionIndex].map((value) => {
											// For color options, show color swatches
											if (option.toLowerCase() === 'cor') {
												// Map color names to color classes
												const colorClasses: Record<string, string> = {
													Preto: 'bg-gray-900',
													Branco: 'bg-white border border-gray-300',
													Azul: 'bg-blue-600',
													Cinza: 'bg-gray-500',
													Vermelho: 'bg-red-600',
													// Add more colors as needed
												};

												return (
													<button
														key={value}
														type="button"
														className={`relative flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ${
															selectedOptions[option] === value ? 'ring-2 ring-teal-500' : ''
														}`}
														onClick={() => handleOptionChange(option, value)}>
														<span className="sr-only">{value}</span>
														<span
															className={`h-8 w-8 rounded-full ${colorClasses[value] || 'bg-gray-300'}`}
															aria-hidden="true"
														/>
													</button>
												);
											} else {
												// For other options (like size), show buttons
												return (
													<button
														key={value}
														type="button"
														className={`flex items-center justify-center rounded-md border py-2 px-4 text-sm font-medium uppercase focus:outline-none cursor-pointer ${
															selectedOptions[option] === value
																? 'border-teal-500 bg-teal-50 text-teal-700'
																: 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
														}`}
														onClick={() => handleOptionChange(option, value)}>
														{value}
													</button>
												);
											}
										})}
									</div>
									<p className="mt-2 text-sm text-gray-500">Selecionado: {selectedOptions[option]}</p>
								</div>
							))}

							{/* Checkout Button */}
							<div className="mt-8">
								<button
									type="button"
									onClick={handleCheckout}
									disabled={!selectedVariant || selectedVariant.inventory_quantity <= 0}
									className={`flex justify-center items-center px-8 py-3 w-full text-base font-medium text-white rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
										!selectedVariant || selectedVariant.inventory_quantity <= 0
											? 'bg-gray-400 cursor-not-allowed'
											: 'bg-teal-600 hover:bg-teal-700'
									}`}>
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
									{selectedVariant && selectedVariant.inventory_quantity > 0 ? 'Comprar Agora' : 'Produto Indisponível'}
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
