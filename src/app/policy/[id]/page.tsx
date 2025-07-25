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
  application_period?: string;
  application_method?: string;
  required_documents?: string;
  contact?: string;
}

const PolicyDetailSkeleton = () => (
  <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="h-12 bg-gray-100 rounded-md"></div>
      <div className="h-12 bg-gray-100 rounded-md"></div>
    </div>

    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>

    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>

    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>

    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>

    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>

    <div className="my-8 text-center">
      <div className="h-20 bg-gray-200 rounded"></div>
    </div>

    <div className="mt-8 pt-6 border-t">
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
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[var(--color-background)]">
        <PolicyDetailSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[var(--color-background)]">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">오류 발생!</h2>
          <p className="text-lg text-[var(--color-text-secondary)] mb-6">{error}</p>
          <Link href="/" className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary)]/[.9] transition-colors">
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  if (!policy) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[var(--color-background)]">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">정책을 찾을 수 없습니다.</h2>
          <p className="text-lg text-[var(--color-text-secondary)] mb-6">요청하신 정책 정보를 찾을 수 없습니다. URL을 확인하거나 목록으로 돌아가세요.</p>
          <Link href="/" className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary)]/[.9] transition-colors">
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-[var(--color-background)]">
      <div className="w-full max-w-4xl">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)]">{policy.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center bg-[var(--color-border)]/[.5] p-3 rounded-md">
              <span className="text-[var(--color-text-secondary)] mr-2">👥</span>
              <span className="font-semibold text-[var(--color-text-primary)]">대상:</span>
              <span className="ml-2 text-[var(--color-primary)]">{policy.target}</span>
            </div>
            <div className="flex items-center bg-[var(--color-border)]/[.5] p-3 rounded-md">
              <span className="text-[var(--color-text-secondary)] mr-2">📍</span>
              <span className="font-semibold text-[var(--color-text-primary)]">지역:</span>
              <span className="ml-2 text-[var(--color-secondary)]">{policy.region}</span>
            </div>
          </div>

          <div className="bg-[var(--color-background)] p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-3 text-[var(--color-text-primary)]">정책 설명</h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed text-lg">{policy.description}</p>
          </div>

          {policy.application_period && (
            <div className="bg-[var(--color-background)] p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-3 text-[var(--color-text-primary)]">신청 기간</h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed text-lg">{policy.application_period}</p>
            </div>
          )}

          {policy.application_method && (
            <div className="bg-[var(--color-background)] p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-3 text-[var(--color-text-primary)]">신청 방법</h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed text-lg">{policy.application_method}</p>
            </div>
          )}

          {policy.required_documents && (
            <div className="bg-[var(--color-background)] p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-3 text-[var(--color-text-primary)]">제출 서류</h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed text-lg">{policy.required_documents}</p>
            </div>
          )}

          {policy.contact && (
            <div className="bg-[var(--color-background)] p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-3 text-[var(--color-text-primary)]">문의처</h2>
              <p className="text-color-text-secondary leading-relaxed text-lg">{policy.contact}</p>
            </div>
          )}

          {/* Share Buttons */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
            <h3 className="text-lg font-bold mb-4 text-[var(--color-text-primary)]">이 정책 공유하기</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCopyLink}
                className="flex items-center px-4 py-2 bg-[var(--color-border)] text-[var(--color-text-primary)] rounded-md hover:bg-[var(--color-border)]/[.7] transition-colors"
              >
                🔗 링크 복사
              </button>
              {copySuccess && <span className="text-green-600 text-sm ml-2">{copySuccess}</span>}
              <button
                onClick={shareOnFacebook}
                className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary)]/[.9] transition-colors"
              >
                👍 페이스북
              </button>
              <button
                onClick={shareOnTwitter}
                className="flex items-center px-4 py-2 bg-[var(--color-secondary)] text-white rounded-md hover:bg-[var(--color-secondary)]/[.9] transition-colors"
              >
                🐦 트위터
              </button>
            </div>
          </div>

          {/* AdSense Ad Unit for detail page */}
          <div className="my-8 text-center">
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

          <div className="mt-8 pt-6 border-t">
            <Link href="/" className="text-[var(--color-primary)] hover:underline flex items-center">
              &larr; 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}