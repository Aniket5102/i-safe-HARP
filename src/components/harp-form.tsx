"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, ChevronLeft, FileDown, Loader2, Printer, Download, X, Upload } from "lucide-react";
import { format } from "date-fns";
import QRCode from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  harpId: z.string().max(100).optional(),
  date: z.date({ required_error: "A date is required." }),
  location: z.string().min(1, "Location is required.").max(100),
  department: z.string().min(1, "Department is required.").max(100),
  block: z.string().min(1, "Block is required.").max(100),
  floor: z.string().min(1, "Floor is required.").max(100),
  activity: z.string().min(1, "Activity is required.").max(100),
  carriedOutBy: z.string().min(1, "Carried Out By is required.").max(100),
  employeeType: z.string().min(1, "Employee Type is required.").max(100),
  employeeName: z.string().min(1, "Employee Name is required.").max(100),
  employeeId: z.string().min(1, "Employee ID is required.").max(100),
  designation: z.string().min(1, "Designation is required.").max(100),
  employeeDepartment: z.string().min(1, "Employee Department is required.").max(100),
  hazard: z.string().min(1, "Hazard is required.").max(100),
  accident: z.string().min(1, "Accident is required.").max(100),
  risk: z.string().min(1, "Risk is required.").max(100),
  prevention: z.string().min(1, "Prevention is required.").max(500),
  otherObservation: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const locations = ["Patancheru", "Khandala", "Rohtak", "Vizag", "Mysuru", "Kasna", "Ankleshwar", "Sripi"];
const departments = ["Production Department", "Quality Department", "Admin Department"];
const blocks = ["RH House", "EH House", "SPB", "WPB"];
const floors = ["RH Reactor Floor", "EH Reactor Floor", "SPB Floor", "WPB Floor"];
const people = ["Sai", "Manmohan", "Ashish", "Tanmay", "Aniket", "Sahriyash"];
const employeeTypes = ["APL Employee", "APG", "PPGAP", "APPPG"];
const employeeIds = ["P00126717", "P00126718"];
const designations = ["EXECUTIVE I - PRODUCTION", "EXECUTIVE I - QUALITY", "Sr. EXECUTIVE I - PRODUCTION", "Sr. EXECUTIVE I - QUALITY", "EXECUTIVE II - PRODUCTION"];
const employeeDepartments = ["PRODUCTION", "QUALITY"];
const hazards = ["Chemical Hazards", "Chemical Splash", "eyes", "face", "body"];
const risks = ["Medium", "high", "low"];

export default function HarpForm() {
  const { toast } = useToast();
  const formRef = React.useRef<HTMLDivElement>(null);
  const qrCodeRef = React.useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [qrCodeValue, setQrCodeValue] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        harpId: "",
        activity: "",
        accident: "Exposure to chemical while charging",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    console.log(values);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    toast({
      title: "Success!",
      description: "HARP data has been saved.",
    });
  }

  const handleGenerateQrCode = () => {
    const values = form.getValues();
    const allValues = Object.fromEntries(Object.entries(values).filter(([key, value]) => value !== ''));
    setQrCodeValue(JSON.stringify(allValues));
  };

  const handlePrintQrCode = () => {
    window.print();
  };

  const handleDownloadQrCode = async () => {
    const qrElement = qrCodeRef.current;
    if (!qrElement) return;

    try {
      const canvas = await html2canvas(qrElement, { scale: 2, backgroundColor: null });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `harp-qr-code-${form.getValues("harpId") || 'export'}.png`;
      link.click();
      toast({ title: "Success", description: "QR Code download has started." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "QR Code Download Error",
        description: "An error occurred while generating the QR Code image.",
      });
    }
  };


  const handleExportPdf = async () => {
    const formElement = formRef.current;
    if (!formElement) return;

    try {
      const canvas = await html2canvas(formElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`harp-insight-${form.getValues("harpId") || 'export'}.pdf`);
      toast({ title: "Success", description: "PDF export has started." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "PDF Export Error",
        description: "An error occurred while generating the PDF.",
      });
    }
  };
  
  return (
    <>
      <Card ref={formRef} className="w-full shadow-2xl" id="harp-form-card">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">HARP Details</CardTitle>
            <CardDescription>
              Fill in the form to record a new HARP entry.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <ChevronLeft />
              Back
            </Button>
            <Button variant="outline" onClick={handleGenerateQrCode}>
              <Printer />
              Print QR Code
            </Button>
            <Button variant="outline" onClick={handleExportPdf}>
              <FileDown />
              Export as PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="general-details">
                  <AccordionTrigger className="text-lg font-semibold">General Details</AccordionTrigger>
                  <AccordionContent className="pt-4 flex justify-center">
                    <div className="space-y-4 w-full max-w-sm">
                       <FormField
                        control={form.control}
                        name="harpId"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel className="text-right col-span-1">HARP ID #</FormLabel>
                            <FormControl className="col-span-2">
                              <Input placeholder="Generated on incident creation" {...field} />
                            </FormControl>
                             <div className="col-start-2 col-span-2">
                                <FormMessage />
                             </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel className="text-right col-span-1">Date<span className="text-red-500">*</span></FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl className="col-span-2">
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                             <div className="col-start-2 col-span-2">
                                <FormMessage />
                             </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel className="text-right col-span-1">Location<span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className="col-span-2">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a location" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                                </SelectContent>
                            </Select>
                             <div className="col-start-2 col-span-2">
                                <FormMessage />
                             </div>
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-start gap-4">
                            <FormLabel className="text-right col-span-1 pt-2">Department<span className="text-red-500">*</span></FormLabel>
                            <div className="col-span-2">
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {departments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormDescription className="mt-1">
                                    Select the Department specifically from the list.
                                </FormDescription>
                                <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="block"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-start gap-4">
                            <FormLabel className="text-right col-span-1 pt-2">Block<span className="text-red-500">*</span></FormLabel>
                            <div className="col-span-2">
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a block" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {blocks.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormDescription className="mt-1">
                                    Select the Block specifically from the list.
                                </FormDescription>
                                <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="floor"
                        render={({ field }) => (
                           <FormItem className="grid grid-cols-3 items-start gap-4">
                            <FormLabel className="text-right col-span-1 pt-2">Floor<span className="text-red-500">*</span></FormLabel>
                            <div className="col-span-2">
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a floor" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {floors.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormDescription className="mt-1">
                                   Select the Block specifically from the list.
                                </FormDescription>
                                <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="activity"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel className="text-right col-span-1">Activity<span className="text-red-500">*</span></FormLabel>
                            <FormControl className="col-span-2">
                              <Input placeholder="Enter activity" {...field} />
                            </FormControl>
                             <div className="col-start-2 col-span-2">
                                <FormMessage />
                             </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="carriedOutBy"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel className="text-right col-span-1">Carried Out By<span className="text-red-500">*</span></FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className="col-span-2">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a person" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {people.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                             <div className="col-start-2 col-span-2">
                                <FormMessage />
                             </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeType"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel className="text-right col-span-1">Employee Type<span className="text-red-500">*</span></FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className="col-span-2">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select employee type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {employeeTypes.map(et => <SelectItem key={et} value={et}>{et}</SelectItem>)}
                                </SelectContent>
                            </Select>
                             <div className="col-start-2 col-span-2">
                                <FormMessage />
                             </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeName"
                        render={({ field }) => (
                           <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel className="text-right col-span-1">Employee Name<span className="text-red-500">*</span></FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className="col-span-2">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an employee" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {people.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                             <div className="col-start-2 col-span-2">
                                <FormMessage />
                             </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel className="text-right col-span-1">Employee ID<span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className="col-span-2">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an Employee ID" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {employeeIds.map(id => <SelectItem key={id} value={id}>{id}</SelectItem>)}
                                </SelectContent>
                            </Select>
                             <div className="col-start-2 col-span-2">
                                <FormMessage />
                             </div>
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel className="text-right col-span-1">Designation<span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className="col-span-2">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a designation" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {designations.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                             <div className="col-start-2 col-span-2">
                                <FormMessage />
                             </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeDepartment"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel className="text-right col-span-1">Employee Department<span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className="col-span-2">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a department" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {employeeDepartments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                             <div className="col-start-2 col-span-2">
                                <FormMessage />
                             </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="harp-details">
                  <AccordionTrigger className="text-lg font-semibold">HARP Details</AccordionTrigger>
                   <AccordionContent className="pt-4 flex justify-center">
                    <div className="space-y-4 w-full max-w-sm">
                      <FormField
                        control={form.control}
                        name="hazard"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel className="text-right col-span-1">Hazard<span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl className="col-span-2">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a hazard" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {hazards.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <div className="col-start-2 col-span-2">
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="accident"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel className="text-right col-span-1">Accident<span className="text-red-500">*</span></FormLabel>
                            <FormControl className="col-span-2">
                              <Input placeholder="Enter accident details" {...field} />
                            </FormControl>
                            <div className="col-start-2 col-span-2">
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="risk"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel className="text-right col-span-1">Risk<span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl className="col-span-2">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a risk level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {risks.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <div className="col-start-2 col-span-2">
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="prevention"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-start gap-4">
                            <FormLabel className="text-right col-span-1 pt-2">Prevention<span className="text-red-500">*</span></FormLabel>
                            <FormControl className="col-span-2">
                              <Textarea placeholder="Describe prevention measures" {...field} />
                            </FormControl>
                            <div className="col-start-2 col-span-2">
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="other-details">
                  <AccordionTrigger className="text-lg font-semibold">Other Details</AccordionTrigger>
                  <AccordionContent className="pt-4 flex justify-center">
                     <div className="space-y-4 w-full max-w-sm">
                      <FormField
                        control={form.control}
                        name="otherObservation"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-3 items-start gap-4">
                            <FormLabel className="text-right col-span-1 pt-2">Other Observation/Support Required</FormLabel>
                            <FormControl className="col-span-2">
                              <Textarea placeholder="Enter your observations" {...field} />
                            </FormControl>
                            <div className="col-start-2 col-span-2">
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormItem className="grid grid-cols-3 items-start gap-4">
                        <FormLabel className="text-right col-span-1 pt-2">Upload Attachment(s) If Any</FormLabel>
                        <div className="col-span-2">
                          <FormControl>
                            <Input type="file" />
                          </FormControl>
                          <FormDescription className="mt-1">
                            Select/Drag and Drop Attachment.
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-4">
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Printer />}
            Raise HARP Incident
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={!!qrCodeValue} onOpenChange={(open) => !open && setQrCodeValue(null)}>
        <DialogContent className="sm:max-w-md p-0">
          <div className="bg-[#002f5f] text-white py-2 px-4 flex items-center justify-end gap-4">
            <Button variant="ghost" className="hover:bg-transparent hover:text-white" onClick={handlePrintQrCode}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="ghost" className="hover:bg-transparent hover:text-white" onClick={handleDownloadQrCode}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" className="hover:bg-transparent hover:text-white">
                <X className="mr-2 h-4 w-4" /> Close
              </Button>
            </DialogClose>
          </div>
          <div className="p-4" ref={qrCodeRef}>
            <div className="flex items-center justify-center space-x-4 mb-4">
                <Image src="/asian-paints-logo.svg" alt="Asian Paints Logo" width={120} height={20} />
                <Image src="/l-safe-logo.svg" alt="L-Safe Logo" width={40} height={40} />
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg">
              {qrCodeValue && <QRCode value={qrCodeValue} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />}
            </div>
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Scan Using Ideagen EHS Mobile App
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
 
    

    

    
