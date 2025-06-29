'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Landing from './components/Landing';
import PostCards from './components/PostCards';
import TrendingTopics from './components/TrendingTopics';
import { useAuth } from '@/hook/useAuth';

export default function Page() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth === false) {
      router.push('/login');
    }
  }, [auth, router]);

  if (auth === null) return <p>Loading...</p>;
  if (auth === false) return null; // prevent flicker before redirect

  return (
    <>
      <Landing />
      <TrendingTopics />
      <PostCards />
    </>
  );
}
