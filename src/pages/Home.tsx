const Home = () => {
  return (
    <div className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#E2E8CE] p-8 md:p-12">
      <h1 className="text-3xl md:text-4xl font-bold text-[#FF8C00] mb-4">
        Ana Sayfa
      </h1>
      <p className="text-gray-600 text-lg leading-relaxed">
        Tekin Ticaret Veresiye Defteri uygulamasına hoş geldiniz. Bu uygulama sayesinde müşteri borçlarınızı kolayca takip edebilir, hesaplarınızı güvenle yönetebilirsiniz.
      </p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-[#E2E8CE]/30 rounded-xl border border-[#E2E8CE] hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Hızlı İşlem</h2>
          <p className="text-gray-600">Yakında buraya hızlı işlem kısayolları eklenecek.</p>
        </div>
        <div className="p-6 bg-[#E2E8CE]/30 rounded-xl border border-[#E2E8CE] hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Özet Durum</h2>
          <p className="text-gray-600">Yakında buraya hesap özetiniz eklenecek.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
