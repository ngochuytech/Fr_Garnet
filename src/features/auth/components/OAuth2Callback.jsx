import { useOAuth2Callback } from '../hooks/useOAuth2Callback';
import { useSearchParams } from "react-router-dom";
const OAuth2Callback = () => {
    const [params] = useSearchParams();

    const code = params.get('code');
    useOAuth2Callback({ code });
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-sm text-gray-500">Đang xử lý đăng nhập Google...</p>
        </div>
    );
}

export default OAuth2Callback;