'use client';
import {createContext, useContext} from 'react';

export const I18nContext = createContext<any | null>(null);

export const useI18n = () => {
  return useContext(I18nContext);
};
