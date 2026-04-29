import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostByIdAPI } from '../../../services/postService';
import PostCard from '../../../components/PostCard';
import { toast } from 'sonner';

const PostDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostByIdAPI(id);
        if (data) {
          setPost(data);
        } else {
          toast.error('Không tìm thấy bài viết');
          navigate('/home');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Lỗi khi tải bài viết');
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="w-full min-h-[calc(100vh-50px)] bg-[#faf7f7] flex justify-center pt-10">
        <div className="w-10 h-10 border-4 border-[#8d3f41] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="w-full min-h-[calc(100vh-50px)] bg-[#faf7f7]">
      <div className="max-w-[1300px] mx-auto px-4 pt-5 pb-10 flex justify-center">
        <div className="w-full max-w-[650px]">
          <button 
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-[#8d3f41] transition-colors font-medium"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Quay lại
          </button>
          <PostCard post={post} />
        </div>
      </div>
    </div>
  );
};

export default PostDetailView;
