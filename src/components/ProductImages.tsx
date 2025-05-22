import { useState, useEffect } from 'react';

interface ProductImagesProps {
	images: string[];
	productName: string;
	selectedColor?: string;
}

const ProductImages = ({ images, productName, selectedColor = 'default' }: ProductImagesProps) => {
	const [mainImage, setMainImage] = useState('');

	// Update main image when images change (e.g., when color changes)
	useEffect(() => {
		if (images && images.length > 0) {
			setMainImage(images[0]);
		}
	}, [images]);

	// Fallback images if none provided
	const displayImages = images.length > 0 ? images : ['https://via.placeholder.com/600x600?text=No+Image+Available'];

	return (
		<div className="w-full product-images">
			{/* Main Image - occupying about 35% of the screen */}
			<div className="mb-4 rounded-lg overflow-hidden border border-gray-200 bg-white h-[35vh]">
				<img
					src={mainImage}
					alt={`${productName}${selectedColor !== 'default' ? ` em ${selectedColor}` : ''}`}
					className="object-contain w-full h-full"
				/>
			</div>

			{/* Thumbnail Images */}
			<div className="grid grid-cols-4 gap-2">
				{displayImages.map((image, index) => (
					<button
						key={index}
						className={`rounded-md overflow-hidden border-2 ${
							image === mainImage ? 'border-teal-500' : 'border-gray-200'
						} hover:border-teal-300 transition-colors duration-200`}
						onClick={() => setMainImage(image)}>
						<img
							src={image}
							alt={`${productName} - imagem ${index + 1}`}
							className="object-cover w-full h-20"
						/>
					</button>
				))}
			</div>
		</div>
	);
};

export default ProductImages;
