import { useI18n } from '../../context/I18nContext';

export default function RTLWrapper({ children }) {
  const { isRTL } = useI18n();
  return <div dir={isRTL ? 'rtl' : 'ltr'}>{children}</div>;
}
