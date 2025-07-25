'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

interface Policy {
  id: number;
  title: string;
  description: string;
  target: string;
  region: string;
}

export default function PolicyDetail() {
  const { id } = useParams();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPolicy() {
      setLoading(true);
      setError(null);
      if (!id) {
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
  }, [id]);

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
          <h1 className="text-3xl font-bold mb-6 text-gray-800">{policy.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center bg-gray-100 p-3 rounded-md">
              <span className="text-gray-600 mr-2">👥</span>
              <span className="font-semibold text-gray-700">대상:</span>
              <span className="ml-2 text-blue-700">{policy.target}</span>
            </div>
            <div className="flex items-center bg-gray-100 p-3 rounded-md">
              <span className="text-gray-600 mr-2">📍</span>
              <span className="font-semibold text-gray-700">지역:</span>
              <span className="ml-2 text-green-700">{policy.region}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-3 text-gray-800">정책 설명</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{policy.description}</p>
          </div>

          {/* AdSense Ad Unit for detail page */}
          <div className="my-8 text-center">
            <ins className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-1542451375735648"
              data-ad-slot="5568997361">
            </ins>
            <script>
              (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          </div>

          <div className="mt-8 pt-6 border-t">
            <Link href="/" className="text-blue-600 hover:underline flex items-center">
              &larr; 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
