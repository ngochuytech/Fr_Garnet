const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7edee] to-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Animated 404 text */}
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#b04f51] to-[#6a2f30] tracking-tighter drop-shadow-sm select-none">
            404
          </h1>
          <div className="absolute -inset-1 bg-[#8d3f41] opacity-10 blur-xl rounded-full" />
        </div>
        
        {/* Decorative element */}
        <div className="w-24 h-1.5 bg-gradient-to-r from-[#d09596] to-[#8d3f41] rounded-full my-8 opacity-90 shadow-sm" />

        <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">
          Ôi không! Không tìm thấy trang.
        </h2>
        
        <p className="text-gray-500 mb-10 leading-relaxed text-[17px]">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không thể truy cập.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
