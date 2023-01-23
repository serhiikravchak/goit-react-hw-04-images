import { useState } from 'react';
import {
  Header,
  SearchForm,
  SearchFormButton,
  SearchFormInput,
  Icon,
} from './SearchBar.styled';

export function Searchbar({ onSubmit }) {
  const [query, setQuery] = useState('');

  const handleSubmit = e => {
    onSubmit(query);
    setQuery('');
  };

  const handleChange = e => {
    setQuery(e.target.value.trim());
  };

  return (
    <Header>
      <SearchForm onSubmit={handleSubmit}>
        <SearchFormButton type="submit">
          <Icon />
        </SearchFormButton>
        <SearchFormInput
          type="text"
          name="query"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleChange}
        />
      </SearchForm>
    </Header>
  );
}

// export const Searchbar = ({ onSubmit }) => {

//   const handleSubmit = (values, { resetForm }) => {
//     onSubmit(values);
//     resetForm();
//   };

//   return (
// //     <Formik initialValues={{ searchQuery: '' }} onSubmit={handleSubmit}>
//       <Header>
//         <SearchForm>
//           <SearchFormButton type="submit">
//             <Icon />
//           </SearchFormButton>
//           <SearchFormInput
//             type="text"
//             name="searchQuery"
//             autoComplete="off"
//             autoFocus
//             placeholder="Search images and photos"
//           />
//         </SearchForm>
//       </Header>
//     </Formik>
//   );
// };
