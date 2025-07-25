'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface FeedbackFormProps {
  policyId?: number; // Optional: if feedback is for a specific policy
}

export default function FeedbackForm({ policyId }: FeedbackFormProps) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!comment.trim()) {
      setMessage({ type: 'error', text: '피드백 내용을 입력해주세요.' });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('feedback')
      .insert({
        comment: comment,
        policy_id: policyId || null,
      });

    if (error) {
      console.error('Error submitting feedback:', error);
      setMessage({ type: 'error', text: '피드백 제출에 실패했습니다. 다시 시도해주세요.' });
    } else {
      setMessage({ type: 'success', text: '피드백이 성공적으로 제출되었습니다. 감사합니다!' });
      setComment('');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mt-8 border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-gray-900">피드백 남기기</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-gray-800 placeholder-gray-400"
          rows={4}
          placeholder="웹사이트나 이 정책에 대한 의견을 남겨주세요..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading}
        ></textarea>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          disabled={loading}
        >
          {loading ? '제출 중...' : '피드백 제출'}
        </button>
        {message && (
          <p className={`mt-4 text-sm ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}
