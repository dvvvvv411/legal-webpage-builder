import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    window.location.href = 'https://anwalt.de';
  }, []);

  return null;
};

export default Index;