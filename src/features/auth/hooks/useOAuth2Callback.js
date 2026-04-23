import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from 'sonner';
import { useAuth } from "../../../context/AuthContext";
import { googleCallback } from "../services/authService";

export const useOAuth2Callback = ({code}) => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {        
        const fetchGoogleUser = async () => {
            try {
                const { user, token } = await googleCallback({ code });
                login(user, token);
                toast.success("Đăng nhập thành công!");
                navigate("/home");
            } catch (error) {
                toast.error(error.message || "Đăng nhập thất bại");
                navigate("/login");
            }
        }
        if (code) {
            fetchGoogleUser();
        }
    }, [params, code, navigate])
}