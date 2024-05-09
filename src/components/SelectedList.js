// components/SelectList.js

import { useCallback, useRef, useState } from 'react';
import { TransactionTagPrintSelector } from './ModuleCentralClass';
import useClickOutside from './hooks/useClickOutside';

const SelectList = ({ options, onChange, className = ""}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onChange(option);
    setIsExpanded(false);
  };
  const absRef = useRef(null);
  const close = useCallback(() => setIsExpanded(false), []);
  useClickOutside(absRef,close)
  return (
    <div className={`relative duration-300 transition-all ${className}`}>
      <div
        className="border-b-[1px] border-gray-100 py-1 cursor-pointer
        px-1 pl-1 pb-1 grid grid-cols-9 gap-2"
        onClick={() => setIsExpanded(!isExpanded)}>
        <div className='col-span-8'>
            { selectedOption ? <TransactionTagPrintSelector
            textColor={selectedOption.textColor}
            customSelected={"text-white"}
            color={selectedOption.bgColor}
            icon={selectedOption.icon}
            name={selectedOption.name}/> 
            : <span className='text-white font-medium'>{lang =="th_th" ? "เลือกกลุ่ม" : "Select a group"}</span>}
            </div>
        <div className='text-white place-self-center'>
            <span className={`float-right text-right duration-200 transition-all ease-in-out w-full ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
            </span>
        </div>
      </div>
      {isExpanded && (
        <div ref={absRef} className="bg-white z-110 absolute mt-2 w-full max-h-40 overflow-y-scroll scrollbar rounded-l-md">
          <ul>
            {options.map((option) => (
              <li
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className={`cursor-pointer p-2 ${
                  option === selectedOption ? 'bg-blue-500 text-white' : ''
                }`}
              >
                <TransactionTagPrintSelector
                textColor={option.textColor}
                color={option.bgColor}
                icon={option.icon}
                name={option.name}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectList;
