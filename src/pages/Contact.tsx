const Contact = () => {
  return (
    <div className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#E2E8CE] p-8 md:p-12">
      <h1 className="text-3xl md:text-4xl font-bold text-[#FF8C00] mb-4">
        İletişim
      </h1>
      <p className="text-gray-600 text-lg leading-relaxed mb-8">
        Bizimle iletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz.
        İstek, öneri ve şikayetlerinizi dinlemekten memnuniyet duyarız.
      </p>

      <div className="flex flex-col space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <a
            href="mailto:info@tekinticaret.com"
            className="flex items-center gap-4 group"
          >
            <div className="w-14 h-14 bg-[#FF8C00]/10 rounded-2xl flex items-center justify-center text-[#FF8C00] shadow-sm group-hover:bg-[#FF8C00] group-hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#FF8C00] transition-colors">
                E-posta
              </h3>
              <p className="text-gray-600 font-medium group-hover:text-gray-800 transition-colors">
                info@tekinticaret.com
              </p>
            </div>
          </a>

          <a href="tel:+905317839078" className="flex items-center gap-4 group">
            <div className="w-14 h-14 bg-[#FF8C00]/10 rounded-2xl flex items-center justify-center text-[#FF8C00] shadow-sm group-hover:bg-[#FF8C00] group-hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#FF8C00] transition-colors">
                Telefon
              </h3>
              <p className="text-gray-600 font-medium group-hover:text-gray-800 transition-colors">
                +90 531 783 90 78
              </p>
            </div>
          </a>

          <a
            href="https://maps.app.goo.gl/dwzbKgo8nj6D8FfX8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 group"
          >
            <div className="w-14 h-14 bg-[#FF8C00]/10 rounded-2xl flex items-center justify-center text-[#FF8C00] shadow-sm shrink-0 group-hover:bg-[#FF8C00] group-hover:text-white transition-colors mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#FF8C00] transition-colors">
                Adres
              </h3>
              <p className="text-gray-600 font-medium group-hover:text-gray-800 transition-colors">
                Kabakoz, 54500 Karasu / Sakarya
              </p>
            </div>
          </a>
        </div>

        <div className="w-full h-80 md:h-[450px] rounded-2xl overflow-hidden border-2 border-[#E2E8CE] shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1371.8671883897246!2d30.686529453075327!3d41.095795453765085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x409ddb2f64c82b09%3A0x62386ff92c662ed7!2sTekin%20Ticaret%20-%20Yem%20%C3%87e%C5%9Fitleri!5e0!3m2!1str!2str!4v1777235162667!5m2!1str!2str"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
