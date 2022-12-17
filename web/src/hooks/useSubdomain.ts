import { useContext } from 'react';
import { SubdomainContext } from '../contexts/SubdomainContext';

const useSubdomain = () => useContext(SubdomainContext);

export default useSubdomain;
