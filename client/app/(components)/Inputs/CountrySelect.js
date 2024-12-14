import { useState, useEffect, useRef } from 'react';
import { useField } from 'formik';

const CountrySelect = ({ options, ...props }) => {
	const [field, , helpers] = useField(props);
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const selectRef = useRef(null);

	const handleInputChange = e => {
		setSearchTerm(e.target.value);
		setIsOpen(true);
		helpers.setValue('');
	};

	const handleOptionClick = option => {
		setSearchTerm(option);
		helpers.setValue(option);
		setIsOpen(false);
	};

	const handleClickOutside = e => {
		if (selectRef.current && !selectRef.current.contains(e.target)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const filteredOptions = options.filter(option =>
		option.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="relative" ref={selectRef}>
			<input {...field} {...props} value={searchTerm} onChange={handleInputChange} onClick={() => setIsOpen(true)} placeholder="Country"
				className={`w-full text-black placeholder:text-black text-center border-none py-3 px-6 outline-none ${isOpen ? 'rounded-t-xl' : 'rounded-xl'}`} />
			{isOpen && (
				<div className={`scrollbar-none absolute z-10 w-full bg-white border-none rounded-b-xl overflow-y-auto max-h-64 overscroll-y-none`}>
					{filteredOptions.map((option, index) => (
						<div key={index} onClick={() => handleOptionClick(option)} className="text-black text-center py-3 px-6 cursor-pointer hover:bg-gray-100">
							{option}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default CountrySelect;
