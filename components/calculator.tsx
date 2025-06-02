"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [calculationMode, setCalculationMode] = useState("forward")
  const [result, setResult] = useState<{
    originalAmount: number
    fees: {
      takerMakerFee: number
      taxFee: number
      cfxFee: number
      totalFee: number
    }
    finalAmount: number
  } | null>(null)

  const calculateAmount = () => {
    if (!targetAmount || isNaN(Number.parseFloat(targetAmount)) || Number.parseFloat(targetAmount) <= 0) {
      return
    }

    const amount = Number.parseFloat(targetAmount)
    const fees = feeStructure[transactionType as "buy" | "sell"][cryptoType as "regular" | "usdt"]
    const takerMakerFee = userType === "taker" ? fees.taker : fees.maker

    let originalAmount: number
    let finalAmount: number
    let takerMakerFeeAmount: number
    let taxFeeAmount: number
    let cfxFeeAmount: number
    let totalFeeAmount: number

    if (calculationMode === "forward") {
      // Calculate final amount after fees
      originalAmount = amount
      takerMakerFeeAmount = originalAmount * takerMakerFee
      taxFeeAmount = originalAmount * fees.tax
      cfxFeeAmount = originalAmount * fees.cfx
      totalFeeAmount = takerMakerFeeAmount + taxFeeAmount + cfxFeeAmount

      if (transactionType === "buy") {
        finalAmount = originalAmount - totalFeeAmount
      } else {
        finalAmount = originalAmount - totalFeeAmount
      }
    } else {
      // Calculate original amount needed to get target amount after fees
      finalAmount = amount
      const totalFeeRate = takerMakerFee + fees.tax + fees.cfx

      if (transactionType === "buy") {
        originalAmount = finalAmount / (1 - totalFeeRate)
      } else {
        originalAmount = finalAmount / (1 - totalFeeRate)
      }

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
    })
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(num)
  }

  return (
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="transaction-type" className="text-gray-700 font-medium">
                  Jenis Transaksi
                </Label>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger
                    id="transaction-type"
                    className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                <Label htmlFor="crypto-type" className="text-gray-700 font-medium">
                  Tipe Kripto
                </Label>
                <Select value={cryptoType} onValueChange={setCryptoType}>
                  <SelectTrigger
                    id="crypto-type"
                    className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <SelectValue placeholder="Pilih tipe kripto" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="regular">⚡ Regular</SelectItem>
                    <SelectItem value="usdt">💰 USDT/Kripto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-700 font-medium">Tipe Pengguna</Label>
                <RadioGroup value={userType} onValueChange={setUserType} className="flex gap-6 mt-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="taker" id="taker" className="border-gray-400 text-blue-600" />
                    <Label htmlFor="taker" className="cursor-pointer text-gray-700">
                      🚀 Taker
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maker" id="maker" className="border-gray-400 text-purple-600" />
                    <Label htmlFor="maker" className="cursor-pointer text-gray-700">
                      🎯 Maker
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="amount" className="text-gray-700 font-medium">
                  {calculationMode === "forward" ? "Jumlah Awal" : "Jumlah Akhir yang Diinginkan"}
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Masukkan jumlah"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-lg"
                />
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
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">📊 Hasil Perhitungan</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-700">
                    Jumlah {calculationMode === "forward" ? "Awal" : "yang Dibutuhkan"}
                  </span>
                  <span className="font-bold text-lg text-gray-800">{formatNumber(result.originalAmount)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <span className="text-blue-700">Biaya {userType === "taker" ? "Taker" : "Maker"}</span>
                  <span className="text-blue-800 font-medium">-{formatNumber(result.fees.takerMakerFee)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                  <span className="text-purple-700">Pajak (PPN)</span>
                  <span className="text-purple-800 font-medium">-{formatNumber(result.fees.taxFee)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                  <span className="text-orange-700">CFX Fee</span>
                  <span className="text-orange-800 font-medium">-{formatNumber(result.fees.cfxFee)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                  <span className="text-red-700 font-medium">Total Biaya</span>
                  <span className="text-red-800 font-bold">-{formatNumber(result.fees.totalFee)}</span>
                </div>
                <div className="pt-2 border-t-2 border-gray-200 flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <span className="font-semibold text-gray-800">
                    Jumlah {calculationMode === "forward" ? "Akhir" : "yang Diinginkan"}
                  </span>
                  <span className="text-2xl font-bold text-green-600">✅ {formatNumber(result.finalAmount)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
