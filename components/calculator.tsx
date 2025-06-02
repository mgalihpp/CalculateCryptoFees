"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

// Fee structure based on the provided information
const feeStructure = {
  buy: {
    regular: {
      taker: 0.002, // 0.20%
      maker: 0.001, // 0.10%
      tax: 0.0011, // 0.11%
      cfx: 0.000222, // 0.0222%
    },
    usdt: {
      taker: 0.0015, // 0.15%
      maker: 0.0015, // 0.15%
      tax: 0.0021, // 0.21%
      cfx: 0.000444, // 0.0444%
    },
  },
  sell: {
    regular: {
      taker: 0.002, // 0.20%
      maker: 0.001, // 0.10%
      tax: 0.001, // 0.10%
      cfx: 0.000222, // 0.0222%
    },
    usdt: {
      taker: 0.0015, // 0.15%
      maker: 0.0015, // 0.15%
      tax: 0.0021, // 0.21%
      cfx: 0.000444, // 0.0444%
    },
  },
}

export function Calculator() {
  const [transactionType, setTransactionType] = useState("buy")
  const [cryptoType, setCryptoType] = useState("regular")
  const [userType, setUserType] = useState("taker")
  const [targetAmount, setTargetAmount] = useState("")
  const [coinPrice, setCoinPrice] = useState("")
  const [calculationMode, setCalculationMode] = useState("forward")
  const [wholeNumberMode, setWholeNumberMode] = useState(false)
  const [result, setResult] = useState<{
    originalAmount: number
    fees: {
      takerMakerFee: number
      taxFee: number
      cfxFee: number
      totalFee: number
    }
    finalAmount: number
    coinPrice: number
    originalValue: number
    finalValue: number
    totalFeeValue: number
    adjustedAmount?: number
  } | null>(null)

  const calculateAmount = () => {
    if (!targetAmount || isNaN(Number.parseFloat(targetAmount)) || Number.parseFloat(targetAmount) <= 0) {
      return
    }

    const amount = Number.parseFloat(targetAmount)
    const price = Number.parseFloat(coinPrice) || 1 // Default to 1 if no price entered
    const fees = feeStructure[transactionType as "buy" | "sell"][cryptoType as "regular" | "usdt"]
    const takerMakerFee = userType === "taker" ? fees.taker : fees.maker
    const totalFeeRate = takerMakerFee + fees.tax + fees.cfx

    let originalAmount: number
    let finalAmount: number
    let takerMakerFeeAmount: number
    let taxFeeAmount: number
    let cfxFeeAmount: number
    let totalFeeAmount: number
    let adjustedAmount: number | undefined = undefined

    if (calculationMode === "forward") {
      // Calculate final amount after fees
      originalAmount = amount

      if (wholeNumberMode) {
        // Calculate what original amount is needed to get a whole number after fees
        const desiredFinalAmount = Math.ceil(amount * (1 - totalFeeRate)) // Round up to nearest whole number
        adjustedAmount = desiredFinalAmount / (1 - totalFeeRate)
        originalAmount = adjustedAmount
      }

      takerMakerFeeAmount = originalAmount * takerMakerFee
      taxFeeAmount = originalAmount * fees.tax
      cfxFeeAmount = originalAmount * fees.cfx
      totalFeeAmount = takerMakerFeeAmount + taxFeeAmount + cfxFeeAmount

      finalAmount = originalAmount - totalFeeAmount

      if (wholeNumberMode) {
        finalAmount = Math.floor(finalAmount) // Ensure it's a whole number
      }
    } else {
      // Calculate original amount needed to get target amount after fees
      finalAmount = amount

      if (wholeNumberMode) {
        // Ensure the target amount is a whole number
        finalAmount = Math.floor(finalAmount)
      }

      originalAmount = finalAmount / (1 - totalFeeRate)

      takerMakerFeeAmount = originalAmount * takerMakerFee
      taxFeeAmount = originalAmount * fees.tax
      cfxFeeAmount = originalAmount * fees.cfx
      totalFeeAmount = takerMakerFeeAmount + taxFeeAmount + cfxFeeAmount
    }

    setResult({
      originalAmount,
      fees: {
        takerMakerFee: takerMakerFeeAmount,
        taxFee: taxFeeAmount,
        cfxFee: cfxFeeAmount,
        totalFee: totalFeeAmount,
      },
      finalAmount,
      coinPrice: price,
      originalValue: originalAmount * price,
      finalValue: finalAmount * price,
      totalFeeValue: totalFeeAmount * price,
      adjustedAmount,
    })
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(num)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  return (
    <TooltipProvider>
      <Card className="bg-white shadow-xl border-0 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-2xl">Kalkulator Transaksi</CardTitle>
          <CardDescription className="text-blue-100">
            Hitung jumlah koin yang dibutuhkan atau yang akan diterima setelah biaya
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="forward" onValueChange={setCalculationMode} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="forward"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md transition-all"
              >
                Hitung Jumlah Akhir
              </TabsTrigger>
              <TabsTrigger
                value="reverse"
                className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-md transition-all"
              >
                Hitung Jumlah Awal
              </TabsTrigger>
            </TabsList>
            <TabsContent value="forward" className="mt-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-blue-700">
                  💡 Masukkan jumlah koin awal untuk menghitung jumlah yang akan diterima setelah biaya
                </p>
              </div>
            </TabsContent>
            <TabsContent value="reverse" className="mt-4">
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <p className="text-sm text-purple-700">
                  💡 Masukkan jumlah koin yang ingin diterima untuk menghitung jumlah yang perlu dikeluarkan
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-6">
            {/* Transaction Settings */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pengaturan Transaksi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="transaction-type" className="text-gray-700 font-medium">
                      Jenis Transaksi
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-xs">
                          <p className="font-semibold mb-1">Jenis Transaksi:</p>
                          <p>
                            <strong>Beli:</strong> Membeli cryptocurrency dengan IDR atau USDT
                          </p>
                          <p>
                            <strong>Jual:</strong> Menjual cryptocurrency untuk mendapatkan IDR atau USDT
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select value={transactionType} onValueChange={setTransactionType}>
                    <SelectTrigger
                      id="transaction-type"
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <SelectValue placeholder="Pilih jenis transaksi" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="buy">🟢 Beli</SelectItem>
                      <SelectItem value="sell">🔴 Jual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="crypto-type" className="text-gray-700 font-medium">
                      Tipe Kripto
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-xs">
                          <p className="font-semibold mb-1">Tipe Kripto:</p>
                          <p>
                            <strong>Regular:</strong> Trading crypto dengan IDR (Rupiah)
                          </p>
                          <p>
                            <strong>USDT/Kripto:</strong> Trading crypto dengan USDT atau cryptocurrency lain
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select value={cryptoType} onValueChange={setCryptoType}>
                    <SelectTrigger
                      id="crypto-type"
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <SelectValue placeholder="Pilih tipe kripto" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="regular">⚡ Regular (IDR)</SelectItem>
                      <SelectItem value="usdt">💰 USDT/Kripto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* User Type */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Label className="text-gray-700 font-medium">Tipe Pengguna</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      <p className="font-semibold mb-1">Tipe Pengguna:</p>
                      <p>
                        <strong>Taker:</strong> Order yang langsung dieksekusi (market order). Fee lebih tinggi.
                      </p>
                      <p>
                        <strong>Maker:</strong> Order yang menambah likuiditas (limit order). Fee lebih rendah.
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <RadioGroup value={userType} onValueChange={setUserType} className="flex gap-8">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="taker" id="taker" className="border-gray-400 text-blue-600" />
                  <Label htmlFor="taker" className="cursor-pointer text-gray-700">
                    🚀 Taker (Market Order)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maker" id="maker" className="border-gray-400 text-purple-600" />
                  <Label htmlFor="maker" className="cursor-pointer text-gray-700">
                    🎯 Maker (Limit Order)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Amount and Price Inputs */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Input Perhitungan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="amount" className="text-gray-700 font-medium">
                      {calculationMode === "forward" ? "Jumlah Awal (Koin)" : "Jumlah Akhir yang Diinginkan (Koin)"}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-xs">
                          <p className="font-semibold mb-1">Jumlah Koin:</p>
                          {calculationMode === "forward" ? (
                            <p>Masukkan jumlah koin yang akan Anda transaksikan sebelum dipotong fee</p>
                          ) : (
                            <p>Masukkan jumlah koin yang ingin Anda terima setelah dipotong fee</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Contoh: 1.5"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-lg"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="coin-price" className="text-gray-700 font-medium">
                      Harga Koin {cryptoType === "regular" ? "(IDR)" : "(USDT)"}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-xs">
                          <p className="font-semibold mb-1">Harga Koin:</p>
                          <p>Masukkan harga saat ini dari cryptocurrency yang akan ditransaksikan.</p>
                          {cryptoType === "regular" ? (
                            <p>Contoh: Bitcoin = 1,500,000,000 (IDR)</p>
                          ) : (
                            <p>Contoh: Bitcoin = 100,000 (USDT)</p>
                          )}
                          <p className="text-xs mt-1 text-gray-500">
                            Opsional: Kosongkan jika hanya ingin menghitung jumlah koin
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="coin-price"
                    type="number"
                    placeholder={cryptoType === "regular" ? "Contoh: 1500000000" : "Contoh: 100000"}
                    value={coinPrice}
                    onChange={(e) => setCoinPrice(e.target.value)}
                    className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-lg"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <Checkbox
                  id="whole-number"
                  checked={wholeNumberMode}
                  onCheckedChange={(checked) => setWholeNumberMode(checked === true)}
                  className="border-gray-400 text-blue-600"
                />
                <div className="flex items-center gap-2">
                  <Label htmlFor="whole-number" className="cursor-pointer text-gray-700">
                    Hitung untuk mendapatkan bilangan bulat
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs">
                        <p className="font-semibold mb-1">Mode Bilangan Bulat:</p>
                        <p>
                          Aktifkan opsi ini untuk menghitung jumlah yang tepat agar hasil akhir menjadi bilangan bulat
                          (tanpa desimal).
                        </p>
                        <p className="mt-1">
                          Berguna untuk koin yang tidak mendukung pecahan atau untuk memudahkan perhitungan.
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            <Button
              onClick={calculateAmount}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              ✨ Hitung Sekarang
            </Button>

            {result && (
              <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  📊 Hasil Perhitungan
                </h3>

                {wholeNumberMode && result.adjustedAmount && calculationMode === "forward" && (
                  <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                    <p className="text-yellow-800">
                      <span className="font-semibold">💡 Penyesuaian:</span> Untuk mendapatkan bilangan bulat, jumlah
                      awal disesuaikan dari {formatNumber(Number(targetAmount))} menjadi{" "}
                      {formatNumber(result.adjustedAmount)} koin.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-gray-700">
                      Jumlah {calculationMode === "forward" ? "Awal" : "yang Dibutuhkan"}
                    </span>
                    <span className="font-bold text-lg text-gray-800">{formatNumber(result.originalAmount)} koin</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                    <span className="text-blue-700">Biaya {userType === "taker" ? "Taker" : "Maker"}</span>
                    <span className="text-blue-800 font-medium">-{formatNumber(result.fees.takerMakerFee)} koin</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                    <span className="text-purple-700">Pajak (PPN)</span>
                    <span className="text-purple-800 font-medium">-{formatNumber(result.fees.taxFee)} koin</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                    <span className="text-orange-700">CFX Fee</span>
                    <span className="text-orange-800 font-medium">-{formatNumber(result.fees.cfxFee)} koin</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                    <span className="text-red-700 font-medium">Total Biaya</span>
                    <span className="text-red-800 font-bold">-{formatNumber(result.fees.totalFee)} koin</span>
                  </div>
                  <div className="pt-2 border-t-2 border-gray-200 flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <span className="font-semibold text-gray-800">
                      Jumlah {calculationMode === "forward" ? "Akhir" : "yang Diinginkan"}
                    </span>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-green-600">
                        ✅ {formatNumber(result.finalAmount)} koin
                      </span>
                      {wholeNumberMode && (
                        <span className="text-xs text-green-700 mt-1">
                          {Number.isInteger(result.finalAmount) ? "Bilangan Bulat ✓" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  {result.coinPrice > 1 && (
                    <>
                      <div className="w-full h-px bg-gray-200 my-4"></div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        💰 Nilai dalam {cryptoType === "regular" ? "IDR" : "USDT"}
                      </h4>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <span className="text-gray-700">Harga per Koin</span>
                        <span className="font-medium text-gray-800">
                          {cryptoType === "regular"
                            ? formatCurrency(result.coinPrice)
                            : `${formatNumber(result.coinPrice)} USDT`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-700">
                          Nilai {calculationMode === "forward" ? "Awal" : "yang Dibutuhkan"}
                        </span>
                        <span className="font-bold text-blue-800">
                          {cryptoType === "regular"
                            ? formatCurrency(result.originalValue)
                            : `${formatNumber(result.originalValue)} USDT`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                        <span className="text-red-700 font-medium">Nilai Total Biaya</span>
                        <span className="text-red-800 font-bold">
                          {cryptoType === "regular"
                            ? formatCurrency(result.totalFeeValue)
                            : `${formatNumber(result.totalFeeValue)} USDT`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                        <span className="font-semibold text-gray-800">
                          Nilai {calculationMode === "forward" ? "Akhir" : "yang Diinginkan"}
                        </span>
                        <span className="text-xl font-bold text-green-600">
                          {cryptoType === "regular"
                            ? formatCurrency(result.finalValue)
                            : `${formatNumber(result.finalValue)} USDT`}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
