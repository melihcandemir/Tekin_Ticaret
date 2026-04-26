const Contact = () => {
  return (
    <div className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#E2E8CE] p-8 md:p-12">
      <h1 className="text-3xl md:text-4xl font-bold text-[#FF8C00] mb-4">
        İletişim
      </h1>
      <p className="text-gray-600 text-lg leading-relaxed mb-8">
        Bizimle iletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz. İstek, öneri ve şikayetlerinizi dinlemekten memnuniyet duyarız.
      </p>
      
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#FF8C00]/10 rounded-2xl flex items-center justify-center text-[#FF8C00] shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">E-posta</h3>
            <p className="text-gray-600 font-medium">info@tekinticaret.com</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#FF8C00]/10 rounded-2xl flex items-center justify-center text-[#FF8C00] shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Telefon</h3>
            <p className="text-gray-600 font-medium">+90 555 123 45 67</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
