import { useState } from 'react';

interface Address {
	cep: string;
	logradouro: string;
	complemento: string;
	bairro: string;
	localidade: string;
	uf: string;
}

const DeliveryCheck = () => {
	// Storage key constants
	const STORAGE_KEY_CEP = 'savedCEP';
	const STORAGE_KEY_ADDRESS = 'savedAddress';
	const STORAGE_KEY_CEP_TIMESTAMP = 'cepTimestamp';

	// 30 days in milliseconds for CEP storage
	const CEP_EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000;

	// Initialize state from localStorage if available and not expired
	const getInitialCEP = () => {
		try {
			const timestamp = localStorage.getItem(STORAGE_KEY_CEP_TIMESTAMP);
			if (!timestamp) return '';

			const savedTime = parseInt(timestamp, 10);
			const currentTime = new Date().getTime();

			// Check if the saved CEP is still valid (less than 30 days old)
			if (currentTime - savedTime < CEP_EXPIRATION_TIME) {
				const savedCEP = localStorage.getItem(STORAGE_KEY_CEP);
				if (savedCEP) {
					return savedCEP;
				}
			} else {
				// Clear expired CEP data
				localStorage.removeItem(STORAGE_KEY_CEP);
				localStorage.removeItem(STORAGE_KEY_ADDRESS);
				localStorage.removeItem(STORAGE_KEY_CEP_TIMESTAMP);
			}
		} catch (error) {
			console.error('Error accessing localStorage for CEP:', error);
		}
		return '';
	};

	const getInitialAddress = () => {
		try {
			const timestamp = localStorage.getItem(STORAGE_KEY_CEP_TIMESTAMP);
			if (!timestamp) return null;

			const savedTime = parseInt(timestamp, 10);
			const currentTime = new Date().getTime();

			// Check if the saved address is still valid (less than 30 days old)
			if (currentTime - savedTime < CEP_EXPIRATION_TIME) {
				const savedAddress = localStorage.getItem(STORAGE_KEY_ADDRESS);
				if (savedAddress) {
					return JSON.parse(savedAddress) as Address;
				}
			}
		} catch (error) {
			console.error('Error accessing localStorage for address:', error);
		}
		return null;
	};

	const [cep, setCep] = useState(getInitialCEP);
	const [address, setAddress] = useState<Address | null>(getInitialAddress);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const formatCEP = (value: string) => {
		// Remove non-numeric characters
		const numericValue = value.replace(/\D/g, '');

		// Format as CEP (XXXXX-XXX)
		if (numericValue.length <= 5) {
			return numericValue;
		} else {
			return `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`;
		}
	};

	const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formattedCEP = formatCEP(e.target.value);
		setCep(formattedCEP);

		// Clear previous results when input changes
		if (formattedCEP.length !== 9) {
			setAddress(null);
			setError('');
		}
	};

	const checkDelivery = async () => {
		// Only proceed if CEP has the correct length (XXXXX-XXX)
		if (cep.length !== 9) {
			setError('CEP inválido. Por favor, digite um CEP no formato XXXXX-XXX');
			return;
		}

		setIsLoading(true);
		setError('');
		setAddress(null);

		try {
			// Remove the hyphen for the API call
			const cepNumbers = cep.replace('-', '');
			const response = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`);

			if (!response.ok) {
				throw new Error(`Erro na requisição: ${response.status}`);
			}

			const data = await response.json();

			if (data.erro) {
				setError('CEP não encontrado');
			} else {
				setAddress(data);

				// Save to localStorage
				try {
					localStorage.setItem(STORAGE_KEY_CEP, cep);
					localStorage.setItem(STORAGE_KEY_ADDRESS, JSON.stringify(data));
					localStorage.setItem(STORAGE_KEY_CEP_TIMESTAMP, new Date().getTime().toString());
				} catch (error) {
					console.error('Error saving CEP data to localStorage:', error);
				}
			}
		} catch (err) {
			console.error('Erro na consulta de CEP:', err);
			setError('Erro ao consultar o CEP. Por favor, tente novamente.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="pt-8 mt-8 border-t border-gray-200">
			<h2 className="mb-4 text-lg font-medium text-gray-900">Verificar disponibilidade de entrega</h2>

			<div className="flex flex-col gap-2 sm:flex-row">
				<div className="relative flex-grow">
					<input
						type="text"
						value={cep}
						onChange={handleCEPChange}
						placeholder="Digite seu CEP"
						maxLength={9}
						className="px-4 py-2 w-full rounded-md border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
					/>
				</div>
				<button
					onClick={checkDelivery}
					disabled={isLoading}
					className="px-4 py-2 text-white bg-teal-600 rounded-md cursor-pointer hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50">
					{isLoading ? 'Verificando...' : 'Verificar'}
				</button>
			</div>

			{error && <div className="mt-2 text-sm text-red-600">{error}</div>}

			{address && (
				<div className="p-4 mt-4 bg-gray-50 rounded-md">
					<h3 className="mb-2 font-medium text-gray-900">Endereço encontrado:</h3>
					<p className="text-gray-700">
						{address.logradouro}
						{address.complemento ? `, ${address.complemento}` : ''}
						<br />
						{address.bairro} - {address.localidade}/{address.uf}
						<br />
						CEP: {address.cep}
					</p>
					<div className="flex items-center mt-3">
						<svg
							className="w-5 h-5 text-green-500"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
						<span className="ml-2 text-sm font-medium text-green-700">Entrega disponível para este endereço</span>
					</div>
				</div>
			)}

			<div className="mt-4 text-sm text-gray-500">
				<p>
					Não sabe seu CEP?{' '}
					<a
						href="https://buscacepinter.correios.com.br/app/endereco/index.php"
						target="_blank"
						rel="noopener noreferrer"
						className="text-teal-600 hover:text-teal-500">
						Consulte aqui
					</a>
				</p>
			</div>
		</div>
	);
};

export default DeliveryCheck;
