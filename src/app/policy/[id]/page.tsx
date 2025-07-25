'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import FeedbackForm from '@/components/FeedbackForm';

interface Policy {
  id: number;
  title: string;
  description: string;
  target: string;
  region: string;
  application_period?: string;
  application_method?: string;
  required_documents?: string;
  contact?: string;
}

const PolicyDetailSkeleton = () => (
  <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg animate-pulse">
    <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="h-12 bg-gray-100 rounded-lg"></div>
      <div className="h-12 bg-gray-100 rounded-lg"></div>
    </div>

    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>

    <div className="h-48 bg-gray-100 rounded-lg mb-6"></div> {/* Placeholder for AdSense */}

    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

export default function PolicyDetail() {
  const { id } = useParams();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState('');

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
        setError('정책 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.');
      } else {
        setPolicy(data || null);
      }
      setLoading(false);
    }

    fetchPolicy();
  }, [id]);

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopySuccess('링크가 복사되었습니다!');
      setTimeout(() => setCopySuccess(''), 2000);
    }).catch(err => {
      console.error('링크 복사 실패:', err);
      setCopySuccess('링크 복사에 실패했습니다.');
    });
  };

  const shareOnFacebook = () => {
    const currentUrl = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const currentUrl = window.location.href;
    const text = encodeURIComponent(`[${policy?.title}] 정부 정책 및 지원금 정보 확인하기: ${currentUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
        <PolicyDetailSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">오류 발생!</h2>
          <p className="text-lg text-gray-600 mb-6">{error}</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  if (!policy) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">정책을 찾을 수 없습니다.</h2>
          <p className="text-lg text-gray-600 mb-6">요청하신 정책 정보를 찾을 수 없습니다. URL을 확인하거나 목록으로 돌아가세요.</p>
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-4xl">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 leading-tight">{policy.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-500 mr-2">👥</span>
              <span className="font-semibold text-gray-800">대상:</span>
              <span className="ml-2 text-blue-600">{policy.target}</span>
            </div>
            <div className="flex items-center bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-500 mr-2">📍</span>
              <span className="font-semibold text-gray-800">지역:</span>
              <span className="ml-2 text-emerald-600">{policy.region}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-3 text-gray-900">정책 설명</h2>
            <p className="text-gray-700 leading-relaxed text-base">{policy.description}</p>
          </div>

          {policy.application_period && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-3 text-gray-900">신청 기간</h2>
              <p className="text-gray-700 leading-relaxed text-base">{policy.application_period}</p>
            </div>
          )}

          {policy.application_method && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-3 text-gray-900">신청 방법</h2>
              <p className="text-gray-700 leading-relaxed text-base">{policy.application_method}</p>
            </div>
          )}

          {policy.required_documents && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-3 text-gray-900">제출 서류</h2>
              <p className="text-gray-700 leading-relaxed text-base">{policy.required_documents}</p>
            </div>
          )}

          {policy.contact && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-3 text-gray-900">문의처</h2>
              <p className="text-gray-700 leading-relaxed text-base">{policy.contact}</p>
            </div>
          )}

          {/* Share Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-900">이 정책 공유하기</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCopyLink}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                🔗 링크 복사
              </button>
              {copySuccess && <span className="text-emerald-600 text-sm ml-2">{copySuccess}</span>}
              <button
                onClick={shareOnFacebook}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                👍 페이스북
              </button>
              <button
                onClick={shareOnTwitter}
                className="flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm"
              >
                🐦 트위터
              </button>
            </div>
          </div>

          {/* AdSense Ad Unit for detail page */}
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

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/" className="text-indigo-600 hover:underline flex items-center text-base">
              &larr; 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}