'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation'; // Import useParams

interface Policy {
  id: number;
  title: string;
  description: string;
  target: string;
  region: string;
}

export default function PolicyDetail() { // Remove params from here
  const { id } = useParams(); // Get id using useParams
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPolicy() {
      setLoading(true);
      setError(null);
      if (!id) { // Handle case where id might be undefined initially
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('id', parseInt(id as string))
        .single();

      if (error) {
        console.error('Error fetching policy:', error);
        setError('정책 정보를 불러오는 데 실패했습니다.');
      } else {
        setPolicy(data || null);
      }
      setLoading(false);
    }

    fetchPolicy();
  }, [id]); // Depend on id

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
        <p className="text-lg text-gray-700">정책 정보를 불러오는 중입니다...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">오류: {error}</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  if (!policy) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">정책을 찾을 수 없습니다.</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-4xl">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{policy.title}</h1>
          <div className="flex gap-2 mb-6 flex-wrap">
            <span className="inline-block bg-blue-100 text-blue-800 text-lg font-semibold px-3 py-1 rounded-full">
              {policy.target}
            </span>
            <span className="inline-block bg-green-100 text-green-800 text-lg font-semibold px-3 py-1 rounded-full">
              {policy.region}
            </span>
          </div>
          <div className="prose max-w-none text-gray-700">
            <p className="text-xl">{policy.description}</p>
          </div>
          <div className="mt-8 pt-6 border-t">
            <Link href="/" className="text-blue-600 hover:underline">
              &larr; 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}