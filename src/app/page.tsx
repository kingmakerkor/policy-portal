'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Policy {
  id: number;
  title: string;
  description: string;
  target: string;
  region: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTarget, setSelectedTarget] = useState('all');
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPolicies() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('policies')
        .select('id, title, description, target, region');

      if (error) {
        console.error('Error fetching policies:', error);
        setError('정책 정보를 불러오는 데 실패했습니다.');
      } else {
        setPolicies(data || []);
      }
      setLoading(false);
    }

    fetchPolicies();
  }, []);

  const filteredPolicies = policies.filter(policy => {
    return (
      (policy.title.includes(searchTerm) || policy.description.includes(searchTerm)) &&
      (selectedRegion === 'all' || policy.region === selectedRegion) &&
      (selectedTarget === 'all' || policy.target === selectedTarget)
    );
  });

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
        <p className="text-lg text-red-500">오류: {error}</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            정부 정책 및 지원금 정보
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            나에게 맞는 지원금을 찾아보세요.
          </p>
        </div>

        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="키워드 검색... (예: 청년, 소상공인, 주택)"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="border border-gray-300 rounded-md p-2 w-full"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="all">모든 지역</option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
              <option value="인천">인천</option>
              <option value="전국">전국</option>
            </select>
            <select
              className="border border-gray-300 rounded-md p-2 w-full"
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
            >
              <option value="all">모든 대상</option>
              <option value="청년">청년</option>
              <option value="신혼부부">신혼부부</option>
              <option value="소상공인">소상공인</option>
              <option value="여성">여성</option>
              <option value="중장년">중장년</option>
              <option value="농어업인">농어업인</option>
              <option value="부모">부모</option>
            </select>
          </div>
        </div>

        {/* AdSense Ad Unit */}
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

        <div className="grid gap-6">
          {filteredPolicies.length > 0 ? (
            filteredPolicies.map((policy) => (
              <Link key={policy.id} href={`/policy/${policy.id}`}>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <h2 className="text-xl font-bold mb-2 text-gray-800">{policy.title}</h2>
                  <p className="text-gray-600 mb-4">{policy.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {policy.target}
                    </span>
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {policy.region}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}