import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../../context/AuthContext';
import { updatePassword, updateProfile, getProfile } from '../../services/profileSerivce';

export const useProfileSetting = () => {
    const { updateUser } = useAuth();
    const [isEditingInformation, setIsEditingInformation] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isSavingInformation, setIsSavingInformation] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const [formDataInformation, setFormDataInformation] = useState({
        fullname: '',
        gender: null,
        dateOfBirth: '',
        email: ''
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setFormDataInformation({
                    fullname: data.fullname || '',
                    dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '', // Format date for input[type=date]
                    email: data.email || '',
                    bio: data.bio || '',
                });
                if (data.gender != null)
                    setFormDataInformation((prev) => ({
                        ...prev,
                        gender: data.gender == true ? 'Nam' : 'Nữ',
                    }));
            } catch (error) {
                toast.error('Không thể tải thông tin cá nhân');
            } finally {
                setIsFetching(false);
            }
        };
        fetchProfile();
    }, []);

    const [formDataPassword, setFormDataPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleEditing = () => {
        setIsEditingInformation(!isEditingInformation);
    };

    const toggleEditingPassword = () => {
        setIsEditingPassword(!isEditingPassword);
        // Reset password form when toggling
        setFormDataPassword({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDataInformation((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setFormDataPassword((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSavingInformation(true);
        try {
            const { email, ...dataToUpdate } = formDataInformation;
            await updateProfile(dataToUpdate);
            updateUser(dataToUpdate);
            toast.success('Cập nhật thông tin thành công!');
            setIsEditingInformation(false);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSavingInformation(false);
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        if (formDataPassword.newPassword !== formDataPassword.confirmPassword) {
            toast.error("Mật khẩu mới không khớp!");
            return;
        }
        setIsSavingPassword(true);
        try {
            await updatePassword(formDataPassword);
            toast.success('Cập nhật mật khẩu thành công!');
            setIsEditingPassword(false);
            setFormDataPassword({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSavingPassword(false);
        }
    };

    return {
        isEditingInformation,
        isEditingPassword,
        isFetching,
        isSavingInformation,
        isSavingPassword,
        toggleEditing,
        toggleEditingPassword,
        formDataInformation,
        formDataPassword,
        showCurrentPassword,
        setShowCurrentPassword,
        showNewPassword,
        setShowNewPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        handleChange,
        handlePasswordChange,
        handleSubmit,
        handleSubmitPassword,
    };
}