import { useContext } from 'react';
import { DemoDataContext } from './demo-data-context';

export const useDemoData = () => useContext(DemoDataContext);
