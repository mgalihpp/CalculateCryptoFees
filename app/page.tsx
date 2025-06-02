import { Calculator } from "@/components/calculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Kalkulator Transaksi Kripto
            </h1>
            <p className="text-gray-600 text-lg">
              Hitung jumlah koin yang dibutuhkan agar pas setelah pengenaan biaya dan pajak
            </p>
          </div>

          <Calculator />

          <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              Informasi Biaya Transaksi
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="px-4 py-4 text-left font-semibold">Jenis Transaksi</th>
                    <th className="px-4 py-4 text-right font-semibold">Biaya Taker</th>
                    <th className="px-4 py-4 text-right font-semibold">Biaya Maker</th>
                    <th className="px-4 py-4 text-right font-semibold">Pajak</th>
                    <th className="px-4 py-4 text-right font-semibold">CFX Fee</th>
                    <th className="px-4 py-4 text-right font-semibold">Total Fee Taker</th>
                    <th className="px-4 py-4 text-right font-semibold">Total Fee Maker</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-800">Beli</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.20%</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.10%</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.11%</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.0222%</td>
                    <td className="px-4 py-4 text-right font-semibold text-blue-600">0.3322%</td>
                    <td className="px-4 py-4 text-right font-semibold text-blue-600">0.2322%</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-800">Beli (USDT/Kripto)</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.15%</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.15%</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.21%</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.0444%</td>
                    <td className="px-4 py-4 text-right font-semibold text-purple-600">0.4044%</td>
                    <td className="px-4 py-4 text-right font-semibold text-purple-600">0.4044%</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-800">Jual</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.20%</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.10%</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.10%</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.0222%</td>
                    <td className="px-4 py-4 text-right font-semibold text-green-600">0.3222%</td>
                    <td className="px-4 py-4 text-right font-semibold text-green-600">0.2222%</td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-800">Jual (USDT/Kripto)</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.15%</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.15%</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.21%</td>
                    <td className="px-4 py-4 text-right text-gray-700">0.0444%</td>
                    <td className="px-4 py-4 text-right font-semibold text-orange-600">0.4044%</td>
                    <td className="px-4 py-4 text-right font-semibold text-orange-600">0.4044%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <footer className="mt-16 text-center">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-800">Tokocrypto</h3>
                    <p className="text-sm text-gray-600">Indonesia's Leading Crypto Exchange</p>
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Aman & Terpercaya</h4>
                    <p className="text-sm text-gray-600">Lisensi penuh PFAK dari Bappebti</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Trading Cepat</h4>
                    <p className="text-sm text-gray-600">Eksekusi order dalam hitungan detik</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">💰</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">Fee Kompetitif</h4>
                    <p className="text-sm text-gray-600">Biaya trading terendah di Indonesia</p>
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Mulai trading crypto sekarang di <span className="font-semibold text-blue-600">Tokocrypto</span>
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                    <span>📱 Download App</span>
                    <span>•</span>
                    <span>🌐 tokocrypto.com</span>
                    <span>•</span>
                    <span>📞 Customer Support 24/7</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 w-full">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Disclaimer:</strong> Kalkulator ini dibuat berdasarkan informasi biaya transaksi Tokocrypto
                    yang berlaku efektif 20 Februari 2025. Biaya dapat berubah sewaktu-waktu sesuai kebijakan
                    perusahaan. Selalu cek informasi terbaru di platform resmi Tokocrypto.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}
