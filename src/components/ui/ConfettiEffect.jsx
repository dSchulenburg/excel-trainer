import { useEffect } from 'react';
import { fireConfetti } from '../../utils/confetti';

export default function ConfettiEffect({ trigger }) {
  useEffect(() => {
    if (trigger) fireConfetti();
  }, [trigger]);
  return null;
}
