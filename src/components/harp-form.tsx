
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
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, FileDown, Loader2, QrCode, Save } from "lucide-react";
import { format } from "date-fns";
import QRCode from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

export default function HarpForm() {
  const { toast } = useToast();
  const formRef = React.useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [qrCodeValue, setQrCodeValue] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        harpId: "",
        activity: "",
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
    const valid = formSchema.safeParse(values);
    if (valid.success) {
      setQrCodeValue(JSON.stringify(values));
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Data",
        description: "Please fill in all required fields before generating a QR code.",
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
            <Button variant="outline" onClick={handleGenerateQrCode}>
              <QrCode />
              Generate QR Code
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
              <Accordion type="multiple" defaultValue={['general-details']} className="w-full">
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
                            <FormLabel className="text-right col-span-1">Date*</FormLabel>
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
                            <FormLabel className="text-right col-span-1">Location*</FormLabel>
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
                            <FormLabel className="text-right col-span-1 pt-2">Department*</FormLabel>
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
                            <FormLabel className="text-right col-span-1 pt-2">Block*</FormLabel>
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
                            <FormLabel className="text-right col-span-1 pt-2">Floor*</FormLabel>
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
                            <FormLabel className="text-right col-span-1">Activity*</FormLabel>
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
                            <FormLabel className="text-right col-span-1">Carried Out By*</FormLabel>
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
                            <FormLabel className="text-right col-span-1">Employee Type</FormLabel>
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
                            <FormLabel className="text-right col-span-1">Employee Name*</FormLabel>
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
                            <FormLabel className="text-right col-span-1">Employee ID</FormLabel>
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
                            <FormLabel className="text-right col-span-1">Designation</FormLabel>
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
                            <FormLabel className="text-right col-span-1">Employee Department</FormLabel>
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
                    <p className="text-muted-foreground">HARP details can be added here in the future.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="other-details">
                  <AccordionTrigger className="text-lg font-semibold">Other Details</AccordionTrigger>
                  <AccordionContent className="pt-4 flex justify-center">
                    <p className="text-muted-foreground">Additional details can be added here in the future.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-4">
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
            Save HARP Data
          </Button>
        </CardFooter>
      </Card>
      <Dialog open={!!qrCodeValue} onOpenChange={(open) => !open && setQrCodeValue(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">HARP Data QR Code</DialogTitle>
            <DialogDescription>
              Scan this code to easily access or share the HARP details.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-white rounded-lg">
            {qrCodeValue && <QRCode value={qrCodeValue} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

    

    