// import React, { useState } from 'react';

// const MyComponent = () => {
//   const [selectedOptionId, setSelectedOptionId] = useState('');

//   const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
//     setSelectedOptionId(event.target.value);
//     console.log("id: ", event.target.value);
//   };

//   // Sample data for options
//   const options = [
//     { id: '1', value: 'Option 1' },
//     { id: '2', value: 'Option 2' },
//     { id: '3', value: 'Option 3' },
//   ];

//   return (
//     <div>
//       <label htmlFor="select">Select an option:</label>
     
//       <select id="select" value={selectedOptionId} onChange={handleChange}>

//         {options.map((option) => (
//           <option key={option.id} value={option.id}>
//             {option.value}
//           </option>
//         ))}
//       </select>
//       <p>Selected option ID: {selectedOptionId}</p>
//     </div>
//   );
// };

// export default MyComponent;


import React, { useState } from 'react';

const MyComponent = () => {
  const [selectedOption, setSelectedOption] = useState({ id: '', value: '' });

  const handleChange = (event: { target: { selectedIndex: any; options: { [x: string]: any; }; }; }) => {
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = event.target.options[selectedIndex]; // Access option object

    console.log("id: ", selectedOption.id);
    console.log("val: ", selectedOption.text);

    setSelectedOption({
      id: selectedOption.id,
      value: selectedOption.text, // Use .text for displayed value
    });
  };

  // Sample data for options
  const options = [
    { id: '1', value: 'Option 1' },
    { id: '2', value: 'Option 2' },
    { id: '3', value: 'Option 3' },
  ];

  return (
    <div>
      <label htmlFor="select">Select an option:</label>
      <select id="select" value={selectedOption.id} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.value}
          </option>
        ))}
      </select>
      <p>
        Selected option: {selectedOption.value} (ID: {selectedOption.id})
      </p>
    </div>
  );
};

export default MyComponent;
