"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { AIVerificationStatus, type AIVerificationResult } from "@/components/ai/ai-verification-status"

interface BeneficiaryRow {
  id: string
  fullName: string
  nidNumber: string
  phone: string
  address: string
  needCategory: string
  amountRequested: number
  status: "pending" | "validating" | "valid" | "invalid"
  issues?: string[]
}

export function BulkBeneficiaryUpload() {
  const { toast } = useToast()
  const [uploadStage, setUploadStage] = useState<"upload" | "validating" | "review">("upload")
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryRow[]>([])
  const [aiVerification, setAiVerification] = useState<AIVerificationResult[]>([])

  const handleDownloadTemplate = () => {
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded successfully",
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadStage("validating")

    setAiVerification([
      { type: "nid", status: "processing", message: "Validating NID format and authenticity..." },
      { type: "fraud-detection", status: "pending", message: "Waiting to check for duplicates..." },
      { type: "fraud-detection", status: "pending", message: "Waiting for blacklist verification..." },
      { type: "document", status: "pending", message: "Waiting for cost analysis..." },
    ])

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setAiVerification([
      { type: "nid", status: "success", confidence: 98, message: "All NID numbers validated successfully" },
      { type: "fraud-detection", status: "processing", message: "Checking for duplicate entries..." },
      { type: "fraud-detection", status: "pending", message: "Waiting for blacklist verification..." },
      { type: "document", status: "pending", message: "Waiting for cost analysis..." },
    ])

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setAiVerification([
      { type: "nid", status: "success", confidence: 98, message: "All NID numbers validated successfully" },
      {
        type: "fraud-detection",
        status: "warning",
        confidence: 85,
        message: "2 potential duplicates detected",
        details: ["NID 1234567890123 appears twice", "Phone +88017XXXXXXXX used by 2 beneficiaries"],
      },
      { type: "fraud-detection", status: "processing", message: "Cross-checking blacklist database..." },
      { type: "document", status: "pending", message: "Waiting for cost analysis..." },
    ])

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setAiVerification([
      { type: "nid", status: "success", confidence: 98, message: "All NID numbers validated successfully" },
      {
        type: "fraud-detection",
        status: "warning",
        confidence: 85,
        message: "2 potential duplicates detected",
        details: ["NID 1234567890123 appears twice", "Phone +88017XXXXXXXX used by 2 beneficiaries"],
      },
      { type: "fraud-detection", status: "success", confidence: 100, message: "No blacklisted entries found" },
      {
        type: "document",
        status: "success",
        confidence: 94,
        message: "All cost estimates within acceptable range",
        timestamp: new Date().toISOString(),
      },
    ])

    const mockBeneficiaries: BeneficiaryRow[] = [
      {
        id: "1",
        fullName: "Amina Begum",
        nidNumber: "1234567890123",
        phone: "+88017XXXXXXXX",
        address: "Satkhira Sadar",
        needCategory: "shelter",
        amountRequested: 20000,
        status: "valid",
      },
      {
        id: "2",
        fullName: "Mohammad Karim",
        nidNumber: "9876543210987",
        phone: "+88018XXXXXXXX",
        address: "Sylhet Sadar",
        needCategory: "education",
        amountRequested: 5000,
        status: "valid",
      },
      {
        id: "3",
        fullName: "Fatima Khatun",
        nidNumber: "1234567890123",
        phone: "+88019XXXXXXXX",
        address: "Sylhet Sadar",
        needCategory: "food",
        amountRequested: 3000,
        status: "invalid",
        issues: ["Duplicate NID number"],
      },
    ]

    setBeneficiaries(mockBeneficiaries)
    setUploadStage("review")

    toast({
      title: "File Processed",
      description: `${mockBeneficiaries.length} beneficiaries loaded. Review the results.`,
    })
  }

  const handleSubmit = () => {
    toast({
      title: "Application Submitted",
      description: "Your beneficiary list has been submitted for matching",
    })
  }

  return (
    <div className="space-y-6">
      {uploadStage === "upload" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Bulk Beneficiary Upload</CardTitle>
              <CardDescription>Upload a CSV file with beneficiary information for AI validation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleDownloadTemplate} className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Download CSV Template
                </Button>
                <p className="text-sm text-muted-foreground">Start with our template to ensure correct format</p>
              </div>

              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-2">Upload your beneficiary list</p>
                <p className="text-xs text-muted-foreground mb-4">CSV or Excel file, max 1000 rows</p>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="bulk-upload"
                />
                <Button asChild>
                  <label htmlFor="bulk-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </label>
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  AI Validation Process
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• NID format and authenticity verification</li>
                  <li>• Duplicate detection across platform</li>
                  <li>• Blacklist cross-checking</li>
                  <li>• Cost outlier analysis</li>
                  <li>• GPS coordinate validation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {uploadStage === "validating" && aiVerification.length > 0 && <AIVerificationStatus results={aiVerification} />}

      {uploadStage === "review" && (
        <>
          {aiVerification.length > 0 && <AIVerificationStatus results={aiVerification} />}

          <Card>
            <CardHeader>
              <CardTitle>Review Beneficiaries</CardTitle>
              <CardDescription>
                {beneficiaries.filter((b) => b.status === "valid").length} valid,{" "}
                {beneficiaries.filter((b) => b.status === "invalid").length} need attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>NID</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Need</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beneficiaries.map((beneficiary) => (
                      <TableRow key={beneficiary.id}>
                        <TableCell className="font-medium">{beneficiary.fullName}</TableCell>
                        <TableCell>{beneficiary.nidNumber}</TableCell>
                        <TableCell>{beneficiary.phone}</TableCell>
                        <TableCell>{beneficiary.needCategory}</TableCell>
                        <TableCell>৳{beneficiary.amountRequested.toLocaleString()}</TableCell>
                        <TableCell>
                          {beneficiary.status === "valid" ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Valid
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Issues
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setUploadStage("upload")}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Submit Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
