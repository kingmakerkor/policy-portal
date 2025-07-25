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

const PolicySkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-md animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
    <div className="flex gap-2">
      <div className="h-5 bg-gray-200 rounded-full w-16"></div>
      <div className="h-5 bg-gray-200 rounded-full w-16"></div>
    </div>
  </div>
);

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTarget, setSelectedTarget] = useState('all');
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoritePolicies, setFavoritePolicies] = useState<number[] | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem('favoritePolicies');
      if (storedFavorites) {
        setFavoritePolicies(JSON.parse(storedFavorites));
      } else {
        setFavoritePolicies([]);
      }
    }
  }, []);

  useEffect(() => {
    if (favoritePolicies !== null) {
      localStorage.setItem('favoritePolicies', JSON.stringify(favoritePolicies));
    }
  }, [favoritePolicies]);

  const fetchPolicies = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('policies')
      .select('id, title, description, target, region');

    if (error) {
      console.error('Error fetching policies:', error);
      setError('정책 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.');
    } else {
      setPolicies(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const toggleFavorite = (policyId: number) => {
    setFavoritePolicies(prevFavorites => {
      const currentFavorites = prevFavorites || [];
      if (currentFavorites.includes(policyId)) {
        return currentFavorites.filter(id => id !== policyId);
      } else {
        return [...currentFavorites, policyId];
      }
    });
  };

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">오류 발생!</h2>
          <p className="text-lg text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchPolicies}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block text-blue-600">정부 정책 및</span>
            <span className="block mt-2">지원금 정보</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            나에게 맞는 지원금을 쉽고 빠르게 찾아보세요. 복잡한 절차 없이 필요한 정보를 한눈에!
          </p>
        </div>

        <div className="mb-12 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="키워드 검색... (예: 청년, 소상공인, 주택)"
              className="flex-grow px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="border border-gray-300 rounded-lg p-3 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="my-10 text-center">
          <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-1542451375735648"
            data-ad-slot="5568997361"
            data-ad-format="auto"
            data-full-width-responsive="true">
          </ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => <PolicySkeleton key={index} />)
          ) : filteredPolicies.length > 0 ? (
            filteredPolicies.map((policy) => (
              <div key={policy.id} className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <Link href={`/policy/${policy.id}`} className="block">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900 leading-tight">{policy.title}</h2>
                  <p className="text-gray-600 text-base mb-4 line-clamp-3">{policy.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      {policy.target}
                    </span>
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                      {policy.region}
                    </span>
                  </div>
                </Link>
                {favoritePolicies !== null && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleFavorite(policy.id);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-400 hover:text-yellow-500"
                    aria-label="즐겨찾기 추가/제거"
                  >
                    <svg
                      className={`w-6 h-6 ${favoritePolicies.includes(policy.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 3.817 1.48-8.279L.001 9.306l8.332-1.151L12 .587z" />
                    </svg>
                  </button>
                )}
              </div>
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
