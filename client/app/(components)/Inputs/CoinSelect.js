import React, { useState, useEffect, useRef } from 'react';
import { useField } from 'formik';

const CoinSelect = ({ options, ...props }) => {
	const [field, meta, helpers] = useField(props);
	const { value } = field;
	const { setValue } = helpers;
	const [isOpen, setIsOpen] = useState(false);
	const [selectedValue, setSelectedValue] = useState(value || "Coin");
	const selectRef = useRef(null);

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

	const handleOptionClick = (option) => {
		setSelectedValue(option[1]);
		setValue(option[0]);
		setIsOpen(false);
	};

	return (
		<div className="relative" ref={selectRef}>
			<div
				onClick={() => setIsOpen(!isOpen)}
				className={`hover:brightness-75 w-full bg-white text-neutral-950 placeholder:text-neutral-950 text-center border-none py-3 px-6 outline-none cursor-pointer ${isOpen ? 'rounded-t-xl' : 'rounded-xl'}`}
			>
				{selectedValue}
			</div>
			{isOpen && (
				<div className="scrollbar-none absolute z-10 w-full bg-white border-none rounded-b-xl overflow-y-auto max-h-64 overscroll-y-none">
					{options.map((option, index) => (
						<div
							key={index}
							onClick={() => handleOptionClick(option)}
							className="text-neutral-950 text-center py-3 px-6 cursor-pointer hover:bg-neutral-300"
						>
							{option[1]}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default CoinSelect;
